// 1. Serviço principal do Pomodoro — gerencia sessões, pontuação, árvore e recuperação
package com.pomodoro.service;

import com.pomodoro.model.PomodoroSession;
import com.pomodoro.model.SessionStatus;
import com.pomodoro.model.SessionTipo;
import com.pomodoro.model.TreeEstagio;
import com.pomodoro.model.TreeState;
import com.pomodoro.model.Usuario;
import com.pomodoro.repository.PomodoroSessionRepository;
import com.pomodoro.repository.TreeStateRepository;
import com.pomodoro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PomodoroSessionService {

  // 2. Constantes do jogo
  private static final int FOCUS_DURATION_SEGUNDOS = 25 * 60;  // 25 minutos de foco
  private static final int GRACE_SEGUNDOS = 120;                // 2 min de tolerância para recuperar
  private static final int TOMATES_POR_CICLO = 10;              // tomates por foco completo

  private final PomodoroSessionRepository sessionRepository;
  private final TreeStateRepository treeStateRepository;
  private final UsuarioRepository usuarioRepository;

  public PomodoroSessionService(PomodoroSessionRepository sessionRepository,
                                TreeStateRepository treeStateRepository,
                                UsuarioRepository usuarioRepository) {
    this.sessionRepository = sessionRepository;
    this.treeStateRepository = treeStateRepository;
    this.usuarioRepository = usuarioRepository;
  }

  // 3. Inicia uma nova sessão ou recupera uma existente (se dentro da graça de 120s)
  @Transactional
  public PomodoroSession start(Long usuarioId, SessionTipo tipo) {
    Optional<PomodoroSession> existing = sessionRepository
        .findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS);

    if (existing.isPresent()) {
      PomodoroSession sessao = existing.get();

      if (tipo == SessionTipo.FOCUS) {
        // 4. Verifica se ainda está dentro do tempo de graça (25min + 120s)
        long elapsed = Duration.between(sessao.getStartedAt(), LocalDateTime.now()).getSeconds();
        if (elapsed > FOCUS_DURATION_SEGUNDOS + GRACE_SEGUNDOS) {
          failSession(sessao);  // 5. Excedeu → árvore morre
        } else {
          return sessao;        // 6. Dentro da graça → retoma
        }
      } else {
        // 7. Se quer iniciar pausa mas há foco em andamento, cancela o foco
        sessao.setStatus(SessionStatus.CANCELED);
        sessao.setFinishedAt(LocalDateTime.now());
        sessionRepository.save(sessao);
      }
    }

    // 8. Cria nova sessão
    PomodoroSession nova = new PomodoroSession(usuarioId, tipo);
    sessionRepository.save(nova);

    // 9. Garante que o usuário tem um TreeState (seed padrão)
    ensureTreeState(usuarioId);

    return nova;
  }

  // 10. Retorna a sessão atual se existir e estiver dentro do prazo
  public PomodoroSession getCurrent(Long usuarioId) {
    Optional<PomodoroSession> opt = sessionRepository
        .findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS);

    if (opt.isEmpty()) return null;

    PomodoroSession session = opt.get();

    if (session.getTipo() == SessionTipo.FOCUS) {
      long elapsed = Duration.between(session.getStartedAt(), LocalDateTime.now()).getSeconds();

      if (elapsed > FOCUS_DURATION_SEGUNDOS + GRACE_SEGUNDOS) {
        failSession(session);   // 11. Excedeu o tempo → falha e retorna null
        return null;
      }
    }

    return session;
  }

  // 12. Finaliza a sessão — concede tomates e evolui a árvore se for foco
  @Transactional
  public PomodoroSession finish(Long usuarioId) {
    PomodoroSession session = sessionRepository
        .findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS)
        .orElseThrow(() -> new RuntimeException("Nenhuma sessão em andamento."));

    session.setStatus(SessionStatus.COMPLETED);
    session.setFinishedAt(LocalDateTime.now());

    if (session.getTipo() == SessionTipo.FOCUS) {
      long elapsed = Duration.between(session.getStartedAt(), session.getFinishedAt()).getSeconds();
      if (elapsed > FOCUS_DURATION_SEGUNDOS) {
        elapsed = FOCUS_DURATION_SEGUNDOS;  // 13. Limita ao tempo máximo
      }

      int tomates = TOMATES_POR_CICLO;

      session.setTomatesGanhos(tomates);

      // 14. Acumula tomates no usuário
      Usuario usuario = usuarioRepository.findById(usuarioId)
          .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
      usuario.setTomates(usuario.getTomates() + tomates);
      usuarioRepository.save(usuario);

      // 15. Evolui a árvore (SEED → SEEDLING → TREE)
      evolveTree(usuarioId);
    }

    sessionRepository.save(session);
    return session;
  }

  // 16. Cancela a sessão em andamento (reset manual)
  @Transactional
  public void reset(Long usuarioId) {
    Optional<PomodoroSession> opt = sessionRepository
        .findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS);

    if (opt.isPresent()) {
      PomodoroSession session = opt.get();
      session.setStatus(SessionStatus.CANCELED);
      session.setFinishedAt(LocalDateTime.now());
      sessionRepository.save(session);
    }
  }

  // 17. Calcula quanto tempo ainda resta da sessão de foco
  public long calcularTempoRestante(PomodoroSession session) {
    if (session.getTipo() != SessionTipo.FOCUS) return 0;

    long elapsed = Duration.between(session.getStartedAt(), LocalDateTime.now()).getSeconds();
    long remaining = FOCUS_DURATION_SEGUNDOS - elapsed;
    return Math.max(remaining, 0);
  }

  // 18. Marca a sessão como falha e mata a árvore
  private void failSession(PomodoroSession session) {
    session.setStatus(SessionStatus.FAILED);
    session.setFinishedAt(LocalDateTime.now());
    sessionRepository.save(session);

    treeStateRepository.findByUsuarioId(session.getUsuarioId()).ifPresent(tree -> {
      tree.setMorta(true);
      tree.setUpdatedAt(LocalDateTime.now());
      treeStateRepository.save(tree);
    });
  }

  // 19. Cria um TreeState (seed) se o usuário ainda não tiver um
  private void ensureTreeState(Long usuarioId) {
    if (treeStateRepository.findByUsuarioId(usuarioId).isEmpty()) {
      treeStateRepository.save(new TreeState(usuarioId));
    }
  }

  // 20. Evolui a árvore: a cada ciclo (3 focos) reinicia SEED → SEEDLING → TREE
  private void evolveTree(Long usuarioId) {
    TreeState tree = treeStateRepository.findByUsuarioId(usuarioId)
        .orElseGet(() -> {
          TreeState t = new TreeState(usuarioId);
          return treeStateRepository.save(t);
        });

    tree.setFocosCompletos(tree.getFocosCompletos() + 1);
    tree.setMorta(false);                       // 21. Revive se estava morta
    tree.setUpdatedAt(LocalDateTime.now());

    int focosNoCiclo = tree.getFocosCompletos() % 3;  // 0, 1, 2
    if (focosNoCiclo == 2) {                    // 22. 2 → árvore adulta
      tree.setEstagio(TreeEstagio.TREE);
    } else if (focosNoCiclo == 1) {             // 23. 1 → muda
      tree.setEstagio(TreeEstagio.SEEDLING);
    } else {                                    // 24. 0 → semente (reinicia ciclo)
      tree.setEstagio(TreeEstagio.SEED);
    }

    treeStateRepository.save(tree);
  }
}

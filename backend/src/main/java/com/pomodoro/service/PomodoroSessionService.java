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

  private static final int FOCUS_DURATION_SEGUNDOS = 25 * 60;
  private static final int GRACE_SEGUNDOS = 120;
  private static final int PONTOS_POR_MINUTO = 1;
  private static final int BONUS_CONCLUSAO = 10;
  private static final int TOMATE_INTERVALO_SEGUNDOS = 5 * 60;

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

  @Transactional
  public PomodoroSession start(Long usuarioId, SessionTipo tipo) {
    Optional<PomodoroSession> existing = sessionRepository
        .findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS);

    if (existing.isPresent()) {
      PomodoroSession sessao = existing.get();

      if (tipo == SessionTipo.FOCUS) {
        long elapsed = Duration.between(sessao.getStartedAt(), LocalDateTime.now()).getSeconds();
        if (elapsed > FOCUS_DURATION_SEGUNDOS + GRACE_SEGUNDOS) {
          failSession(sessao);
        } else {
          return sessao;
        }
      } else {
        sessao.setStatus(SessionStatus.CANCELED);
        sessao.setFinishedAt(LocalDateTime.now());
        sessionRepository.save(sessao);
      }
    }

    PomodoroSession nova = new PomodoroSession(usuarioId, tipo);
    sessionRepository.save(nova);

    ensureTreeState(usuarioId);

    return nova;
  }

  public PomodoroSession getCurrent(Long usuarioId) {
    Optional<PomodoroSession> opt = sessionRepository
        .findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS);

    if (opt.isEmpty()) return null;

    PomodoroSession session = opt.get();

    if (session.getTipo() == SessionTipo.FOCUS) {
      long elapsed = Duration.between(session.getStartedAt(), LocalDateTime.now()).getSeconds();

      if (elapsed > FOCUS_DURATION_SEGUNDOS + GRACE_SEGUNDOS) {
        failSession(session);
        return null;
      }
    }

    return session;
  }

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
        elapsed = FOCUS_DURATION_SEGUNDOS;
      }

      int minutos = (int) (elapsed / 60);
      int pontos = minutos * PONTOS_POR_MINUTO + BONUS_CONCLUSAO;
      int tomates = (int) (elapsed / TOMATE_INTERVALO_SEGUNDOS);

      session.setPontosGanhos(pontos);
      session.setTomatesGanhos(tomates);

      Usuario usuario = usuarioRepository.findById(usuarioId)
          .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
      usuario.setPontos(usuario.getPontos() + pontos);
      usuario.setTomates(usuario.getTomates() + tomates);
      usuarioRepository.save(usuario);

      evolveTree(usuarioId);
    }

    sessionRepository.save(session);
    return session;
  }

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

  public long calcularTempoRestante(PomodoroSession session) {
    if (session.getTipo() != SessionTipo.FOCUS) return 0;

    long elapsed = Duration.between(session.getStartedAt(), LocalDateTime.now()).getSeconds();
    long remaining = FOCUS_DURATION_SEGUNDOS - elapsed;
    return Math.max(remaining, 0);
  }

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

  private void ensureTreeState(Long usuarioId) {
    if (treeStateRepository.findByUsuarioId(usuarioId).isEmpty()) {
      treeStateRepository.save(new TreeState(usuarioId));
    }
  }

  private void evolveTree(Long usuarioId) {
    TreeState tree = treeStateRepository.findByUsuarioId(usuarioId)
        .orElseGet(() -> {
          TreeState t = new TreeState(usuarioId);
          return treeStateRepository.save(t);
        });

    tree.setFocosCompletos(tree.getFocosCompletos() + 1);
    tree.setMorta(false);
    tree.setUpdatedAt(LocalDateTime.now());

    int focos = tree.getFocosCompletos();
    if (focos >= 3) {
      tree.setEstagio(TreeEstagio.TREE);
    } else if (focos >= 1) {
      tree.setEstagio(TreeEstagio.SEEDLING);
    }

    treeStateRepository.save(tree);
  }
}

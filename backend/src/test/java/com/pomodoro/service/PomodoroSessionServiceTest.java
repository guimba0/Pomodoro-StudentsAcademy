// 1. Testes do serviço de sessão Pomodoro — start, finish, reset, árvore
package com.pomodoro.service;

import com.pomodoro.model.*;
import com.pomodoro.repository.PomodoroSessionRepository;
import com.pomodoro.repository.TreeStateRepository;
import com.pomodoro.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PomodoroSessionServiceTest {

  @Mock private PomodoroSessionRepository sessionRepository;
  @Mock private TreeStateRepository treeStateRepository;
  @Mock private UsuarioRepository usuarioRepository;

  @InjectMocks private PomodoroSessionService service;

  private final Long usuarioId = 1L;
  private PomodoroSession sessionAtiva;
  private Usuario usuario;
  private TreeState treeState;

  @BeforeEach
  void setUp() {
    sessionAtiva = new PomodoroSession(usuarioId, SessionTipo.FOCUS);
    sessionAtiva.setId(10L);

    usuario = new Usuario("João", "joao@email.com", "hash123");
    usuario.setId(usuarioId);

    treeState = new TreeState(usuarioId);
    treeState.setId(1L);
  }

  // 2. Start — cria nova sessão quando não existe nenhuma em andamento
  @Test
  @DisplayName("start cria nova sessão quando não existe nenhuma em andamento")
  void start_CriaNovaSession_QuandoNaoExisteEmAndamento() {
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.empty());
    when(treeStateRepository.findByUsuarioId(usuarioId))
        .thenReturn(Optional.of(treeState));

    PomodoroSession resultado = service.start(usuarioId, SessionTipo.FOCUS);

    assertNotNull(resultado);
    assertEquals(SessionTipo.FOCUS, resultado.getTipo());
    assertEquals(SessionStatus.IN_PROGRESS, resultado.getStatus());
    verify(sessionRepository).save(any(PomodoroSession.class));
  }

  // 3. Start — retoma sessão existente quando dentro do tempo de graça
  @Test
  @DisplayName("start retoma sessão existente quando dentro do tempo de graça")
  void start_RetomaSession_QuandoDentroDaGraca() {
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.of(sessionAtiva));

    PomodoroSession resultado = service.start(usuarioId, SessionTipo.FOCUS);

    assertNotNull(resultado);
    assertEquals(sessionAtiva.getId(), resultado.getId());
    verify(sessionRepository, never()).save(any(PomodoroSession.class));
  }

  // 4. Finish — foco concluído adiciona pontos, tomates e evolui árvore
  @Test
  @DisplayName("finish em sessão de foco adiciona pontos, tomates e evolui árvore")
  void finish_Foco_AdicionaPontosETomatesEVoluiArvore() {
    sessionAtiva.setStatus(SessionStatus.IN_PROGRESS);
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.of(sessionAtiva));
    when(usuarioRepository.findById(usuarioId))
        .thenReturn(Optional.of(usuario));
    when(treeStateRepository.findByUsuarioId(usuarioId))
        .thenReturn(Optional.of(treeState));

    PomodoroSession resultado = service.finish(usuarioId);

    assertEquals(SessionStatus.COMPLETED, resultado.getStatus());
    assertEquals(10, resultado.getPontosGanhos());
    assertEquals(10, resultado.getTomatesGanhos());
    assertEquals(10, usuario.getPontos());
    assertEquals(10, usuario.getTomates());
    verify(usuarioRepository).save(usuario);
    verify(treeStateRepository).save(any(TreeState.class));
  }

  // 5. Finish — pausa NÃO adiciona pontos nem tomates
  @Test
  @DisplayName("finish em sessão de pausa NÃO adiciona pontos nem tomates")
  void finish_Pausa_NaoAdicionaPontos() {
    PomodoroSession pausa = new PomodoroSession(usuarioId, SessionTipo.SHORT_BREAK);
    pausa.setId(20L);

    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.of(pausa));

    PomodoroSession resultado = service.finish(usuarioId);

    assertEquals(SessionStatus.COMPLETED, resultado.getStatus());
    assertEquals(0, resultado.getPontosGanhos());
    assertEquals(0, resultado.getTomatesGanhos());
    verify(usuarioRepository, never()).findById(anyLong());
  }

  // 6. Finish — lança exceção quando não há sessão em andamento
  @Test
  @DisplayName("finish lança exceção quando não há sessão em andamento")
  void finish_LancaExcecao_QuandoNaoHaSession() {
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.empty());

    assertThrows(RuntimeException.class, () -> service.finish(usuarioId));
  }

  // 7. Reset — cancela sessão em andamento
  @Test
  @DisplayName("reset cancela sessão em andamento")
  void reset_CancelaSession() {
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.of(sessionAtiva));

    service.reset(usuarioId);

    assertEquals(SessionStatus.CANCELED, sessionAtiva.getStatus());
    verify(sessionRepository).save(sessionAtiva);
  }

  // 8. Reset — não faz nada quando não há sessão em andamento
  @Test
  @DisplayName("reset não faz nada quando não há sessão em andamento")
  void reset_NaoFazNada_QuandoNaoHaSession() {
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.empty());

    service.reset(usuarioId);

    verify(sessionRepository, never()).save(any());
  }

  // 9. GetCurrent — retorna null quando não há sessão em andamento
  @Test
  @DisplayName("getCurrent retorna null quando não há sessão em andamento")
  void getCurrent_RetornaNull_QuandoNaoExiste() {
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.empty());

    assertNull(service.getCurrent(usuarioId));
  }

  // 10. EvolveTree — transiciona SEED → SEEDLING após 1 foco
  @Test
  @DisplayName("evolveTree transiciona SEED → SEEDLING após 1 foco")
  void evolveTree_Seed_Para_Seedling() {
    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.of(sessionAtiva));
    when(usuarioRepository.findById(usuarioId))
        .thenReturn(Optional.of(usuario));
    when(treeStateRepository.findByUsuarioId(usuarioId))
        .thenReturn(Optional.of(treeState));

    assertEquals(TreeEstagio.SEED, treeState.getEstagio());
    assertEquals(0, treeState.getFocosCompletos());

    service.finish(usuarioId);

    assertEquals(TreeEstagio.SEEDLING, treeState.getEstagio());
    assertEquals(1, treeState.getFocosCompletos());
    assertFalse(treeState.isMorta());
  }

  // 11. EvolveTree — transiciona SEEDLING → TREE após 3 focos
  @Test
  @DisplayName("evolveTree transiciona SEEDLING → TREE após 3 focos")
  void evolveTree_Seedling_Para_Tree() {
    treeState.setFocosCompletos(2);
    treeState.setEstagio(TreeEstagio.SEEDLING);

    when(sessionRepository.findByUsuarioIdAndStatus(usuarioId, SessionStatus.IN_PROGRESS))
        .thenReturn(Optional.of(sessionAtiva));
    when(usuarioRepository.findById(usuarioId))
        .thenReturn(Optional.of(usuario));
    when(treeStateRepository.findByUsuarioId(usuarioId))
        .thenReturn(Optional.of(treeState));

    service.finish(usuarioId);

    assertEquals(TreeEstagio.TREE, treeState.getEstagio());
    assertEquals(3, treeState.getFocosCompletos());
  }

  // 12. Calcular tempo restante — retorna 0 para sessão que não é FOCUS
  @Test
  @DisplayName("calcularTempoRestante retorna 0 para sessão que não é FOCUS")
  void calcularTempoRestante_RetornaZero_QuandoNaoFocus() {
    PomodoroSession pausa = new PomodoroSession(usuarioId, SessionTipo.SHORT_BREAK);
    assertEquals(0, service.calcularTempoRestante(pausa));
  }
}

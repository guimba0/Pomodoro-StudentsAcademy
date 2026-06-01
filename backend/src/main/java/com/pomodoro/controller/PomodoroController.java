// 1. Controller do Pomodoro — gerencia sessões de foco, pausas, progresso e árvore
package com.pomodoro.controller;

import com.pomodoro.dto.PomodoroResponse;
import com.pomodoro.dto.PomodoroStartRequest;
import com.pomodoro.dto.ProgressoResponse;
import com.pomodoro.dto.UsuarioResponse;
import com.pomodoro.model.PomodoroSession;
import com.pomodoro.model.SessionTipo;
import com.pomodoro.model.TreeState;
import com.pomodoro.model.Usuario;
import com.pomodoro.repository.TreeStateRepository;
import com.pomodoro.repository.UsuarioRepository;
import com.pomodoro.service.PomodoroSessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/pomodoro")
public class PomodoroController {

  private final PomodoroSessionService sessionService;
  private final TreeStateRepository treeStateRepository;
  private final UsuarioRepository usuarioRepository;

  public PomodoroController(PomodoroSessionService sessionService,
                            TreeStateRepository treeStateRepository,
                            UsuarioRepository usuarioRepository) {
    this.sessionService = sessionService;
    this.treeStateRepository = treeStateRepository;
    this.usuarioRepository = usuarioRepository;
  }

  // 2. POST /api/pomodoro/start — inicia ou recupera uma sessão (FOCUS / SHORT_BREAK / LONG_BREAK)
  @PostMapping("/start")
  public ResponseEntity<?> start(@Valid @RequestBody PomodoroStartRequest req, HttpServletRequest request) {
    Long usuarioId = (Long) request.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }

    try {
      SessionTipo tipo = SessionTipo.valueOf(req.getTipo().toUpperCase());
      PomodoroSession sessao = sessionService.start(usuarioId, tipo);

      long restante = sessionService.calcularTempoRestante(sessao);
      boolean recuperada = sessao.getStatus() == com.pomodoro.model.SessionStatus.IN_PROGRESS
          && Duration.between(sessao.getStartedAt(), java.time.LocalDateTime.now()).getSeconds() > 2;

      return ResponseEntity.ok(new PomodoroResponse(sessao, restante, recuperada));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(new UsuarioResponse("Tipo inválido. Use FOCUS, SHORT_BREAK ou LONG_BREAK."));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new UsuarioResponse(e.getMessage()));
    }
  }

  // 3. GET /api/pomodoro/current — retorna a sessão atual (usado na recuperação 120s)
  @GetMapping("/current")
  public ResponseEntity<?> current(HttpServletRequest request) {
    Long usuarioId = (Long) request.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }

    PomodoroSession sessao = sessionService.getCurrent(usuarioId);
    if (sessao == null) {
      return ResponseEntity.ok(Map.of(
        "sessao", "nenhuma",
        "mensagem", "Nenhuma sessão em andamento."
      ));
    }

    long restante = sessionService.calcularTempoRestante(sessao);
    boolean recuperada = true;

    return ResponseEntity.ok(new PomodoroResponse(sessao, restante, recuperada));
  }

  // 4. POST /api/pomodoro/finish — finaliza o foco, concede pontos e evolui a árvore
  @PostMapping("/finish")
  public ResponseEntity<?> finish(HttpServletRequest request) {
    Long usuarioId = (Long) request.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }

    try {
      PomodoroSession sessao = sessionService.finish(usuarioId);
      return ResponseEntity.ok(Map.of(
        "mensagem", "Foco concluído!",
        "pontosGanhos", sessao.getPontosGanhos(),
        "tomatesGanhos", sessao.getTomatesGanhos()
      ));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new UsuarioResponse(e.getMessage()));
    }
  }

  // 5. POST /api/pomodoro/reset — cancela a sessão em andamento
  @PostMapping("/reset")
  public ResponseEntity<?> reset(HttpServletRequest request) {
    Long usuarioId = (Long) request.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }

    sessionService.reset(usuarioId);
    return ResponseEntity.ok(Map.of("mensagem", "Sessão cancelada."));
  }

  // 6. GET /api/pomodoro/progresso — retorna pontos, tomates e estado da árvore do usuário
  @GetMapping("/progresso")
  public ResponseEntity<?> progresso(HttpServletRequest request) {
    Long usuarioId = (Long) request.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }

    Usuario usuario = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

    TreeState tree = treeStateRepository.findByUsuarioId(usuarioId).orElse(null);

    return ResponseEntity.ok(new ProgressoResponse(usuario.getPontos(), usuario.getTomates(), tree));
  }
}

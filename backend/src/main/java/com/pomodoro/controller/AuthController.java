package com.pomodoro.controller;

import com.pomodoro.dto.CadastroRequest;
import com.pomodoro.dto.LoginRequest;
import com.pomodoro.dto.UsuarioResponse;
import com.pomodoro.model.Usuario;
import com.pomodoro.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

  private final UsuarioService usuarioService;

  public AuthController(UsuarioService usuarioService) {
    this.usuarioService = usuarioService;
  }

  @PostMapping("/cadastro")
  public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroRequest req) {
    try {
      Usuario usuario = usuarioService.cadastrar(
        req.getNome(), req.getEmail(), req.getSenha()
      );
      return ResponseEntity.ok(usuario);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpSession session) {
    var usuarioOpt = usuarioService.login(req.getEmail(), req.getSenha());
    if (usuarioOpt.isPresent()) {
      session.setAttribute("usuarioId", usuarioOpt.get().getId());
      return ResponseEntity.ok(usuarioOpt.get());
    }
    return ResponseEntity.status(401).body(Map.of("erro", "E-mail ou senha inválidos."));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession session) {
    Long usuarioId = (Long) session.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(Map.of("erro", "Não autenticado"));
    }
    var usuarioOpt = usuarioService.buscarPorId(usuarioId);
    if (usuarioOpt.isPresent()) {
      return ResponseEntity.ok(usuarioOpt.get());
    }
    return ResponseEntity.status(404).body(Map.of("erro", "Usuário não encontrado"));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(Map.of("mensagem", "Logout realizado"));
  }

  @GetMapping("/ranking")
  public ResponseEntity<?> ranking() {
    return ResponseEntity.ok(usuarioService.obterTopRanking());
  }
}

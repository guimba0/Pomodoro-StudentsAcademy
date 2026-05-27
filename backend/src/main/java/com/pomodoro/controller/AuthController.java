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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
public class AuthController {

  private final UsuarioService usuarioService;

  public AuthController(UsuarioService usuarioService) {
    this.usuarioService = usuarioService;
  }

  @PostMapping("/cadastro")
  public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroRequest req) {
    try {
      Usuario u = usuarioService.cadastrar(req.getNome(), req.getEmail(), req.getSenha());
      return ResponseEntity.ok(new UsuarioResponse(true, u.getNome(), u.getEmail()));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new UsuarioResponse(e.getMessage()));
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpSession session) {
    var usuarioOpt = usuarioService.login(req.getEmail(), req.getSenha());
    if (usuarioOpt.isPresent()) {
      Usuario u = usuarioOpt.get();
      session.setAttribute("usuarioId", u.getId());
      return ResponseEntity.ok(new UsuarioResponse(true, u.getNome(), u.getEmail()));
    }
    return ResponseEntity.status(401).body(new UsuarioResponse("E-mail ou senha inválidos."));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession session) {
    Long usuarioId = (Long) session.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }
    var usuarioOpt = usuarioService.buscarPorId(usuarioId);
    if (usuarioOpt.isPresent()) {
      Usuario u = usuarioOpt.get();
      return ResponseEntity.ok(new UsuarioResponse(true, u.getNome(), u.getEmail()));
    }
    return ResponseEntity.status(404).body(new UsuarioResponse("Usuário não encontrado"));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(Map.of("mensagem", "Logout realizado"));
  }

  @PostMapping("/esqueci-senha")
  public ResponseEntity<?> redefinirSenha(@RequestBody Map<String, String> dados) {
    try {
      String email = dados.get("email");
      String novaSenha = dados.get("novaSenha");
      if (novaSenha == null) novaSenha = dados.get("senha");
      if (email == null || novaSenha == null) {
        return ResponseEntity.badRequest().body(new UsuarioResponse("E-mail ou senha não enviados corretamente."));
      }
      usuarioService.redefinirSenha(email, novaSenha);
      return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso!"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(new UsuarioResponse("Não foi possível alterar: " + e.getMessage()));
    }
  }

  @GetMapping("/ranking")
  public ResponseEntity<?> ranking() {
    return ResponseEntity.ok(usuarioService.obterTopRanking());
  }
}

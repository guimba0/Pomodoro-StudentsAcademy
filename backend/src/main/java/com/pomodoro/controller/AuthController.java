package com.pomodoro.controller;

import com.pomodoro.dto.AtualizarRequest;
import com.pomodoro.dto.CadastroRequest;
import com.pomodoro.dto.LoginRequest;
import com.pomodoro.dto.RedefinirSenhaRequest;
import com.pomodoro.dto.UsuarioResponse;
import com.pomodoro.model.Usuario;
import com.pomodoro.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // <-- Importado para suportar a lista do ranking

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // <-- Importante para o seu React conseguir acessar o backend sem erro de CORS
public class AuthController {

  private final UsuarioService service;

  public AuthController(UsuarioService service) {
    this.service = service;
  }

  @PostMapping("/cadastro")
  public ResponseEntity<UsuarioResponse> cadastro(@Valid @RequestBody CadastroRequest req) {
    service.cadastrar(req.getNome(), req.getEmail(), req.getSenha());
    return ResponseEntity.ok(new UsuarioResponse(true));
  }

  @PostMapping("/login")
  public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest req, HttpSession session) {
    Usuario user = service.login(req.getEmail(), req.getSenha())
        .orElseThrow(() -> new RuntimeException("Email ou senha incorretos."));
    session.setAttribute("userId", user.getId());
    return ResponseEntity.ok(new UsuarioResponse(true, user.getNome(), user.getEmail()));
  }

  @PostMapping("/logout")
  public ResponseEntity<UsuarioResponse> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(new UsuarioResponse(true));
  }

  @GetMapping("/me")
  public ResponseEntity<UsuarioResponse> me(HttpSession session) {
    Long userId = getUserId(session);
    if (userId == null) {
      return ResponseEntity.ok(new UsuarioResponse(false));
    }
    return service.buscarPorId(userId)
        .map(u -> ResponseEntity.ok(new UsuarioResponse(true, u.getNome(), u.getEmail())))
        .orElse(ResponseEntity.ok(new UsuarioResponse(false)));
  }

  @PostMapping("/esqueci-senha")
  public ResponseEntity<UsuarioResponse> esqueciSenha(@Valid @RequestBody RedefinirSenhaRequest req) {
    service.redefinirSenha(req.getEmail(), req.getSenha());
    return ResponseEntity.ok(new UsuarioResponse(true));
  }

  @PutMapping("/me")
  public ResponseEntity<UsuarioResponse> atualizar(@Valid @RequestBody AtualizarRequest req, HttpSession session) {
    Long userId = getUserId(session);
    if (userId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado."));
    }
    Usuario u = service.atualizar(userId, req.getNome(), req.getEmail(), req.getSenha());
    return ResponseEntity.ok(new UsuarioResponse(true, u.getNome(), u.getEmail()));
  }

  // Buscar o Ranking de Usuários
  @GetMapping("/ranking")
  public ResponseEntity<List<Usuario>> obterRanking() {
    List<Usuario> ranking = service.obterTopRanking();
    return ResponseEntity.ok(ranking);
  }

  private Long getUserId(HttpSession session) {
    return (Long) session.getAttribute("userId");
  }
}

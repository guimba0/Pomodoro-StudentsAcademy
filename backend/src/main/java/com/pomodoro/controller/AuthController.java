// 1. Controller de autenticação e usuário — gerencia cadastro, login, perfil e ranking
package com.pomodoro.controller;

import com.pomodoro.config.JwtUtil;
import com.pomodoro.dto.AtualizarRequest;
import com.pomodoro.dto.CadastroRequest;
import com.pomodoro.dto.LoginRequest;
import com.pomodoro.dto.LoginResponse;
import com.pomodoro.dto.RankingResponse;
import com.pomodoro.dto.UsuarioResponse;
import com.pomodoro.model.Usuario;
import com.pomodoro.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// 

@RestController
@RequestMapping("/api")
public class AuthController {

  private final UsuarioService usuarioService;
  private final JwtUtil jwtUtil;

  public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil) {
    this.usuarioService = usuarioService;
    this.jwtUtil = jwtUtil;
  }

  // 2. POST /api/cadastro — cria um novo usuário e retorna o JWT
  @PostMapping("/cadastro")
  public ResponseEntity<?> cadastrar(@Valid @RequestBody CadastroRequest req) {
    try {
      Usuario u = usuarioService.cadastrar(req.getNome(), req.getEmail(), req.getSenha());
      String token = jwtUtil.gerarToken(u.getId());
      return ResponseEntity.ok(new LoginResponse(true, token, u.getId(), u.getNome(), u.getEmail(), u.getAvatar(), u.getWallpaper(), u.getPontos(), u.getTomates()));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new LoginResponse(e.getMessage()));
    }
  }

  // 3. POST /api/login — autentica email+senha e retorna o JWT
  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
    var usuarioOpt = usuarioService.login(req.getEmail(), req.getSenha());
    if (usuarioOpt.isPresent()) {
      Usuario u = usuarioOpt.get();
      String token = jwtUtil.gerarToken(u.getId());
      return ResponseEntity.ok(new LoginResponse(true, token, u.getId(), u.getNome(), u.getEmail(), u.getAvatar(), u.getWallpaper(), u.getPontos(), u.getTomates()));
    }
    return ResponseEntity.status(401).body(new LoginResponse("E-mail ou senha inválidos."));
  }

  // 4. GET /api/me — retorna nome e email do usuário autenticado
  @GetMapping("/me")
  public ResponseEntity<?> me(HttpServletRequest req) {
    Long usuarioId = (Long) req.getAttribute("usuarioId");
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

  // 5. PUT /api/me — atualiza nome, email e/ou senha do usuário autenticado
  @PutMapping("/me")
  public ResponseEntity<?> atualizar(@Valid @RequestBody AtualizarRequest req, HttpServletRequest request) {
    Long usuarioId = (Long) request.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }
    try {
      Usuario u = usuarioService.atualizar(usuarioId, req.getNome(), req.getEmail(), req.getSenha());
      return ResponseEntity.ok(new UsuarioResponse(true, u.getNome(), u.getEmail()));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new UsuarioResponse(e.getMessage()));
    }
  }

  // 6. POST /api/logout — endpoint simbólico (o logout é feito no frontend removendo o token)
  @PostMapping("/logout")
  public ResponseEntity<?> logout() {
    return ResponseEntity.ok(Map.of("mensagem", "Logout realizado"));
  }

  // 7. POST /api/esqueci-senha — redefine a senha pelo email
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

  // 8. POST /api/usuarios/adicionar-pontos — adiciona 10 pontos ao usuário
  @PostMapping("/usuarios/adicionar-pontos")
  public ResponseEntity<?> adicionarPontos(HttpServletRequest req) {
    Long usuarioId = (Long) req.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(new UsuarioResponse("Não autenticado"));
    }
    try {
      usuarioService.adicionarPontos(usuarioId, 10);
      return ResponseEntity.ok(Map.of("mensagem", "Pontos adicionados!"));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(new UsuarioResponse(e.getMessage()));
    }
  }

  // 9. GET /api/ranking — top 10 usuários com mais ciclos completos
  @GetMapping("/ranking")
  public ResponseEntity<?> ranking() {
    List<RankingResponse> ranking = usuarioService.obterTopRanking();
    return ResponseEntity.ok(ranking);
  }
}

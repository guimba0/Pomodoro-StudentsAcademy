package com.pomodoro.controller;

import com.pomodoro.model.Usuario;
import com.pomodoro.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")

@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            Usuario novoUsuario = usuarioService.cadastrar(usuario.getNome(), usuario.getEmail(), usuario.getSenha());
            return ResponseEntity.ok(novoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        String email = dados.get("email");
        String senha = dados.get("senha");

        Optional<Usuario> usuario = usuarioService.login(email, senha);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(401).body(Map.of("erro", "E-mail ou senha inválidos."));
        }
    }
    @GetMapping("/ranking")
    public ResponseEntity<List<Usuario>> obterRanking() {
        List<Usuario> topRanking = usuarioService.obterTopRanking();
        return ResponseEntity.ok(topRanking);
    }
}

package com.pomodoro.service;

import com.pomodoro.model.Usuario;
import com.pomodoro.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;
  private final BCryptPasswordEncoder passwordEncoder;

  public UsuarioService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public List<Usuario> obterTopRanking() {
    return usuarioRepository.findTop10ByOrderByPontosDesc();
  }

  public Usuario adicionarPontos(Long id, int pontosGanhos) {
    Usuario usuario = usuarioRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    usuario.setPontos(usuario.getPontos() + pontosGanhos);
    return usuarioRepository.save(usuario);
  }

  public Usuario cadastrar(String nome, String email, String senha) {
    if (usuarioRepository.findByEmail(email).isPresent()) {
      throw new RuntimeException("Este e-mail já está cadastrado.");
    }
    Usuario novoUsuario = new Usuario(nome, email, passwordEncoder.encode(senha));
    return usuarioRepository.save(novoUsuario);
  }

  public Optional<Usuario> login(String email, String senha) {
    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
    if (usuarioOpt.isPresent() && passwordEncoder.matches(senha, usuarioOpt.get().getSenha())) {
      return usuarioOpt;
    }
    return Optional.empty();
  }

  public Optional<Usuario> buscarPorId(Long id) {
    return usuarioRepository.findById(id);
  }

  public void redefinirSenha(String email, String novaSenha) {
    Usuario usuario = usuarioRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    usuario.setSenha(passwordEncoder.encode(novaSenha));
    usuarioRepository.save(usuario);
  }

  public Usuario atualizar(Long id, String nome, String email, String senha) {
    Usuario usuario = usuarioRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    if (usuarioRepository.existsByEmailAndIdNot(email, id)) {
      throw new RuntimeException("Este e-mail já está sendo usado por outro usuário.");
    }
    usuario.setNome(nome);
    usuario.setEmail(email);
    if (senha != null && !senha.isBlank()) {
      usuario.setSenha(passwordEncoder.encode(senha));
    }
    return usuarioRepository.save(usuario);
  }
}

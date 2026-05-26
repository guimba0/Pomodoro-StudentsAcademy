package com.pomodoro.service;

import com.pomodoro.model.Usuario;
import com.pomodoro.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;

public class UsuarioService {

  private final UsuarioRepository usuarioRepository;

  public UsuarioService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  public List<Usuario> obterTopRanking() {
    return usuarioRepository.findTop10ByOrderByPontosDesc();
  }

  public Usuario adicionarPontos(Long id, int pontosGanhos) {
    Usuario usuario = usuarioRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    usuario.setPontos(usuario.getPontos() + pontosGanhos);
    return usuarioRepository.update(usuario);
  }

  public Usuario cadastrar(String nome, String email, String senha) {
    if (usuarioRepository.findByEmail(email).isPresent()) {
      throw new RuntimeException("Este e-mail já está cadastrado.");
    }
    Usuario novoUsuario = new Usuario(nome, email, senha);
    return usuarioRepository.save(novoUsuario);
  }

  public Optional<Usuario> login(String email, String senha) {
    return usuarioRepository.findByEmailAndSenha(email, senha);
  }

  public Optional<Usuario> buscarPorId(Long id) {
    return usuarioRepository.findById(id);
  }

  public void redefinirSenha(String email, String novaSenha) {
    Usuario usuario = usuarioRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    usuario.setSenha(novaSenha);
    usuarioRepository.update(usuario);
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
      usuario.setSenha(senha);
    }
    return usuarioRepository.update(usuario);
  }
}

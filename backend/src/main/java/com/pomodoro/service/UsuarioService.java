package com.pomodoro.service;

import com.pomodoro.model.Usuario;
import com.pomodoro.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

  private final UsuarioRepository repository;

  public UsuarioService(UsuarioRepository repository) {
    this.repository = repository;
  }

  public Usuario cadastrar(String nome, String email, String senha) {
    if (repository.findByEmail(email).isPresent()) {
      throw new RuntimeException("Este email já está cadastrado.");
    }
    return repository.save(new Usuario(nome, email, senha));
  }

  public Optional<Usuario> login(String email, String senha) {
    return repository.findByEmailAndSenha(email, senha);
  }

  public Optional<Usuario> buscarPorId(Long id) {
    return repository.findById(id);
  }

  public void redefinirSenha(String email, String novaSenha) {
    Usuario user = repository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Email não encontrado."));
    user.setSenha(novaSenha);
    repository.save(user);
  }

  public Usuario atualizar(Long id, String nome, String email, String senha) {
    Usuario user = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

    if (repository.existsByEmailAndIdNot(email, id)) {
      throw new RuntimeException("Este email já está em uso.");
    }

    user.setNome(nome);
    user.setEmail(email);
    if (senha != null && !senha.isBlank()) {
      user.setSenha(senha);
    }
    return repository.save(user);
  }
}

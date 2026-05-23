package com.pomodoro.repository;

import com.pomodoro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; // Import importante para a lista do ranking
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByEmailAndSenha(String email, String senha);
  Optional<Usuario> findByEmail(String email);
  boolean existsByEmailAndIdNot(String email, Long id);

  // Método do Ranking fucional com SQL
  List<Usuario> findTop10ByOrderByPontosDesc();
}

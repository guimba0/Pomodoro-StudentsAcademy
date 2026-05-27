package com.pomodoro.repository;

import com.pomodoro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

  Optional<Usuario> findByEmail(String email);

  boolean existsByEmailAndIdNot(String email, Long id);

  List<Usuario> findTop10ByOrderByPontosDesc();
}

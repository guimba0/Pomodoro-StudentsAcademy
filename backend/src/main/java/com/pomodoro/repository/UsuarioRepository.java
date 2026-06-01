// 1. Repositório de Usuário — operações de banco para a entidade Usuario
package com.pomodoro.repository;

import com.pomodoro.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByEmail(String email);           // 2. Busca usuário pelo email (login)
  boolean existsByEmailAndIdNot(String email, Long id);  // 3. Verifica se email já existe (exceto próprio ID)
  List<Usuario> findTop10ByOrderByPontosDesc();          // 4. Top 10 por pontos (ranking legado)
}

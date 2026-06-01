// 1. Repositório do estado da árvore — operações de banco para TreeState
package com.pomodoro.repository;

import com.pomodoro.model.TreeState;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreeStateRepository extends JpaRepository<TreeState, Long> {
  Optional<TreeState> findByUsuarioId(Long usuarioId);  // 2. Busca a árvore de um usuário específico
}

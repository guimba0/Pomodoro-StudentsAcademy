package com.pomodoro.repository;

import com.pomodoro.model.TreeState;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreeStateRepository extends JpaRepository<TreeState, Long> {

  Optional<TreeState> findByUsuarioId(Long usuarioId);
}

package com.pomodoro.repository;

import com.pomodoro.model.PomodoroSession;
import com.pomodoro.model.SessionStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {

  Optional<PomodoroSession> findByUsuarioIdAndStatus(Long usuarioId, SessionStatus status);

  long countByUsuarioId(Long usuarioId);

  long countByUsuarioIdAndStatus(Long usuarioId, SessionStatus status);
}

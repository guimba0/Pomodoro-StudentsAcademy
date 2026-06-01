// 1. Repositório de Sessões Pomodoro — operações de banco para PomodoroSession
package com.pomodoro.repository;

import com.pomodoro.model.PomodoroSession;
import com.pomodoro.model.SessionStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {
  Optional<PomodoroSession> findByUsuarioIdAndStatus(Long usuarioId, SessionStatus status); // 2. Sessão atual do usuário
  long countByUsuarioId(Long usuarioId);                                                      // 3. Total de sessões do usuário
  long countByUsuarioIdAndStatus(Long usuarioId, SessionStatus status);                       // 4. Total por status (ranking)
  long countByUsuarioIdAndStartedAtAfter(Long usuarioId, LocalDateTime after);                // 5. Total desde uma data
  long countByUsuarioIdAndStatusAndStartedAtAfter(Long usuarioId, SessionStatus status, LocalDateTime after); // 6. Total por status desde uma data
}

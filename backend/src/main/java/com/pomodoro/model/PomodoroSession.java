// 1. Entidade Sessão Pomodoro — registra cada ciclo de foco ou pausa
package com.pomodoro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pomodoro_sessions")
public class PomodoroSession {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;                          // 2. Identificador único da sessão

  @Column(nullable = false)
  private Long usuarioId;                   // 3. ID do usuário dono da sessão

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SessionTipo tipo;                 // 4. Tipo: FOCUS, SHORT_BREAK ou LONG_BREAK

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SessionStatus status;             // 5. Status: IN_PROGRESS, COMPLETED, FAILED, CANCELED

  @Column(nullable = false)
  private LocalDateTime startedAt;          // 6. Momento em que a sessão começou

  private LocalDateTime endsAt;             // 7. Momento previsto de término

  private LocalDateTime finishedAt;         // 8. Momento real em que foi finalizada

  private int pontosGanhos;                 // 9. Pontos ganhos nesta sessão

  private int tomatesGanhos;                // 10. Tomates ganhos nesta sessão

  public PomodoroSession() {}

  public PomodoroSession(Long usuarioId, SessionTipo tipo) {
    this.usuarioId = usuarioId;
    this.tipo = tipo;
    this.status = SessionStatus.IN_PROGRESS;
    this.startedAt = LocalDateTime.now();
    // 11. Define o término conforme o tipo (25min foco, 5min pausa curta, 15min pausa longa)
    if (tipo == SessionTipo.FOCUS) {
      this.endsAt = this.startedAt.plusMinutes(25);
    } else if (tipo == SessionTipo.SHORT_BREAK) {
      this.endsAt = this.startedAt.plusMinutes(5);
    } else {
      this.endsAt = this.startedAt.plusMinutes(15);
    }
    this.pontosGanhos = 0;
    this.tomatesGanhos = 0;
  }

  // Getters e Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getUsuarioId() { return usuarioId; }
  public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
  public SessionTipo getTipo() { return tipo; }
  public void setTipo(SessionTipo tipo) { this.tipo = tipo; }
  public SessionStatus getStatus() { return status; }
  public void setStatus(SessionStatus status) { this.status = status; }
  public LocalDateTime getStartedAt() { return startedAt; }
  public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
  public LocalDateTime getEndsAt() { return endsAt; }
  public void setEndsAt(LocalDateTime endsAt) { this.endsAt = endsAt; }
  public LocalDateTime getFinishedAt() { return finishedAt; }
  public void setFinishedAt(LocalDateTime finishedAt) { this.finishedAt = finishedAt; }
  public int getPontosGanhos() { return pontosGanhos; }
  public void setPontosGanhos(int pontosGanhos) { this.pontosGanhos = pontosGanhos; }
  public int getTomatesGanhos() { return tomatesGanhos; }
  public void setTomatesGanhos(int tomatesGanhos) { this.tomatesGanhos = tomatesGanhos; }
}

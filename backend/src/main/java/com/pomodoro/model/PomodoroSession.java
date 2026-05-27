package com.pomodoro.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "pomodoro_sessions")
public class PomodoroSession {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long usuarioId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SessionTipo tipo;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SessionStatus status;

  @Column(nullable = false)
  private LocalDateTime startedAt;

  private LocalDateTime endsAt;

  private LocalDateTime finishedAt;

  private int pontosGanhos;

  private int tomatesGanhos;

  public PomodoroSession() {}

  public PomodoroSession(Long usuarioId, SessionTipo tipo) {
    this.usuarioId = usuarioId;
    this.tipo = tipo;
    this.status = SessionStatus.IN_PROGRESS;
    this.startedAt = LocalDateTime.now();
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

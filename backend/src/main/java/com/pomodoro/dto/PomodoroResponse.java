package com.pomodoro.dto;

import com.pomodoro.model.PomodoroSession;
import com.pomodoro.model.SessionStatus;
import com.pomodoro.model.SessionTipo;

public class PomodoroResponse {

  private Long id;
  private String tipo;
  private String status;
  private String startedAt;
  private String endsAt;
  private long tempoRestanteSegundos;
  private boolean recuperada;

  public PomodoroResponse() {}

  public PomodoroResponse(PomodoroSession session, long tempoRestanteSegundos, boolean recuperada) {
    this.id = session.getId();
    this.tipo = session.getTipo().name();
    this.status = session.getStatus().name();
    this.startedAt = session.getStartedAt() != null ? session.getStartedAt().toString() : null;
    this.endsAt = session.getEndsAt() != null ? session.getEndsAt().toString() : null;
    this.tempoRestanteSegundos = tempoRestanteSegundos;
    this.recuperada = recuperada;
  }

  public Long getId() { return id; }
  public String getTipo() { return tipo; }
  public String getStatus() { return status; }
  public String getStartedAt() { return startedAt; }
  public String getEndsAt() { return endsAt; }
  public long getTempoRestanteSegundos() { return tempoRestanteSegundos; }
  public boolean isRecuperada() { return recuperada; }
}

// 1. DTO de resposta da sessão Pomodoro — enviado ao frontend ao iniciar/consultar
package com.pomodoro.dto;

import com.pomodoro.model.PomodoroSession;

public class PomodoroResponse {
  private Long id;                           // 2. ID da sessão
  private String tipo;                       // 3. FOCUS / SHORT_BREAK / LONG_BREAK
  private String status;                     // 4. IN_PROGRESS / COMPLETED / etc.
  private String startedAt;                  // 5. Data/hora de início
  private String endsAt;                     // 6. Data/hora prevista de término
  private long tempoRestanteSegundos;        // 7. Tempo restante em segundos
  private boolean recuperada;                // 8. true se foi recuperada (grace period)

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

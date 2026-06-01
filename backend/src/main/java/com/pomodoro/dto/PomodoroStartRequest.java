// 1. DTO para iniciar sessão — recebe o tipo (FOCUS, SHORT_BREAK ou LONG_BREAK)
package com.pomodoro.dto;

import jakarta.validation.constraints.NotNull;

public class PomodoroStartRequest {
  @NotNull private String tipo;  // 2. "FOCUS", "SHORT_BREAK" ou "LONG_BREAK"

  public String getTipo() { return tipo; }
  public void setTipo(String tipo) { this.tipo = tipo; }
}

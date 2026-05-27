package com.pomodoro.dto;

import jakarta.validation.constraints.NotNull;

public class PomodoroStartRequest {

  @NotNull
  private String tipo;

  public String getTipo() { return tipo; }
  public void setTipo(String tipo) { this.tipo = tipo; }
}

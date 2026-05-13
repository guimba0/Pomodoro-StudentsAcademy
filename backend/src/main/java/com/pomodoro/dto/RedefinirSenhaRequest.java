package com.pomodoro.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RedefinirSenhaRequest {

  @NotBlank
  private String email;

  @NotBlank @Size(min = 3)
  private String senha;

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
}

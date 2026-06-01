// 1. DTO de login — recebe email e senha do formulário de login
package com.pomodoro.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
  @NotBlank private String email;   // 2. Email do usuário
  @NotBlank private String senha;   // 3. Senha do usuário

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
}

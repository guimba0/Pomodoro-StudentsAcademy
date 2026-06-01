// 1. DTO de redefinição de senha — email + nova senha
package com.pomodoro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RedefinirSenhaRequest {

  @NotBlank @Email
  private String email;    // 2. Email do usuário

  @NotBlank @Size(min = 3)
  private String senha;    // 3. Nova senha

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
}

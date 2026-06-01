// 1. DTO de redefinição de senha — email + nova senha
package com.pomodoro.dto;

public class RedefinirSenhaRequest {
  private String email;    // 2. Email do usuário
  private String senha;    // 3. Nova senha

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
}

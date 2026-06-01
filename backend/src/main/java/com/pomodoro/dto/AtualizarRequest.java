// 1. DTO de atualização de perfil — nome, email e senha (opcional)
package com.pomodoro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AtualizarRequest {

  @NotBlank
  private String nome;    // 2. Novo nome

  @NotBlank @Email
  private String email;   // 3. Novo email

  private String senha;   // 4. Nova senha (opcional — null mantém a atual)

  public String getNome() { return nome; }
  public void setNome(String nome) { this.nome = nome; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
}

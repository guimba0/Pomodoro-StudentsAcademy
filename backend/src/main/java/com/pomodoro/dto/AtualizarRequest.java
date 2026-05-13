package com.pomodoro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AtualizarRequest {

  @NotBlank
  private String nome;

  @NotBlank @Email
  private String email;

  @Size(min = 3, message = "Senha deve ter pelo menos 3 caracteres")
  private String senha;

  public String getNome() { return nome; }
  public void setNome(String nome) { this.nome = nome; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
}

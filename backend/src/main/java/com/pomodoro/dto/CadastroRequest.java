// 1. DTO de cadastro — recebe nome, email e senha do formulário de registro
package com.pomodoro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CadastroRequest {

  @NotBlank
  private String nome;              // 2. Nome do usuário (obrigatório)

  @NotBlank @Email
  private String email;             // 3. Email válido (obrigatório)

  @NotBlank @Size(min = 3)
  private String senha;             // 4. Senha com no mínimo 3 caracteres

  public String getNome() { return nome; }
  public void setNome(String nome) { this.nome = nome; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
}

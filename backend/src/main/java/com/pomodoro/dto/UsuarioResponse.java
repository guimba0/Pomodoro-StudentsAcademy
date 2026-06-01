// 1. DTO genérico de resposta do usuário — usado para /me e mensagens de erro
package com.pomodoro.dto;

public class UsuarioResponse {
  private boolean logado;    // 2. Status de autenticação
  private String nome;       // 3. Nome do usuário
  private String email;      // 4. Email do usuário
  private String erro;       // 5. Mensagem de erro

  public UsuarioResponse() {}

  public UsuarioResponse(boolean logado) { this.logado = logado; }

  public UsuarioResponse(boolean logado, String nome, String email) {
    this.logado = logado;
    this.nome = nome;
    this.email = email;
  }

  public UsuarioResponse(String erro) { this.erro = erro; }

  public boolean isLogado() { return logado; }
  public String getNome() { return nome; }
  public String getEmail() { return email; }
  public String getErro() { return erro; }
}

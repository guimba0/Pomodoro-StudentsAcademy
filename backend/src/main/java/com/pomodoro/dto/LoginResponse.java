// 1. DTO de resposta do login/cadastro — retorna token JWT ou erro
package com.pomodoro.dto;

public class LoginResponse {
  private boolean logado;    // 2. true se autenticou com sucesso
  private String token;      // 3. Token JWT gerado
  private String nome;       // 4. Nome do usuário
  private String email;      // 5. Email do usuário
  private String erro;       // 6. Mensagem de erro (se houver)

  public LoginResponse() {}

  public LoginResponse(boolean logado, String token, String nome, String email) {
    this.logado = logado;
    this.token = token;
    this.nome = nome;
    this.email = email;
  }

  public LoginResponse(String erro) {
    this.logado = false;
    this.erro = erro;
  }

  public boolean isLogado() { return logado; }
  public String getToken() { return token; }
  public String getNome() { return nome; }
  public String getEmail() { return email; }
  public String getErro() { return erro; }
}

package com.pomodoro.dto;

public class LoginResponse {

  private boolean logado;
  private String token;
  private String nome;
  private String email;

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

  private String erro;

  public boolean isLogado() { return logado; }
  public String getToken() { return token; }
  public String getNome() { return nome; }
  public String getEmail() { return email; }
  public String getErro() { return erro; }
}

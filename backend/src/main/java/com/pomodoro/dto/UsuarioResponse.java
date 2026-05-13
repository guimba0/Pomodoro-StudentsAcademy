package com.pomodoro.dto;

public class UsuarioResponse {

  private boolean logado;
  private String nome;
  private String email;
  private String erro;

  public UsuarioResponse(boolean logado) {
    this.logado = logado;
  }

  public UsuarioResponse(boolean logado, String nome, String email) {
    this.logado = logado;
    this.nome = nome;
    this.email = email;
  }

  public UsuarioResponse(String erro) {
    this.erro = erro;
  }

  public boolean isLogado() { return logado; }
  public String getNome() { return nome; }
  public String getEmail() { return email; }
  public String getErro() { return erro; }
}

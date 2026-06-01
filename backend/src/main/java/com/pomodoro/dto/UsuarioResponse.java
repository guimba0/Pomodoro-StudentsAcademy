// 1. DTO genérico de resposta do usuário — usado para /me e mensagens de erro
package com.pomodoro.dto;

public class UsuarioResponse {
  private boolean logado;    // 2. Status de autenticação
  private Long id;           // 3. ID do usuário
  private String nome;       // 4. Nome do usuário
  private String email;      // 5. Email do usuário
  private String avatar;     // 6. Avatar personalizado
  private String wallpaper;  // 7. Wallpaper personalizado
  private int pontos;        // 8. Pontos acumulados
  private int tomates;       // 9. Tomates acumulados
  private String erro;       // 10. Mensagem de erro

  public UsuarioResponse() {}

  public UsuarioResponse(boolean logado) { this.logado = logado; }

  public UsuarioResponse(boolean logado, String nome, String erro) {
    this.logado = logado;
    this.nome = nome;
    this.erro = erro;
  }

  public UsuarioResponse(boolean logado, Long id, String nome, String email, String avatar, String wallpaper, int pontos, int tomates) {
    this.logado = logado;
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.avatar = avatar;
    this.wallpaper = wallpaper;
    this.pontos = pontos;
    this.tomates = tomates;
  }

  public UsuarioResponse(String erro) { this.logado = false; this.erro = erro; }

  public boolean isLogado() { return logado; }
  public Long getId() { return id; }
  public String getNome() { return nome; }
  public String getEmail() { return email; }
  public String getAvatar() { return avatar; }
  public String getWallpaper() { return wallpaper; }
  public int getPontos() { return pontos; }
  public int getTomates() { return tomates; }
  public String getErro() { return erro; }
}

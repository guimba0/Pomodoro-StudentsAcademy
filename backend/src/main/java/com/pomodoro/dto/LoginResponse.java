// 1. DTO de resposta do login/cadastro — retorna token JWT ou erro
package com.pomodoro.dto;

public class LoginResponse {
  private boolean logado;    // 2. true se autenticou com sucesso
  private String token;      // 3. Token JWT gerado
  private Long id;           // 4. ID do usuário
  private String nome;       // 5. Nome do usuário
  private String email;      // 6. Email do usuário
  private String avatar;     // 7. Avatar personalizado
  private String wallpaper;  // 8. Wallpaper personalizado
  private int pontos;        // 9. Pontos acumulados
  private int tomates;       // 10. Tomates acumulados
  private String erro;       // 11. Mensagem de erro (se houver)

  public LoginResponse() {}

  public LoginResponse(boolean logado, String token, Long id, String nome, String email, String avatar, String wallpaper, int pontos, int tomates) {
    this.logado = logado;
    this.token = token;
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.avatar = avatar;
    this.wallpaper = wallpaper;
    this.pontos = pontos;
    this.tomates = tomates;
  }

  public LoginResponse(String erro) {
    this.logado = false;
    this.erro = erro;
  }

  public boolean isLogado() { return logado; }
  public String getToken() { return token; }
  public Long getId() { return id; }
  public String getNome() { return nome; }
  public String getEmail() { return email; }
  public String getAvatar() { return avatar; }
  public String getWallpaper() { return wallpaper; }
  public int getPontos() { return pontos; }
  public int getTomates() { return tomates; }
  public String getErro() { return erro; }
}

// 1. Entidade Usuário — mapeia a tabela "usuarios" no banco SQLite
package com.pomodoro.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;              // 2. Chave primária auto-incremento

  @Column(nullable = false)
  private String nome;           // 3. Nome do usuário

  @Column(nullable = false, unique = true)
  private String email;          // 4. Email único (usado no login)

  @Column(nullable = false)
  private String senha;          // 5. Hash BCrypt da senha

  @Column(nullable = false)
  private int pontos = 0;        // 6. Pontos acumulados (gamificação)

  @Column(nullable = false)
  private int tomates = 0;       // 7. Tomates (maçãs) acumulados

  @Column(nullable = true)
  private String wallpaper;      // 8. Wallpaper personalizado (path ou base64)

  @Column(nullable = true)
  private String avatar;         // 9. Avatar personalizado (path ou base64)

  @Column(columnDefinition = "TEXT")
  private String itens = "[]";   // 10. Lista JSON de IDs de itens comprados na loja

  public Usuario() {}

  public Usuario(String nome, String email, String senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.pontos = 0;
    this.tomates = 0;
  }

  // Getters e Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getNome() { return nome; }
  public void setNome(String nome) { this.nome = nome; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getSenha() { return senha; }
  public void setSenha(String senha) { this.senha = senha; }
  public int getPontos() { return pontos; }
  public void setPontos(int pontos) { this.pontos = pontos; }
  public int getTomates() { return tomates; }
  public void setTomates(int tomates) { this.tomates = tomates; }
  public String getWallpaper() { return wallpaper; }
  public void setWallpaper(String wallpaper) { this.wallpaper = wallpaper; }
  public String getAvatar() { return avatar; }
  public void setAvatar(String avatar) { this.avatar = avatar; }
  public String getItens() { return itens; }
  public void setItens(String itens) { this.itens = itens; }
}

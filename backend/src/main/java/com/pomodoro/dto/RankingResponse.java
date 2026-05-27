package com.pomodoro.dto;

public class RankingResponse {

  private Long id;
  private String nome;
  private String email;
  private int pontos;
  private int tomates;
  private long totalCiclos;
  private long completos;
  private long falhos;

  public RankingResponse() {}

  public RankingResponse(Long id, String nome, String email, int pontos, int tomates,
                         long totalCiclos, long completos, long falhos) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.pontos = pontos;
    this.tomates = tomates;
    this.totalCiclos = totalCiclos;
    this.completos = completos;
    this.falhos = falhos;
  }

  public Long getId() { return id; }
  public String getNome() { return nome; }
  public String getEmail() { return email; }
  public int getPontos() { return pontos; }
  public int getTomates() { return tomates; }
  public long getTotalCiclos() { return totalCiclos; }
  public long getCompletos() { return completos; }
  public long getFalhos() { return falhos; }
}

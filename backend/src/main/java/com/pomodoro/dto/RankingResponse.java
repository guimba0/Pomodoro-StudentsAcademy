// 1. DTO de ranking — estatísticas de cada usuário para a tabela de líderes
package com.pomodoro.dto;

public class RankingResponse {
  private Long id;             // 2. ID do usuário
  private String nome;         // 3. Nome
  private String email;        // 4. Email
  private int pontos;          // 5. Pontos totais
  private int tomates;         // 6. Tomates totais
  private long totalCiclos;    // 7. Total de ciclos (qualquer status)
  private long completos;      // 8. Ciclos completos com sucesso
  private long falhos;         // 9. Ciclos que falharam

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

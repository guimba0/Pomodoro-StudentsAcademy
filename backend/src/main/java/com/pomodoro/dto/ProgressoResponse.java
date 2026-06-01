// 1. DTO de progresso — retorna pontos, tomates e estado da árvore do usuário
package com.pomodoro.dto;

import com.pomodoro.model.TreeState;

public class ProgressoResponse {
  private int pontos;            // 2. Pontos acumulados
  private int tomates;           // 3. Tomates (maçãs) acumulados
  private String arvoreEstagio;  // 4. Estágio da árvore: SEED, SEEDLING ou TREE
  private boolean arvoreMorta;   // 5. true se a árvore morreu (falha na sessão)
  private int focosCompletos;    // 6. Total de focos concluídos

  public ProgressoResponse() {}

  public ProgressoResponse(int pontos, int tomates, TreeState tree) {
    this.pontos = pontos;
    this.tomates = tomates;
    if (tree != null) {
      this.arvoreEstagio = tree.getEstagio().name();
      this.arvoreMorta = tree.isMorta();
      this.focosCompletos = tree.getFocosCompletos();
    }
  }

  public int getPontos() { return pontos; }
  public int getTomates() { return tomates; }
  public String getArvoreEstagio() { return arvoreEstagio; }
  public boolean isArvoreMorta() { return arvoreMorta; }
  public int getFocosCompletos() { return focosCompletos; }
}

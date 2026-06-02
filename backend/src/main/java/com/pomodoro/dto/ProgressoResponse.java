// 1. DTO de progresso — retorna tomates e estado da árvore do usuário
package com.pomodoro.dto;

import com.pomodoro.model.TreeState;

public class ProgressoResponse {
  private int tomates;           // 2. Tomates (moeda do jogo) acumulados
  private String arvoreEstagio;  // 3. Estágio da árvore: SEED, SEEDLING ou TREE
  private boolean arvoreMorta;   // 4. true se a árvore morreu (falha na sessão)
  private int focosCompletos;    // 5. Total de focos concluídos

  public ProgressoResponse() {}

  public ProgressoResponse(int tomates, TreeState tree) {
    this.tomates = tomates;
    if (tree != null) {
      this.arvoreEstagio = tree.getEstagio().name();
      this.arvoreMorta = tree.isMorta();
      this.focosCompletos = tree.getFocosCompletos();
    }
  }

  public int getTomates() { return tomates; }
  public String getArvoreEstagio() { return arvoreEstagio; }
  public boolean isArvoreMorta() { return arvoreMorta; }
  public int getFocosCompletos() { return focosCompletos; }
}

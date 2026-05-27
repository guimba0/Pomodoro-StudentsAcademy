package com.pomodoro.dto;

import com.pomodoro.model.TreeState;

public class ProgressoResponse {

  private int pontos;
  private int tomates;
  private String arvoreEstagio;
  private boolean arvoreMorta;
  private int focosCompletos;

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

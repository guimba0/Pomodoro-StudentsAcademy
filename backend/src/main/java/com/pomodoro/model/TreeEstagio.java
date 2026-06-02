// 1. Estágios da árvore — evolui a cada ciclo de 3 focos (SEED → SEEDLING → TREE → reinicia)
package com.pomodoro.model;

public enum TreeEstagio {
  SEED,      // focos % 3 == 0 → semente (início do ciclo)
  SEEDLING,  // focos % 3 == 1 → muda
  TREE       // focos % 3 == 2 → árvore adulta
}

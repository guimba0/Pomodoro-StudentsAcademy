// 1. Estágios da árvore — evolui conforme o número de focos completos
package com.pomodoro.model;

public enum TreeEstagio {
  SEED,      // 0 focos completos → semente
  SEEDLING,  // 1-2 focos → muda
  TREE       // 3+ focos → árvore adulta
}

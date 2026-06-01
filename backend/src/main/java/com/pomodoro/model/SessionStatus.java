// 1. Status possíveis de uma sessão Pomodoro
package com.pomodoro.model;

public enum SessionStatus {
  IN_PROGRESS,  // Sessão ativa (correndo ou pausada)
  COMPLETED,    // Finalizada com sucesso (foco concluído)
  FAILED,       // Falhou (excedeu o tempo de graça de 120s)
  CANCELED      // Cancelada manualmente pelo usuário (reset)
}

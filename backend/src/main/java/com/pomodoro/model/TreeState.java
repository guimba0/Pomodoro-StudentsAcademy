// 1. Entidade Árvore — representa o estado da árvore do foco de cada usuário
package com.pomodoro.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tree_states")
public class TreeState {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;                      // 2. Identificador único

  @Column(nullable = false, unique = true)
  private Long usuarioId;               // 3. Um TreeState por usuário

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TreeEstagio estagio;          // 4. Estágio atual: SEED, SEEDLING ou TREE

  @Column(nullable = false)
  private boolean morta;                // 5. true se a sessão anterior falhou (excedeu 120s de graça)

  @Column(nullable = false)
  private LocalDateTime updatedAt;      // 6. Última atualização

  private int focosCompletos;           // 7. Total de focos concluídos pelo usuário

  public TreeState() {}

  public TreeState(Long usuarioId) {
    this.usuarioId = usuarioId;
    this.estagio = TreeEstagio.SEED;    // 8. Começa como semente
    this.morta = false;
    this.updatedAt = LocalDateTime.now();
    this.focosCompletos = 0;
  }

  // Getters e Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Long getUsuarioId() { return usuarioId; }
  public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
  public TreeEstagio getEstagio() { return estagio; }
  public void setEstagio(TreeEstagio estagio) { this.estagio = estagio; }
  public boolean isMorta() { return morta; }
  public void setMorta(boolean morta) { this.morta = morta; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
  public int getFocosCompletos() { return focosCompletos; }
  public void setFocosCompletos(int focosCompletos) { this.focosCompletos = focosCompletos; }
}

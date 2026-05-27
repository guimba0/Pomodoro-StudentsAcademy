package com.pomodoro.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "tree_states")
public class TreeState {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private Long usuarioId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private TreeEstagio estagio;

  @Column(nullable = false)
  private boolean morta;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  private int focosCompletos;

  public TreeState() {}

  public TreeState(Long usuarioId) {
    this.usuarioId = usuarioId;
    this.estagio = TreeEstagio.SEED;
    this.morta = false;
    this.updatedAt = LocalDateTime.now();
    this.focosCompletos = 0;
  }

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

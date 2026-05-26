package com.pomodoro.repository;

import com.pomodoro.model.Usuario;
import java.sql.*;
import java.util.*;

public class UsuarioRepository {

  private Connection getConnection() throws SQLException {
    return DriverManager.getConnection("jdbc:sqlite:pomodoro.db");
  }

  public void init() {
    String sql = """
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        pontos INTEGER NOT NULL DEFAULT 0
      )
    """;
    try (Connection conn = getConnection();
         Statement stmt = conn.createStatement()) {
      stmt.execute(sql);
    } catch (SQLException e) {
      throw new RuntimeException("Erro ao inicializar o banco: " + e.getMessage());
    }
  }

  public Usuario save(Usuario usuario) {
    String sql = "INSERT INTO usuarios (nome, email, senha, pontos) VALUES (?, ?, ?, ?)";
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
      stmt.setString(1, usuario.getNome());
      stmt.setString(2, usuario.getEmail());
      stmt.setString(3, usuario.getSenha());
      stmt.setInt(4, usuario.getPontos());
      stmt.executeUpdate();
      ResultSet keys = stmt.getGeneratedKeys();
      if (keys.next()) {
        usuario.setId(keys.getLong(1));
      }
      return usuario;
    } catch (SQLException e) {
      throw new RuntimeException("Erro ao salvar usuário: " + e.getMessage());
    }
  }

  public Usuario update(Usuario usuario) {
    String sql = "UPDATE usuarios SET nome = ?, email = ?, senha = ?, pontos = ? WHERE id = ?";
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
      stmt.setString(1, usuario.getNome());
      stmt.setString(2, usuario.getEmail());
      stmt.setString(3, usuario.getSenha());
      stmt.setInt(4, usuario.getPontos());
      stmt.setLong(5, usuario.getId());
      stmt.executeUpdate();
      return usuario;
    } catch (SQLException e) {
      throw new RuntimeException("Erro ao atualizar usuário: " + e.getMessage());
    }
  }

  public Optional<Usuario> findById(Long id) {
    String sql = "SELECT * FROM usuarios WHERE id = ?";
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
      stmt.setLong(1, id);
      ResultSet rs = stmt.executeQuery();
      if (rs.next()) {
        return Optional.of(mapUsuario(rs));
      }
      return Optional.empty();
    } catch (SQLException e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public Optional<Usuario> findByEmail(String email) {
    String sql = "SELECT * FROM usuarios WHERE email = ?";
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
      stmt.setString(1, email);
      ResultSet rs = stmt.executeQuery();
      if (rs.next()) {
        return Optional.of(mapUsuario(rs));
      }
      return Optional.empty();
    } catch (SQLException e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public Optional<Usuario> findByEmailAndSenha(String email, String senha) {
    String sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
      stmt.setString(1, email);
      stmt.setString(2, senha);
      ResultSet rs = stmt.executeQuery();
      if (rs.next()) {
        return Optional.of(mapUsuario(rs));
      }
      return Optional.empty();
    } catch (SQLException e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public boolean existsByEmailAndIdNot(String email, Long id) {
    String sql = "SELECT COUNT(*) FROM usuarios WHERE email = ? AND id != ?";
    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(sql)) {
      stmt.setString(1, email);
      stmt.setLong(2, id);
      ResultSet rs = stmt.executeQuery();
      return rs.next() && rs.getInt(1) > 0;
    } catch (SQLException e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public List<Usuario> findTop10ByOrderByPontosDesc() {
    List<Usuario> usuarios = new ArrayList<>();
    String sql = "SELECT * FROM usuarios ORDER BY pontos DESC LIMIT 10";
    try (Connection conn = getConnection();
         Statement stmt = conn.createStatement();
         ResultSet rs = stmt.executeQuery(sql)) {
      while (rs.next()) {
        usuarios.add(mapUsuario(rs));
      }
    } catch (SQLException e) {
      throw new RuntimeException(e.getMessage());
    }
    return usuarios;
  }

  private Usuario mapUsuario(ResultSet rs) throws SQLException {
    Usuario u = new Usuario();
    u.setId(rs.getLong("id"));
    u.setNome(rs.getString("nome"));
    u.setEmail(rs.getString("email"));
    u.setSenha(rs.getString("senha"));
    u.setPontos(rs.getInt("pontos"));
    return u;
  }
}

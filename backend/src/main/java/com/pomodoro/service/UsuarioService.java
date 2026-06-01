// 1. Serviço de usuário — gerencia cadastro, login, perfil e ranking
package com.pomodoro.service;

import com.pomodoro.dto.RankingResponse;
import com.pomodoro.model.SessionStatus;
import com.pomodoro.model.Usuario;
import com.pomodoro.repository.PomodoroSessionRepository;
import com.pomodoro.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;
  private final PomodoroSessionRepository sessionRepository;
  private final BCryptPasswordEncoder passwordEncoder;
  private final ObjectMapper objectMapper;

  public UsuarioService(UsuarioRepository usuarioRepository,
                        PomodoroSessionRepository sessionRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        ObjectMapper objectMapper) {
    this.usuarioRepository = usuarioRepository;
    this.sessionRepository = sessionRepository;
    this.passwordEncoder = passwordEncoder;
    this.objectMapper = objectMapper;
  }

  // 2. Retorna top 10 usuários ordenados por ciclos completos
  public List<RankingResponse> obterTopRanking() {
    return obterTopRanking("all");
  }

  public List<RankingResponse> obterTopRanking(String periodo) {
    LocalDateTime cutoff = switch (periodo) {
      case "weekly" -> LocalDateTime.now().minusWeeks(1);
      case "monthly" -> LocalDateTime.now().minusMonths(1);
      default -> null;
    };
    return usuarioRepository.findAll()
      .stream()
      .map(u -> {
        long total = cutoff != null
          ? sessionRepository.countByUsuarioIdAndStartedAtAfter(u.getId(), cutoff)
          : sessionRepository.countByUsuarioId(u.getId());
        long completos = cutoff != null
          ? sessionRepository.countByUsuarioIdAndStatusAndStartedAtAfter(u.getId(), SessionStatus.COMPLETED, cutoff)
          : sessionRepository.countByUsuarioIdAndStatus(u.getId(), SessionStatus.COMPLETED);
        long falhos = cutoff != null
          ? sessionRepository.countByUsuarioIdAndStatusAndStartedAtAfter(u.getId(), SessionStatus.FAILED, cutoff)
          : sessionRepository.countByUsuarioIdAndStatus(u.getId(), SessionStatus.FAILED);
        return new RankingResponse(
          u.getId(), u.getNome(), u.getEmail(),
          u.getPontos(), u.getTomates(),
          total, completos, falhos
        );
      })
      .sorted((a, b) -> Long.compare(b.getCompletos(), a.getCompletos()))  // 3. Mais completos primeiro
      .limit(10)
      .collect(Collectors.toList());
  }

  // 4. Adiciona pontos ao usuário (usado pelo endpoint legado)
  public Usuario adicionarPontos(Long id, int pontosGanhos) {
    Usuario usuario = usuarioRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    usuario.setPontos(usuario.getPontos() + pontosGanhos);
    return usuarioRepository.save(usuario);
  }

  // 5. Cadastra novo usuário — lança exceção se email já existir
  public Usuario cadastrar(String nome, String email, String senha) {
    if (usuarioRepository.findByEmail(email).isPresent()) {
      throw new RuntimeException("Este e-mail já está cadastrado.");
    }
    Usuario novoUsuario = new Usuario(nome, email, passwordEncoder.encode(senha));
    return usuarioRepository.save(novoUsuario);
  }

  // 6. Login — verifica email e senha com BCrypt
  public Optional<Usuario> login(String email, String senha) {
    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
    if (usuarioOpt.isPresent() && passwordEncoder.matches(senha, usuarioOpt.get().getSenha())) {
      return usuarioOpt;
    }
    return Optional.empty();
  }

  // 7. Busca usuário pelo ID
  public Optional<Usuario> buscarPorId(Long id) {
    return usuarioRepository.findById(id);
  }

  // 8. Redefine a senha (usado pelo "esqueci senha")
  public void redefinirSenha(String email, String novaSenha) {
    Usuario usuario = usuarioRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    usuario.setSenha(passwordEncoder.encode(novaSenha));
    usuarioRepository.save(usuario);
  }

  // 9. Atualiza dados do perfil (nome, email, senha opcional)
  public Usuario atualizar(Long id, String nome, String email, String senha) {
    Usuario usuario = usuarioRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    if (usuarioRepository.existsByEmailAndIdNot(email, id)) {
      throw new RuntimeException("Este e-mail já está sendo usado por outro usuário.");
    }
    usuario.setNome(nome);
    usuario.setEmail(email);
    if (senha != null && !senha.isBlank()) {       // 10. Só altera senha se foi fornecida
      usuario.setSenha(passwordEncoder.encode(senha));
    }
    return usuarioRepository.save(usuario);
  }

  // 11. Retorna wallpaper e avatar do usuário
  public Map<String, String> getAparencia(Long usuarioId) {
    Usuario usuario = usuarioRepository.findById(usuarioId)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    Map<String, String> aparencia = new HashMap<>();
    aparencia.put("wallpaper", usuario.getWallpaper());
    aparencia.put("avatar", usuario.getAvatar());
    return aparencia;
  }

  // 12. Atualiza wallpaper e/ou avatar do usuário
  @Transactional
  public void atualizarAparencia(Long usuarioId, String wallpaper, String avatar) {
    Usuario usuario = usuarioRepository.findById(usuarioId)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    usuario.setWallpaper(wallpaper);
    usuario.setAvatar(avatar);
    usuarioRepository.save(usuario);
  }

  // 13. Retorna lista de IDs de itens que o usuário já comprou
  public List<String> getItens(Long usuarioId) {
    Usuario usuario = usuarioRepository.findById(usuarioId)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    try {
      return objectMapper.readValue(usuario.getItens(), new TypeReference<List<String>>() {});
    } catch (Exception e) {
      return new ArrayList<>();
    }
  }

  // 14. Compra um item: verifica saldo, deduz tomates, adiciona à lista, aplica
  @Transactional
  public void comprarItem(Long usuarioId, String itemId, int preco, String tipo, String path) {
    Usuario usuario = usuarioRepository.findById(usuarioId)
      .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

    List<String> itens = getItens(usuarioId);
    if (itens.contains(itemId)) {
      throw new RuntimeException("Você já possui este item.");
    }

    if (usuario.getTomates() < preco) {
      throw new RuntimeException("Tomates insuficientes. Você precisa de " + preco + " tomates.");
    }

    usuario.setTomates(usuario.getTomates() - preco);
    itens.add(itemId);
    try {
      usuario.setItens(objectMapper.writeValueAsString(itens));
    } catch (Exception e) {
      throw new RuntimeException("Erro ao salvar itens.");
    }

    // Aplica o item automaticamente
    if ("wallpaper".equals(tipo)) {
      usuario.setWallpaper(path);
    } else if ("avatar".equals(tipo)) {
      usuario.setAvatar(path);
    }

    usuarioRepository.save(usuario);
  }
}

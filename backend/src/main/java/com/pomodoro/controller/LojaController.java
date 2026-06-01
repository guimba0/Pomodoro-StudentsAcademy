// 1. Controller da Loja — gerencia compra e consulta de itens
package com.pomodoro.controller;

import com.pomodoro.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loja")
public class LojaController {

  // 2. Catálogo fixo de itens disponíveis na loja
  private static final Map<String, Map<String, Object>> CATALOGO = Map.of(
    "pato", Map.of(
      "tipo", "avatar",
      "nome", "Pato",
      "path", "/img/PomodoroStore/Icon/Pato_PI.png",
      "preco", 3
    ),
    "ceu", Map.of(
      "tipo", "wallpaper",
      "nome", "Céu",
      "path", "/img/PomodoroStore/Wallpaper/Ceu_WP.jpg",
      "preco", 5
    )
  );

  private final UsuarioService usuarioService;

  public LojaController(UsuarioService usuarioService) {
    this.usuarioService = usuarioService;
  }

  // 3. GET /api/loja/catalogo — retorna todos os itens disponíveis
  @GetMapping("/catalogo")
  public ResponseEntity<?> catalogo() {
    return ResponseEntity.ok(CATALOGO);
  }

  // 4. GET /api/loja/itens — retorna os IDs dos itens que o usuário já comprou
  @GetMapping("/itens")
  public ResponseEntity<?> getItens(HttpServletRequest req) {
    Long usuarioId = (Long) req.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(Map.of("erro", "Não autenticado"));
    }
    try {
      List<String> itens = usuarioService.getItens(usuarioId);
      return ResponseEntity.ok(Map.of("itens", itens));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
    }
  }

  // 5. POST /api/loja/comprar — compra um item, deduz tomates e aplica
  @PostMapping("/comprar")
  public ResponseEntity<?> comprar(@RequestBody Map<String, String> body, HttpServletRequest req) {
    Long usuarioId = (Long) req.getAttribute("usuarioId");
    if (usuarioId == null) {
      return ResponseEntity.status(401).body(Map.of("erro", "Não autenticado"));
    }
    String itemId = body.get("itemId");
    if (itemId == null || !CATALOGO.containsKey(itemId)) {
      return ResponseEntity.badRequest().body(Map.of("erro", "Item inválido."));
    }
    try {
      Map<String, Object> item = CATALOGO.get(itemId);
      int preco = (int) item.get("preco");
      String tipo = (String) item.get("tipo");
      String path = (String) item.get("path");
      usuarioService.comprarItem(usuarioId, itemId, preco, tipo, path);
      return ResponseEntity.ok(Map.of("mensagem", "Item comprado com sucesso!"));
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
    }
  }
}

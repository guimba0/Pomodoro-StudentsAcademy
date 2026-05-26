package com.pomodoro;

import com.pomodoro.dto.*;
import com.pomodoro.model.Usuario;
import com.pomodoro.repository.UsuarioRepository;
import com.pomodoro.service.UsuarioService;
import io.javalin.Javalin;
import io.javalin.json.JavalinGson;
import java.util.Map;

public class PomodoroApplication {

  public static void main(String[] args) {
    UsuarioRepository usuarioRepository = new UsuarioRepository();
    usuarioRepository.init();
    UsuarioService usuarioService = new UsuarioService(usuarioRepository);

    Javalin app = Javalin.create(config -> {
      config.bundledPlugins.enableCors(cors -> cors.addRule(corsConfig -> {
        corsConfig.allowHost("http://localhost:5173");
        corsConfig.allowHost("http://localhost:5174");
        corsConfig.allowHost("http://localhost:5175");
        corsConfig.allowCredentials = true;
      }));
      config.jsonMapper(new JavalinGson());
    });

    app.exception(Exception.class, (e, ctx) -> {
      ctx.status(400).json(Map.of("erro", e.getMessage()));
    });

    app.post("/api/cadastro", ctx -> {
      CadastroRequest req = ctx.bodyAsClass(CadastroRequest.class);
      try {
        Usuario usuario = usuarioService.cadastrar(
          req.getNome(), req.getEmail(), req.getSenha()
        );
        ctx.json(usuario);
      } catch (RuntimeException e) {
        ctx.status(400).json(Map.of("erro", e.getMessage()));
      }
    });

    app.post("/api/login", ctx -> {
      LoginRequest req = ctx.bodyAsClass(LoginRequest.class);
      var usuarioOpt = usuarioService.login(req.getEmail(), req.getSenha());
      if (usuarioOpt.isPresent()) {
        ctx.sessionAttribute("usuarioId", usuarioOpt.get().getId());
        ctx.json(usuarioOpt.get());
      } else {
        ctx.status(401).json(Map.of("erro", "E-mail ou senha inválidos."));
      }
    });

    app.get("/api/me", ctx -> {
      Long usuarioId = ctx.sessionAttribute("usuarioId");
      if (usuarioId == null) {
        ctx.status(401).json(Map.of("erro", "Não autenticado"));
        return;
      }
      usuarioService.buscarPorId(usuarioId)
        .ifPresentOrElse(
          ctx::json,
          () -> ctx.status(404).json(Map.of("erro", "Usuário não encontrado"))
        );
    });

    app.post("/api/logout", ctx -> {
      ctx.req().getSession().invalidate();
      ctx.json(Map.of("mensagem", "Logout realizado"));
    });

    app.get("/api/ranking", ctx -> {
      ctx.json(usuarioService.obterTopRanking());
    });

    app.start(8080);
  }
}

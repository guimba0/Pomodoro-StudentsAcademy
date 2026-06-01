package com.pomodoro.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

// 1. Filtro de autenticação — intercepta todas as requisições antes dos controllers
@Component
@Order(1)
public class AuthFilter implements Filter {

  // 2. Rotas que NÃO precisam de token (acesso público)
  private static final Set<String> PUBLIC_PATHS = Set.of(
    "/api/cadastro",
    "/api/login",
    "/api/esqueci-senha",
    "/api/ranking"
  );

  // 3. Utilitário para validar e extrair dados do JWT
  private final JwtUtil jwtUtil;

  // 4. Injeta o JwtUtil via construtor
  public AuthFilter(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  // 5. Lógica principal executada em cada requisição
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse res = (HttpServletResponse) response;
    String path = req.getRequestURI();

    // 6. Requisição OPTIONS (preflight CORS) — libera sem verificar token
    if (req.getMethod().equals("OPTIONS")) {
      chain.doFilter(request, response);
      return;
    }

    // 7. Rota pública (cadastro, login, etc.) — libera sem token
    if (isPublic(path)) {
      chain.doFilter(request, response);
      return;
    }

    // 8. Rota da API que precisa de autenticação
    if (path.startsWith("/api/")) {
      String auth = req.getHeader("Authorization");

      // 9. Verifica se o header Authorization começa com "Bearer "
      if (auth != null && auth.startsWith("Bearer ")) {
        String token = auth.substring(7); // Remove "Bearer " e fica só com o token

        // 10. Valida o token JWT (assinatura + expiração)
        if (jwtUtil.tokenValido(token)) {
          // 11. Extrai o ID do usuário e guarda na requisição para o controller usar
          Long userId = jwtUtil.extrairUsuarioId(token);
          req.setAttribute("usuarioId", userId);
          chain.doFilter(request, response);
          return;
        }
      }

      // 12. Token ausente ou inválido → retorna 401
      res.setStatus(401);
      res.setContentType("application/json;charset=UTF-8");
      res.getWriter().write("{\"erro\":\"Não autenticado\"}");
      return;
    }

    // 13. Não é rota da API (ex.: arquivos estáticos) — libera
    chain.doFilter(request, response);
  }

  // 14. Verifica se o path da requisição está na lista de rotas públicas
  private boolean isPublic(String path) {
    for (String p : PUBLIC_PATHS) {
      if (path.equals(p)) return true;
    }
    return false;
  }
}

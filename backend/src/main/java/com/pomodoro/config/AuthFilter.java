package com.pomodoro.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component
@Order(1)
public class AuthFilter implements Filter {

  private static final Set<String> PUBLIC_PATHS = Set.of(
    "/api/cadastro",
    "/api/login",
    "/api/esqueci-senha",
    "/api/ranking"
  );

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest req = (HttpServletRequest) request;
    HttpServletResponse res = (HttpServletResponse) response;
    String path = req.getRequestURI();

    if (req.getMethod().equals("OPTIONS")) {
      chain.doFilter(request, response);
      return;
    }

    if (isPublic(path)) {
      chain.doFilter(request, response);
      return;
    }

    if (path.startsWith("/api/")) {
      HttpSession session = req.getSession(false);
      if (session == null || session.getAttribute("usuarioId") == null) {
        res.setStatus(401);
        res.setContentType("application/json;charset=UTF-8");
        res.getWriter().write("{\"erro\":\"Não autenticado\"}");
        return;
      }
    }

    chain.doFilter(request, response);
  }

  private boolean isPublic(String path) {
    for (String p : PUBLIC_PATHS) {
      if (path.equals(p)) return true;
    }
    return false;
  }
}

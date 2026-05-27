package com.pomodoro.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

  private static final String SECRET = "PomodoroStudentsAcademy2026SecretKeyMuitoLonga123!";
  private static final long EXPIRATION = 30L * 24 * 60 * 60 * 1000;

  private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

  public String gerarToken(Long usuarioId) {
    return Jwts.builder()
      .subject(String.valueOf(usuarioId))
      .issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
      .signWith(key)
      .compact();
  }

  public Long extrairUsuarioId(String token) {
    String sub = Jwts.parser()
      .verifyWith(key)
      .build()
      .parseSignedClaims(token)
      .getPayload()
      .getSubject();
    return Long.parseLong(sub);
  }

  public boolean tokenValido(String token) {
    try {
      extrairUsuarioId(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}

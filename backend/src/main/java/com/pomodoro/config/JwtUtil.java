// 1. Utilitário para geração e validação de tokens JWT
package com.pomodoro.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

  // 2. Chave secreta usada para assinar os tokens (deve ser longa e segura)
  private static final String SECRET = "PomodoroStudentsAcademy2026SecretKeyMuitoLonga123!";
  // 3. Expiração de 30 dias em milissegundos
  private static final long EXPIRATION = 30L * 24 * 60 * 60 * 1000;

  // 4. Gera a chave HMAC a partir da string secreta
  private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

  // 5. Gera um token JWT com o ID do usuário como subject
  public String gerarToken(Long usuarioId) {
    return Jwts.builder()
      .subject(String.valueOf(usuarioId))       // 6. Armazena o ID do usuário no token
      .issuedAt(new Date())                     // 7. Data de emissão
      .expiration(new Date(System.currentTimeMillis() + EXPIRATION)) // 8. Data de expiração
      .signWith(key)                            // 9. Assina com a chave HMAC
      .compact();                               // 10. Gera a string do token
  }

  // 11. Extrai o ID do usuário de dentro do token
  public Long extrairUsuarioId(String token) {
    String sub = Jwts.parser()
      .verifyWith(key)                          // 12. Verifica a assinatura
      .build()
      .parseSignedClaims(token)                 // 13. Faz o parse do token
      .getPayload()                             // 14. Obtém os dados (claims)
      .getSubject();                            // 15. Pega o subject (ID do usuário)
    return Long.parseLong(sub);
  }

  // 16. Verifica se o token é válido (assinatura + expiração)
  public boolean tokenValido(String token) {
    try {
      extrairUsuarioId(token);                  // 17. Tenta extrair — se lançar exceção é inválido
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}

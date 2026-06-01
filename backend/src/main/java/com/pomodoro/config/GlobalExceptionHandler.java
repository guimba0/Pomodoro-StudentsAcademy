// 1. Tratamento global de exceções — captura erros não tratados nos controllers
package com.pomodoro.config;

import com.pomodoro.dto.UsuarioResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // 2. Erro de validação (@Valid) — retorna quais campos estão inválidos
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<UsuarioResponse> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
      .map(e -> e.getField() + ": " + e.getDefaultMessage())  // 3. Monta "campo: mensagem" para cada erro
      .reduce((a, b) -> a + "; " + b)                         // 4. Junta todos com "; "
      .orElse("Erro de validação");
    return ResponseEntity.badRequest().body(new UsuarioResponse(message));
  }

  // 6. Qualquer outra exceção não tratada
  @ExceptionHandler(Exception.class)
  public ResponseEntity<UsuarioResponse> handleGeneric(Exception ex) {
    return ResponseEntity.internalServerError().body(new UsuarioResponse(ex.getMessage()));
  }
}

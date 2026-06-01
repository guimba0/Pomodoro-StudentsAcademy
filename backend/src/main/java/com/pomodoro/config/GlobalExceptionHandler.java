// 1. Tratamento global de exceções — captura erros não tratados nos controllers
package com.pomodoro.config;

import com.pomodoro.dto.UsuarioResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  // 2. Erro de validação (@Valid) — retorna quais campos estão inválidos
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public UsuarioResponse handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
      .map(e -> e.getField() + ": " + e.getDefaultMessage())  // 3. Monta "campo: mensagem" para cada erro
      .reduce((a, b) -> a + "; " + b)                         // 4. Junta todos com "; "
      .orElse("Erro de validação");
    return new UsuarioResponse(message);                      // 5. Retorna como JSON com campo "erro"
  }

  // 6. Qualquer outra exceção não tratada
  @ExceptionHandler(Exception.class)
  public UsuarioResponse handleGeneric(Exception ex) {
    return new UsuarioResponse(ex.getMessage());              // 7. Retorna a mensagem do erro
  }
}

package com.pomodoro.config;

import com.pomodoro.dto.UsuarioResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<UsuarioResponse> handleValidation(MethodArgumentNotValidException ex) {
    String msg = ex.getBindingResult().getFieldErrors().stream()
        .map(e -> e.getDefaultMessage())
        .reduce((a, b) -> a + "; " + b)
        .orElse("Dados inválidos.");
    return ResponseEntity.badRequest().body(new UsuarioResponse(msg));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<UsuarioResponse> handleGeneric(Exception ex) {
    return ResponseEntity.badRequest().body(new UsuarioResponse(ex.getMessage()));
  }
}

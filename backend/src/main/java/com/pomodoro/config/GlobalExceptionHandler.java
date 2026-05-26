package com.pomodoro.config;

import com.pomodoro.dto.UsuarioResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public UsuarioResponse handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
      .map(e -> e.getField() + ": " + e.getDefaultMessage())
      .reduce((a, b) -> a + "; " + b)
      .orElse("Erro de validação");
    return new UsuarioResponse(message);
  }

  @ExceptionHandler(Exception.class)
  public UsuarioResponse handleGeneric(Exception ex) {
    return new UsuarioResponse(ex.getMessage());
  }
}

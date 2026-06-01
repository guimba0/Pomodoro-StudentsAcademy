// 1. Configuração de segurança — disponibiliza o codificador de senhas
package com.pomodoro.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

  // 2. Bean do BCrypt — usado para hash e verificação de senhas
  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}

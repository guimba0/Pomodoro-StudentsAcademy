// 1. Configuração de CORS — permite que o frontend React acesse a API
package com.pomodoro.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

  // 2. Bean que configura as regras de CORS para todas as rotas /api/**
  @Bean
  public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")                          // 3. Aplica a todas as rotas da API
          .allowedOrigins("http://localhost:5173",              // 4. Origens permitidas (frontend local)
                          "http://localhost:5174",
                          "http://localhost:5175")
          .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 5. Métodos HTTP permitidos
          .allowedHeaders("Authorization", "Content-Type", "X-Requested-With") // 6. Headers explícitos com credentials
          .allowCredentials(true);                              // 7. Permite enviar cookies/sessão
      }
    };
  }
}

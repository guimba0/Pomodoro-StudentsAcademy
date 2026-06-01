// 1. Classe principal — ponto de entrada da aplicação Spring Boot
package com.pomodoro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PomodoroApplication {

  // 2. Método main — inicia o servidor embutido (Tomcat) na porta 8080
  public static void main(String[] args) {
    SpringApplication.run(PomodoroApplication.class, args);
  }
}

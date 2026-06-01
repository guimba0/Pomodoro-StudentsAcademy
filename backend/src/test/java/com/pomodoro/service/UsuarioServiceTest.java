// 1. Testes do serviço de usuário — cadastro, login, atualização, ranking
package com.pomodoro.service;

import com.pomodoro.dto.RankingResponse;
import com.pomodoro.model.SessionStatus;
import com.pomodoro.model.Usuario;
import com.pomodoro.repository.PomodoroSessionRepository;
import com.pomodoro.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

  @Mock private UsuarioRepository usuarioRepository;
  @Mock private PomodoroSessionRepository sessionRepository;
  @Mock private BCryptPasswordEncoder passwordEncoder;

  @InjectMocks private UsuarioService service;

  private Usuario usuario;

  @BeforeEach
  void setUp() {
    usuario = new Usuario("Maria", "maria@email.com", "hashDaSenha");
    usuario.setId(1L);
    usuario.setPontos(50);
    usuario.setTomates(20);
  }

  // 2. Cadastro — cria usuário com senha codificada
  @Test
  @DisplayName("cadastrar cria usuário com senha codificada")
  void cadastrar_CriaUsuario() {
    when(usuarioRepository.findByEmail("maria@email.com"))
        .thenReturn(Optional.empty());
    when(passwordEncoder.encode("senha123"))
        .thenReturn("hashDaSenha");

    ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
    when(usuarioRepository.save(captor.capture()))
        .thenAnswer(invocation -> invocation.getArgument(0));

    Usuario resultado = service.cadastrar("Maria", "maria@email.com", "senha123");

    assertNotNull(resultado);
    assertEquals("Maria", resultado.getNome());
    assertEquals("maria@email.com", resultado.getEmail());
    assertEquals(0, resultado.getPontos());
    assertEquals(0, resultado.getTomates());
    verify(passwordEncoder).encode("senha123");
  }

  // 3. Cadastro — lança exceção quando email já existe
  @Test
  @DisplayName("cadastrar lança exceção quando email já existe")
  void cadastrar_LancaExcecao_QuandoEmailJaExiste() {
    when(usuarioRepository.findByEmail("maria@email.com"))
        .thenReturn(Optional.of(usuario));

    assertThrows(RuntimeException.class,
        () -> service.cadastrar("Maria", "maria@email.com", "senha123"));
    verify(usuarioRepository, never()).save(any());
  }

  // 4. Login — retorna usuário quando credenciais corretas
  @Test
  @DisplayName("login retorna usuário quando credenciais estão corretas")
  void login_RetornaUsuario_QuandoCredenciaisCorretas() {
    when(usuarioRepository.findByEmail("maria@email.com"))
        .thenReturn(Optional.of(usuario));
    when(passwordEncoder.matches("senha123", "hashDaSenha"))
        .thenReturn(true);

    Optional<Usuario> resultado = service.login("maria@email.com", "senha123");

    assertTrue(resultado.isPresent());
    assertEquals("Maria", resultado.get().getNome());
  }

  // 5. Login — retorna vazio quando senha incorreta
  @Test
  @DisplayName("login retorna vazio quando senha está incorreta")
  void login_RetornaVazio_QuandoSenhaIncorreta() {
    when(usuarioRepository.findByEmail("maria@email.com"))
        .thenReturn(Optional.of(usuario));
    when(passwordEncoder.matches("senhaErrada", "hashDaSenha"))
        .thenReturn(false);

    Optional<Usuario> resultado = service.login("maria@email.com", "senhaErrada");

    assertFalse(resultado.isPresent());
  }

  // 6. Login — retorna vazio quando email não existe
  @Test
  @DisplayName("login retorna vazio quando email não existe")
  void login_RetornaVazio_QuandoEmailNaoExiste() {
    when(usuarioRepository.findByEmail("nao@existe.com"))
        .thenReturn(Optional.empty());

    Optional<Usuario> resultado = service.login("nao@existe.com", "senha123");

    assertFalse(resultado.isPresent());
  }

  // 7. Redefinir senha — altera a senha do usuário
  @Test
  @DisplayName("redefinirSenha altera a senha do usuário")
  void redefinirSenha_AlteraSenha() {
    when(usuarioRepository.findByEmail("maria@email.com"))
        .thenReturn(Optional.of(usuario));
    when(passwordEncoder.encode("novaSenha123"))
        .thenReturn("novoHash");

    service.redefinirSenha("maria@email.com", "novaSenha123");

    assertEquals("novoHash", usuario.getSenha());
    verify(usuarioRepository).save(usuario);
  }

  // 8. Redefinir senha — lança exceção quando email não existe
  @Test
  @DisplayName("redefinirSenha lança exceção quando email não existe")
  void redefinirSenha_LancaExcecao_QuandoEmailNaoExiste() {
    when(usuarioRepository.findByEmail("nao@existe.com"))
        .thenReturn(Optional.empty());

    assertThrows(RuntimeException.class,
        () -> service.redefinirSenha("nao@existe.com", "senha123"));
  }

  // 9. Atualizar — modifica nome e email do usuário
  @Test
  @DisplayName("atualizar modifica nome e email do usuário")
  void atualizar_AtualizaDados() {
    when(usuarioRepository.findById(1L))
        .thenReturn(Optional.of(usuario));
    when(usuarioRepository.existsByEmailAndIdNot("maria@novo.com", 1L))
        .thenReturn(false);
    when(usuarioRepository.save(any(Usuario.class)))
        .thenReturn(usuario);

    Usuario resultado = service.atualizar(1L, "Maria Nova", "maria@novo.com", null);

    assertEquals("Maria Nova", resultado.getNome());
    assertEquals("maria@novo.com", resultado.getEmail());
  }

  // 10. Atualizar — codifica senha quando fornecida
  @Test
  @DisplayName("atualizar codifica senha quando fornecida")
  void atualizar_CodificaSenha_QuandoFornecida() {
    when(usuarioRepository.findById(1L))
        .thenReturn(Optional.of(usuario));
    when(usuarioRepository.existsByEmailAndIdNot("maria@email.com", 1L))
        .thenReturn(false);
    when(passwordEncoder.encode("novaSenha"))
        .thenReturn("novoHash");
    when(usuarioRepository.save(any(Usuario.class)))
        .thenReturn(usuario);

    service.atualizar(1L, "Maria", "maria@email.com", "novaSenha");

    assertEquals("novoHash", usuario.getSenha());
  }

  // 11. Ranking — retorna lista ordenada por focos completos
  @Test
  @DisplayName("obterTopRanking retorna lista ordenada por completos")
  void obterTopRanking_RetornaOrdenado() {
    Usuario u1 = new Usuario("Ana", "ana@email.com", "hash");
    u1.setId(1L);
    Usuario u2 = new Usuario("Bia", "bia@email.com", "hash");
    u2.setId(2L);

    when(usuarioRepository.findAll()).thenReturn(List.of(u1, u2));
    when(sessionRepository.countByUsuarioIdAndStatus(1L, SessionStatus.COMPLETED))
        .thenReturn(5L);
    when(sessionRepository.countByUsuarioIdAndStatus(2L, SessionStatus.COMPLETED))
        .thenReturn(3L);
    when(sessionRepository.countByUsuarioId(anyLong())).thenReturn(5L);
    when(sessionRepository.countByUsuarioIdAndStatus(anyLong(), eq(SessionStatus.FAILED)))
        .thenReturn(0L);

    List<RankingResponse> ranking = service.obterTopRanking();

    assertEquals(2, ranking.size());
    assertEquals("Ana", ranking.get(0).getNome());
    assertEquals("Bia", ranking.get(1).getNome());
  }

  // 12. Buscar por ID — retorna usuário quando existe
  @Test
  @DisplayName("buscarPorId retorna usuário quando existe")
  void buscarPorId_RetornaUsuario() {
    when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

    Optional<Usuario> resultado = service.buscarPorId(1L);

    assertTrue(resultado.isPresent());
    assertEquals("Maria", resultado.get().getNome());
  }

  // 13. Adicionar pontos — incrementa pontos do usuário
  @Test
  @DisplayName("adicionarPontos incrementa pontos do usuário")
  void adicionarPontos_Incrementa() {
    when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
    when(usuarioRepository.save(usuario)).thenReturn(usuario);

    Usuario resultado = service.adicionarPontos(1L, 15);

    assertEquals(65, resultado.getPontos());
  }
}

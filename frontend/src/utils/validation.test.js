import { describe, it, expect } from 'vitest'
import { validarEmail } from './validation'

describe('validarEmail', () => {

  it('aceita email válido simples', () => {
    expect(validarEmail('joao@email.com')).toBe(true)
  })

  it('aceita email com subdomínio', () => {
    expect(validarEmail('joao@aluno.escola.edu.br')).toBe(true)
  })

  it('rejeita string sem @', () => {
    expect(validarEmail('joaoemail.com')).toBe(false)
  })

  it('rejeita string sem ponto no domínio', () => {
    expect(validarEmail('joao@email')).toBe(false)
  })

  it('rejeita string vazia', () => {
    expect(validarEmail('')).toBe(false)
  })

  it('rejeita email com espaço', () => {
    expect(validarEmail('joao @email.com')).toBe(false)
  })

})

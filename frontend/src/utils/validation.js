// 1. Valida formato basico de email (nome@dominio.com)
export function validarEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

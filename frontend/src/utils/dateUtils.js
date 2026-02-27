// src/utils/dateUtils.js

export function obterPrimeiroUltimoDiaDoMes(ano, mesIndex) {
    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mesIndex, 1);
    const primeiroDiaFormatado = primeiroDia.toISOString().split('T')[0];

    // Último dia do mês (dia 0 do mês seguinte)
    const ultimoDia = new Date(ano, mesIndex + 1, 0);
    const ultimoDiaFormatado = ultimoDia.toISOString().split('T')[0];

    return {
        primeiroDia: primeiroDiaFormatado,
        ultimoDia: ultimoDiaFormatado
    };
}

export function obterDatasMesAtual() {
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth(); // 0 a 11
    const anoAtual = dataAtual.getFullYear();

    return obterPrimeiroUltimoDiaDoMes(anoAtual, mesAtual);
}

export const mesesDoAno = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];
import { api } from './api';

/**
 * Camada de serviço para operações de fluxo de caixa.
 * Integra dados de despesas e receitas para análise consolidada.
 */
export const fluxoCaixaService = {
    
    /**
     * Recupera o somatório de despesas por conta em um período.
     * @param {number} idConta - ID da conta selecionada.
     * @param {string} dataInicial - Data de início (YYYY-MM-DD).
     * @param {string} dataFinal - Data de fim (YYYY-MM-DD).
     */
    async getSomaDespesas(idConta, dataInicial, dataFinal) {
        return await api.get(`/despesa/soma/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    },

    /**
     * Recupera o somatório de receitas por conta em um período.
     * @param {number} idConta - ID da conta selecionada.
     * @param {string} dataInicial - Data de início (YYYY-MM-DD).
     * @param {string} dataFinal - Data de fim (YYYY-MM-DD).
     */
    async getSomaReceitas(idConta, dataInicial, dataFinal) {
        return await api.get(`/receita/soma/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    },

    /**
     * Lista todas as despesas detalhadas para o fluxo.
     */
    async listarDespesas(idConta, dataInicial, dataFinal) {
        return await api.get(`/despesa/conta/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    },

    /**
     * Lista todas as receitas detalhadas para o fluxo.
     */
    async listarReceitas(idConta, dataInicial, dataFinal) {
        return await api.get(`/receita/conta/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }
};
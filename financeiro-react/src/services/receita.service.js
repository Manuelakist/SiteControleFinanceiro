import { api } from './api';

/**
 * Camada de serviço para persistência e recuperação de dados de receitas.
 */
export const receitaService = {

    /**
     * Recupera o somatório total de receitas por conta e período.
     * @param {number} idConta 
     * @param {string} dataInicio 
     * @param {string} dataFim 
     */
    async getSoma(idConta, dataInicio, dataFim) {
        return await api.get(`/receita/soma/${idConta}?dataInicial=${dataInicio}&dataFinal=${dataFim}`);
    },

    /**
     * Recupera a listagem de receitas por conta e período.
     * @param {number} idConta 
     * @param {string} dataInicio 
     * @param {string} dataFim 
     */
    async listarPorConta(idConta, dataInicio, dataFim) {
        return await api.get(`/receita/conta/${idConta}?dataInicial=${dataInicio}&dataFinal=${dataFim}`);
    }
};
import { api } from './api';

/**
 * Camada de serviço para persistência e recuperação de dados de despesas.
 */
export const despesaService = {
    
    /**
     * Persiste uma nova despesa no sistema.
     * @param {Object} despesaDTO 
     */
    async adicionarDespesa(despesaDTO) {
        return await api.post('/despesa', despesaDTO);
    },

    /**
     * Recupera o somatório total de despesas por conta e período.
     * @param {number} idConta 
     * @param {string} dataInicio 
     * @param {string} dataFim 
     */
    async getSoma(idConta, dataInicio, dataFim) {
        return await api.get(`/despesa/soma/${idConta}?dataInicial=${dataInicio}&dataFinal=${dataFim}`);
    },

    /**
     * Recupera a listagem de despesas por conta e período.
     * @param {number} idConta 
     * @param {string} dataInicio 
     * @param {string} dataFim 
     */
    async listarPorConta(idConta, dataInicio, dataFim) {
        return await api.get(`/despesa/conta/${idConta}?dataInicial=${dataInicio}&dataFinal=${dataFim}`);
    }
};
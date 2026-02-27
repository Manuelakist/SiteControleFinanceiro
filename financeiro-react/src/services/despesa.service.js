/**
 * @file despesa.service.js
 * @description Serviço responsável pelas requisições HTTP relacionadas ao gerenciamento de despesas.
 */
import { api } from './api';

export const despesaService = {
    /**
     * Obtém a soma total das despesas de uma conta em um período específico.
     * @param {number|string} idConta - Identificador da conta financeira.
     * @param {string} dataInicial - Data de início do filtro (formato YYYY-MM-DD).
     * @param {string} dataFinal - Data de término do filtro (formato YYYY-MM-DD).
     * @returns {Promise<Object>} Resposta da API com o valor total consolidado.
     */
    getSoma: async (idConta, dataInicial, dataFinal) => {
        return await api.get(`/despesa/soma/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    },

    /**
     * Lista todas as despesas associadas a uma conta em um determinado período.
     * Incorpora valores padrão (fallback) de data para evitar falhas de integração (Bad Request 400)
     * caso o componente de origem não forneça os parâmetros de data obrigatórios.
     * @param {number|string} idConta - Identificador da conta financeira.
     * @param {string} [dataInicial='2000-01-01'] - Data de início do filtro.
     * @param {string} [dataFinal='2100-12-31'] - Data de término do filtro.
     * @returns {Promise<Object>} Resposta da API com a listagem de despesas.
     */
    listarDespesas: async (idConta, dataInicial, dataFinal) => {
        const dataInicioValida = dataInicial || '2000-01-01';
        const dataFimValida = dataFinal || '2100-12-31';
        return await api.get(`/despesa/conta/${idConta}?dataInicial=${dataInicioValida}&dataFinal=${dataFimValida}`);
    },

    /**
     * Método de alias para `listarDespesas`.
     * Mantém compatibilidade com componentes legado que invocam chamadas genéricas padronizadas.
     * @param {number|string} idConta - Identificador da conta financeira.
     * @param {string} [dataInicial] - Data de início do filtro.
     * @param {string} [dataFinal] - Data de término do filtro.
     * @returns {Promise<Object>} Resposta da API com a listagem de despesas.
     */
    listarPorConta: async function(idConta, dataInicial, dataFinal) {
        return this.listarDespesas(idConta, dataInicial, dataFinal);
    },

    /**
     * Persiste uma nova despesa na base de dados.
     * @param {Object} dados - Objeto contendo os dados estruturados da despesa.
     * @returns {Promise<Object>} Resposta da API.
     */
    adicionarDespesa: async (dados) => {
        return await api.post('/despesa', dados);
    },

    /**
     * Atualiza o registro de uma despesa existente.
     * @param {number|string} id - Identificador único da despesa.
     * @param {Object} dados - Objeto contendo as novas informações da despesa.
     * @returns {Promise<Object>} Resposta da API.
     */
    alterarDespesa: async (id, dados) => {
        return await api.put(`/despesa/${id}`, dados);
    },

    /**
     * Remove fisicamente ou inativa uma despesa do sistema.
     * @param {number|string} id - Identificador único da despesa a ser excluída.
     * @returns {Promise<Object>} Resposta da API.
     */
    deletarDespesa: async (id) => {
        return await api.delete(`/despesa/${id}`);
    }
};
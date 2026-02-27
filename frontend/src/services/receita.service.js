/**
 * @file receita.service.js
 * @description Serviço responsável pelas requisições HTTP relacionadas ao gerenciamento de receitas.
 */
import { api } from './api';

export const receitaService = {
    /**
     * Obtém a soma total das receitas de uma conta em um período específico.
     * @param {number|string} idConta - Identificador da conta financeira.
     * @param {string} dataInicial - Data de início do filtro (formato YYYY-MM-DD).
     * @param {string} dataFinal - Data de término do filtro (formato YYYY-MM-DD).
     * @returns {Promise<Object>} Resposta da API com o valor total consolidado.
     */
    getSoma: async (idConta, dataInicial, dataFinal) => {
        return await api.get(`/receita/soma/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    },

    /**
     * Lista todas as receitas associadas a uma conta em um determinado período.
     * Incorpora valores padrão (fallback) de data para evitar falhas de integração (Bad Request 400)
     * caso o componente de origem não forneça os parâmetros de data obrigatórios.
     * @param {number|string} idConta - Identificador da conta financeira.
     * @param {string} [dataInicial='2000-01-01'] - Data de início do filtro.
     * @param {string} [dataFinal='2100-12-31'] - Data de término do filtro.
     * @returns {Promise<Object>} Resposta da API com a listagem de receitas.
     */
    listarReceitas: async (idConta, dataInicial, dataFinal) => {
        const dataInicioValida = dataInicial || '2000-01-01';
        const dataFimValida = dataFinal || '2100-12-31';
        return await api.get(`/receita/conta/${idConta}?dataInicial=${dataInicioValida}&dataFinal=${dataFimValida}`);
    },

    /**
     * Método de alias para `listarReceitas`.
     * Mantém compatibilidade com componentes legado que invocam chamadas genéricas padronizadas.
     * @param {number|string} idConta - Identificador da conta financeira.
     * @param {string} [dataInicial] - Data de início do filtro.
     * @param {string} [dataFinal] - Data de término do filtro.
     * @returns {Promise<Object>} Resposta da API com a listagem de receitas.
     */
    listarPorConta: async function(idConta, dataInicial, dataFinal) {
        return this.listarReceitas(idConta, dataInicial, dataFinal);
    },

    /**
     * Persiste uma nova receita na base de dados.
     * @param {Object} dados - Objeto contendo os dados estruturados da receita.
     * @returns {Promise<Object>} Resposta da API.
     */
    adicionarReceita: async (dados) => {
        return await api.post('/receita', dados);
    },

    /**
     * Atualiza o registro de uma receita existente.
     * @param {number|string} id - Identificador único da receita.
     * @param {Object} dados - Objeto contendo as novas informações da receita.
     * @returns {Promise<Object>} Resposta da API.
     */
    alterarReceita: async (id, dados) => {
        return await api.put(`/receita/${id}`, dados);
    },

    /**
     * Remove fisicamente ou inativa uma receita do sistema.
     * @param {number|string} id - Identificador único da receita a ser excluída.
     * @returns {Promise<Object>} Resposta da API.
     */
    deletarReceita: async (id) => {
        return await api.delete(`/receita/${id}`);
    }
};
import { api } from './api';

/**
 * Serviço de integração com a API de Orçamentos.
 */
export const orcamentoService = {
    async listarPorConta(idConta) {
        return await api.get(`/orcamento?idConta=${idConta}`);
    },

    async adicionarOrcamento(orcamento) {
        return await api.post('/orcamento', orcamento);
    },

    async alterarOrcamento(id, orcamento) {
        return await api.put(`/orcamento/${id}`, orcamento);
    },

    async deletarOrcamento(id) {
        return await api.delete(`/orcamento/${id}`);
    }
};
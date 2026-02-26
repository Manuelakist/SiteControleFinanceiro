import { api } from './api';

export const orcamentoService = {
    async listarPorConta(idConta) {
        return await api.get(`/orcamento/conta/${idConta}`);
    },

    async salvar(orcamento) {
        return await api.post('/orcamento', orcamento);
    },

    async atualizar(id, orcamento) {
        return await api.put(`/orcamento/${id}`, orcamento);
    },

    async deletar(id) {
        return await api.delete(`/orcamento/${id}`);
    }
};
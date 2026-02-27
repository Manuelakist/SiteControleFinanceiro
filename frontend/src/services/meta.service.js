import { api } from './api';

export const metaService = {
    listarPorConta: async (idConta) => {
        return await api.get(`/meta/conta/${idConta}`);
    },

    buscarMetaPorId: async (id) => {
        return await api.get(`/meta/${id}`);
    },

    adicionarMeta: async (dados) => {
        return await api.post('/meta', dados);
    },

    alterarMeta: async (id, dados) => {
        return await api.put(`/meta/${id}`, dados);
    },

    deletarMeta: async (id) => {
        return await api.delete(`/meta/${id}`);
    }
};
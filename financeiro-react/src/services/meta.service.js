import { api } from './api';

/**
 * Serviço para persistência e recuperação de metas financeiras.
 */
export const metaService = {
    async listarPorUsuario(idUsuario) {
        return await api.get(`/meta/usuario/${idUsuario}`);
    },

    async salvar(meta) {
        return await api.post('/meta', meta);
    },

    async atualizar(id, meta) {
        return await api.put(`/meta/${id}`, meta);
    },

    async deletar(id) {
        return await api.delete(`/meta/${id}`);
    }
};
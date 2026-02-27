import { api } from './api';

/**
 * Serviço responsável pela gestão de depósitos vinculados a metas.
 */
export const depositoService = {
    async listarPorMeta(idMeta) {
        return await api.get(`/deposito/meta/${idMeta}`);
    },

    async adicionarDeposito(deposito) {
        return await api.post('/deposito', deposito);
    },

    async deletarDeposito(id) {
        return await api.delete(`/deposito/${id}`);
    }
};
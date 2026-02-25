import { api } from './api';

/**
 * Camada de serviço para operações da entidade Conta.
 */
export const contaService = {
    
    /**
     * Recupera a lista de contas financeiras associadas a um utilizador.
     * @param {number} idUsuario 
     */
    async getContasPorUsuario(idUsuario) {
        return await api.get(`/conta?idUsuario=${idUsuario}`);
    },

    /**
     * Recupera os detalhes de uma conta financeira pelo ID.
     * @param {number} id 
     */
    async buscarContaPorId(id) {
        return await api.get(`/conta/${id}`);
    }
};
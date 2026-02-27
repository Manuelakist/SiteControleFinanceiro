import { api } from './api';

/**
 * Serviço para obtenção de dados estatísticos e analíticos.
 */
export const relatorioService = {
    async getDadosMensais(idConta, mes, ano) {
        return await api.get(`/relatorios/mensal`, {
            params: { idConta, mes, ano }
        });
    },

    async getDistribuicaoCategoria(idConta, tipo) {
        return await api.get(`/relatorios/categorias`, {
            params: { idConta, tipo } // tipo: 'RECEITA' ou 'DESPESA'
        });
    }
};
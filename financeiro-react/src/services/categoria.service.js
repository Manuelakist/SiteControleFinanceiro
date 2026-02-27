import { api } from './api';

/**
 * Serviço responsável pela comunicação com os endpoints de categorias.
 */
export const categoriaService = {
    async listarCategoriasDespesa(idConta) {
        return await api.get(`/categoria-despesa/conta/${idConta}`);
    },

    async adicionarCategoriaDespesa(categoriaData) {
        return await api.post('/categoria-despesa', categoriaData);
    },

    async listarCategoriasReceita(idConta) {
        return await api.get(`/categoria-receita/conta/${idConta}`);
    },

    async adicionarCategoriaReceita(categoriaData) {
        return await api.post('/categoria-receita', categoriaData);
    }
};
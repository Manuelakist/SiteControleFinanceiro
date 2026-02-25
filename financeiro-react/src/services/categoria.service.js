import { api } from './api';

/**
 * Camada de serviço para gestão de categorias de despesa e receita.
 */
export const categoriaService = {

    /**
     * Recupera todas as categorias de despesa associadas a uma conta.
     * @param {number} idConta 
     */
    async listarCategoriasDespesa(idConta) {
        return await api.get(`/categoria-despesa/conta/${idConta}`);
    },

    /**
     * Persiste uma nova categoria de despesa.
     * @param {Object} categoriaData - Objeto contendo nome e contaId.
     */
    async adicionarCategoriaDespesa(categoriaData) {
        return await api.post('/categoria-despesa', categoriaData);
    },

    /**
     * Recupera todas as categorias de receita associadas a uma conta.
     * @param {number} idConta 
     */
    async listarCategoriasReceita(idConta) {
        return await api.get(`/categoria-receita/conta/${idConta}`);
    },

    /**
     * Persiste uma nova categoria de receita.
     * @param {Object} categoriaData - Objeto contendo nome e contaId.
     */
    async adicionarCategoriaReceita(categoriaData) {
        return await api.post('/categoria-receita', categoriaData);
    }
};
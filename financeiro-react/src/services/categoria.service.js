import { api } from '../services/api'; 

export const categoriaService = {

    async listarCategoriasDespesa(idConta) {
        // Se idConta for undefined, lança erro antes de chamar a API para facilitar o debug
        if (!idConta) console.error("ID Conta não fornecido para categorias de despesa!");
        
        return await api.get(`/categoriaDespesa?idConta=${idConta}`);
    },

    async listarCategoriasReceita(idConta) {
        if (!idConta) console.error("ID Conta não fornecido para categorias de receita!");

        return await api.get(`/categoriaReceita?idConta=${idConta}`);
    }
};
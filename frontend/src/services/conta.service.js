/**
 * @file conta.service.js
 * @description Serviço responsável pelas requisições HTTP relacionadas às contas financeiras e gestão de estado local.
 */
import { api } from './api';

export const contaService = {
    /**
     * Busca todas as contas associadas a um determinado usuário.
     * @param {number|string} idUsuario - Identificador único do usuário.
     * @returns {Promise<Object>} Resposta da API contendo a lista de contas.
     */
    getContasPorUsuario: async (idUsuario) => {
        return await api.get(`/conta/usuario/${idUsuario}`);
    },

    /**
     * Busca os detalhes de uma conta específica pelo seu identificador.
     * @param {number|string} idConta - Identificador único da conta.
     * @returns {Promise<Object>} Resposta da API contendo os dados da conta.
     */
    buscarContaPorId: async (idConta) => {
        return await api.get(`/conta/${idConta}`);
    },

    /**
     * Adiciona uma nova conta financeira.
     * @param {Object} dados - Objeto contendo os dados da nova conta.
     * @returns {Promise<Object>} Resposta da API.
     */
    adicionarConta: async (dados) => {
        return await api.post('/conta', dados);
    },

    /**
     * Atualiza os dados de uma conta existente.
     * @param {number|string} id - Identificador único da conta a ser alterada.
     * @param {Object} dados - Objeto contendo os novos dados da conta.
     * @returns {Promise<Object>} Resposta da API.
     */
    alterarConta: async (id, dados) => {
        return await api.put(`/conta/${id}`, dados);
    },

    /**
     * Exclui uma conta financeira do sistema.
     * @param {number|string} id - Identificador único da conta a ser excluída.
     * @returns {Promise<Object>} Resposta da API.
     */
    deletarConta: async (id) => {
        return await api.delete(`/conta/${id}`);
    },

    /**
     * Armazena o identificador da conta ativa no armazenamento local (localStorage).
     * @param {number|string} idConta - Identificador único da conta ativa.
     */
    setContaAtivaLocal: (idConta) => {
        localStorage.setItem('contaAtivaId', idConta);
    },

    /**
     * Recupera a conta ativa com base no cache do navegador.
     * Caso não exista uma conta salva, define a primeira conta da lista fornecida como ativa.
     * @param {Array<Object>} contas - Lista de contas disponíveis para o usuário.
     * @returns {Object|null} A conta ativa ou null caso a lista seja inválida ou vazia.
     */
    getContaAtivaLocal: (contas) => {
        if (!contas || contas.length === 0) {
            return null;
        }
        
        const idSalvo = localStorage.getItem('contaAtivaId');
        if (idSalvo) {
            const contaEncontrada = contas.find(c => c.id.toString() === idSalvo);
            if (contaEncontrada) {
                return contaEncontrada;
            }
        }
        
        localStorage.setItem('contaAtivaId', contas[0].id);
        return contas[0];
    }
};
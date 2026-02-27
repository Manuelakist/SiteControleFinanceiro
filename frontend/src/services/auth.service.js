/**
 * @file auth.service.js
 * @description Serviço responsável pela autenticação e gestão do usuário logado.
 */
import { api } from './api';

export const authService = {
    /**
     * Realiza o login do usuário buscando pelo email (conforme definido no backend).
     * @param {string} email - Email do usuário.
     * @param {string} senha - Senha do usuário.
     * @returns {Promise<Object>} Dados do usuário logado.
     */
    login: async (email, senha) => {
        try {
            // O backend mapeou como @GetMapping("/login") em /usuario
            const data = await api.get(`/usuario/login?email=${email}`);
            
            // Valida se o usuário foi retornado e se a senha bate com a do banco
            if (data && data.senha === senha) {
                localStorage.setItem('usuario', JSON.stringify(data));
                return data;
            } else {
                throw new Error('Senha incorreta.');
            }
        } catch (error) {
            // Se o backend retornar 404, significa que o email não existe no banco de dados
            if (error.message && error.message.includes('404')) {
                throw new Error('Usuário não encontrado. Verifique o email digitado.');
            }
            throw new Error(error.message || 'Erro ao fazer login.');
        }
    },

    /**
     * Registra um novo usuário no sistema.
     * @param {Object} dados - Dados do novo usuário.
     * @returns {Promise<Object>} Resposta da API.
     */
    registrar: async (dados) => {
        // O backend mapeou como @PostMapping em /usuario
        return await api.post('/usuario', dados);
    },

    /**
     * Recupera os dados do usuário logado do cache do navegador.
     * @returns {Object|null} Objeto do usuário ou null se não estiver logado.
     */
    getUsuarioLogado: () => {
        const usuarioStr = localStorage.getItem('usuario');
        return usuarioStr ? JSON.parse(usuarioStr) : null;
    },

    /**
     * Remove os dados do usuário do cache e redireciona para a tela de login.
     */
    logout: () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    }
};
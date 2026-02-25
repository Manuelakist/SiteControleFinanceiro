import { api } from './api';

export const authService = {
    /**
     * Autentica o utilizador validando as credenciais no back-end.
     * @param {string} email 
     * @param {string} senha 
     * @returns {Promise<Object>} Dados do utilizador autenticado
     */
    async login(email, senha) {
        const usuario = await api.get(`/usuario/login?email=${encodeURIComponent(email)}`);
        
        if (!usuario || !usuario.id) {
            throw new Error('Usuário não encontrado.');
        }

        if (usuario.senha !== senha) {
            throw new Error('Senha incorreta.');
        }

        localStorage.setItem('usuario', JSON.stringify({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }));

        return usuario;
    },

    /**
     * Efetua o registo de um novo utilizador.
     * Requer que o ControllerUsuario.java possua o endpoint POST /usuario.
     * @param {Object} dadosUsuario - Objeto contendo { nome, email, senha }
     * @returns {Promise<Object>} Dados do utilizador recém-criado
     */
    async registrar(dadosUsuario) {
        try {
            const novoUsuario = await api.post('/usuario', dadosUsuario);
            
            if (!novoUsuario) {
                throw new Error('Resposta inválida do servidor.');
            }
            
            return novoUsuario;
        } catch (error) {
            // Repassa o erro para ser tratado pela camada de UI (Login.jsx)
            throw new Error(error.message || 'Erro ao comunicar com o servidor para registo.');
        }
    },

    /**
     * Remove o contexto de autenticação do armazenamento local.
     */
    logout() {
        localStorage.removeItem('usuario');
    },

    /**
     * Recupera o contexto do utilizador atualmente autenticado.
     * @returns {Object|null} Objeto do utilizador ou null se não houver sessão ativa
     */
    getUsuarioLogado() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }
};
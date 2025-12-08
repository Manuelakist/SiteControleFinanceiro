import { api } from './api';

export const authService = {
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

    logout() {
        localStorage.removeItem('usuario');
    },

    getUsuarioLogado() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }
};
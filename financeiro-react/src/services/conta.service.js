import { api } from './api';

export const contaService = {
    // Busca o saldo e dados da conta
    async getContaById(id) {
        return await api.get(`/conta/${id}`);
    },
    
    // Atualiza o saldo (usado quando adicionamos lançamentos)
    async atualizarSaldo(id, novoSaldo) {
        return await api.put(`/conta/${id}`, { saldo: novoSaldo });
    }
};
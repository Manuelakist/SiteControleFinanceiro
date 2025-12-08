import { api } from './api';

export const receitaService = {
    async getSoma(idConta, dataInicial, dataFinal) {
        const valor = await api.get(`/receita/soma/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
        return valor || 0;
    },

    async listarPorConta(idConta, dataInicial, dataFinal) {
        return await api.get(`/receita/conta/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    },

    async criar(receitaDTO) {
        return await api.post('/receita', receitaDTO); 
    }
};
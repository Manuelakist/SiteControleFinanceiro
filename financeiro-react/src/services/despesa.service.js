import { api } from './api';

export const despesaService = {
    // Busca a soma das despesas de um período
    async getSoma(idConta, dataInicial, dataFinal) {
        // O backend pode retornar null se não houver despesas, então tratamos com || 0
        const valor = await api.get(`/despesa/soma/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
        return valor || 0;
    },

    // Lista todas as despesas do período (para a tabela)
    async listarPorConta(idConta, dataInicial, dataFinal) {
        return await api.get(`/despesa/conta/${idConta}?dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }
};
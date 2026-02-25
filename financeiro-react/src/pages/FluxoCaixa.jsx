import { useState, useEffect } from 'react';
import { fluxoCaixaService } from '../../services/fluxoCaixa.service';
import { contaService } from '../../services/conta.service';
import { authService } from '../../services/auth.service';
import { obterDatasMesAtual } from '../../utils/dateUtils';
import '../../assets/css/overview.css'; 

/**
 * Componente de Fluxo de Caixa.
 * Apresenta a saúde financeira através do confronto entre entradas e saídas.
 */
export function FluxoCaixa() {
    const [loading, setLoading] = useState(true);
    const [idConta, setIdConta] = useState(null);
    const [dados, setDados] = useState({
        entradas: 0,
        saidas: 0,
        saldoPeriodo: 0,
        historico: []
    });

    useEffect(() => {
        carregarFluxo();
    }, []);

    /**
     * Carrega os dados de movimentação baseados na conta principal do usuário.
     */
    async function carregarFluxo() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            const contas = await contaService.getContasPorUsuario(usuario.id);
            
            if (contas && contas.length > 0) {
                const contaAtiva = contas[0];
                setIdConta(contaAtiva.id);

                const { primeiroDia, ultimoDia } = obterDatasMesAtual();

                const [resEntradas, resSaidas, resL_Desp, resL_Rec] = await Promise.all([
                    fluxoCaixaService.getSomaReceitas(contaAtiva.id, primeiroDia, ultimoDia),
                    fluxoCaixaService.getSomaDespesas(contaAtiva.id, primeiroDia, ultimoDia),
                    fluxoCaixaService.listarDespesas(contaAtiva.id, primeiroDia, ultimoDia),
                    fluxoCaixaService.listarReceitas(contaAtiva.id, primeiroDia, ultimoDia)
                ]);

                const entradas = resEntradas.data ?? resEntradas ?? 0;
                const saidas = resSaidas.data ?? resSaidas ?? 0;

                // Consolidação de histórico para exibição na tabela
                const listaDesp = (resL_Desp.data ?? resL_Desp ?? []).map(d => ({ ...d, tipoMov: 'SAIDA' }));
                const listaRec = (resL_Rec.data ?? resL_Rec ?? []).map(r => ({ ...r, tipoMov: 'ENTRADA' }));
                
                const historicoOrdenado = [...listaDesp, ...listaRec].sort((a, b) => 
                    new Date(b.data) - new Date(a.data)
                );

                setDados({
                    entradas,
                    saidas,
                    saldoPeriodo: entradas - saidas,
                    historico: historicoOrdenado
                });
            }
        } catch (error) {
            console.error("Erro ao carregar fluxo de caixa:", error);
        } finally {
            setLoading(false);
        }
    }

    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

    return (
        <div className="vg">
            <div className="info-box">
                <div className="box" style={{ background: 'linear-gradient(to bottom right, #2e7d32, #1b5e20)', color: '#fff' }}>
                    <p className="lbl">Entradas do Mês</p>
                    <div className="espaco"></div>
                    <p className="valor">{loading ? '...' : formatarMoeda(dados.entradas)}</p>
                </div>
                <div className="box" style={{ background: 'linear-gradient(to bottom right, #c62828, #b71c1c)', color: '#fff' }}>
                    <p className="lbl">Saídas do Mês</p>
                    <div className="espaco"></div>
                    <p className="valor">{loading ? '...' : formatarMoeda(dados.saidas)}</p>
                </div>
                <div className="box" style={{ background: dados.saldoPeriodo >= 0 ? 'linear-gradient(to bottom right, #8060F6, #6139f2)' : '#333', color: '#fff' }}>
                    <p className="lbl">Saldo do Período</p>
                    <div className="espaco"></div>
                    <p className="valor">{loading ? '...' : formatarMoeda(dados.saldoPeriodo)}</p>
                </div>
                <div className="box alguma-info">
                    <p className="lbl">Status</p>
                    <div className="espaco"></div>
                    <p className="valor" style={{ fontSize: '20px' }}>
                        {dados.saldoPeriodo >= 0 ? 'Superavitário' : 'Déficit'}
                    </p>
                </div>
            </div>

            <div className="vg-tela" style={{ gridTemplateRows: '1fr' }}>
                <div className="box" style={{ gridColumn: '1 / 5', display: 'flex', flexDirection: 'column' }}>
                    <p className="link">Extrato Consolidado</p>
                    <div className="tabela" style={{ overflowY: 'auto', flex: 1 }}>
                        {dados.historico.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>Nenhuma movimentação no período.</p>
                        ) : (
                            dados.historico.map((item, index) => (
                                <div className="linha" key={index} style={{ gridTemplateColumns: '100px 2fr 1fr 1fr' }}>
                                    <p style={{ fontSize: '12px', color: '#666' }}>{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                                    <p className="titulo">{item.descricao}</p>
                                    <p className="valor" style={{ color: item.tipoMov === 'SAIDA' ? '#c62828' : '#2e7d32' }}>
                                        {item.tipoMov === 'SAIDA' ? `- ${formatarMoeda(item.valor)}` : formatarMoeda(item.valor)}
                                    </p>
                                    <p className="categoria" style={{ backgroundColor: item.tipoMov === 'SAIDA' ? '#1B1239' : '#8060F6' }}>
                                        {item.categoriaDespesaDTO?.nome || item.categoriaReceitaDTO?.nome || 'Geral'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { orcamentoService } from '../services/orcamento.service';
import { despesaService } from '../services/despesa.service';
import { contaService } from '../services/conta.service';
import { authService } from '../services/auth.service';
import { obterDatasMesAtual } from '../utils/dateUtils';
import '../assets/css/budgets.css';

/**
 * Componente de gestão de orçamentos.
 * Apresenta o limite definido por categoria versus o gasto real do mês.
 */
export function Orcamentos() {
    const [loading, setLoading] = useState(true);
    const [orcamentos, setOrcamentos] = useState([]);
    const [idConta, setIdConta] = useState(null);

    useEffect(() => {
        carregarDados();
    }, []);

    /**
     * Sincroniza dados de orçamentos e despesas do mês atual.
     */
    async function carregarDados() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            const contas = await contaService.getContasPorUsuario(usuario.id);
            const listaContas = contas.data || contas;
            
            if (listaContas && listaContas.length > 0) {
                const contaAtiva = listaContas[0];
                setIdConta(contaAtiva.id);

                const { primeiroDia, ultimoDia } = obterDatasMesAtual();

                const [resOrcamentos, resDespesas] = await Promise.all([
                    orcamentoService.listarPorConta(contaAtiva.id),
                    despesaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia)
                ]);

                const listaOrc = resOrcamentos.data ?? resOrcamentos ?? [];
                const listaDesp = resDespesas.data ?? resDespesas ?? [];

                const orcamentosProcessados = listaOrc.map(orc => {
                    const gastoNaCategoria = listaDesp
                        .filter(d => d.categoriaDespesaDTO?.id === orc.categoriaDespesaDTO?.id)
                        .reduce((acc, d) => acc + d.valor, 0);
                    
                    const porcentagem = orc.valor_limite > 0 
                        ? Math.min((gastoNaCategoria / orc.valor_limite) * 100, 100) 
                        : 0;

                    return { ...orc, gastoAtual: gastoNaCategoria, progresso: porcentagem };
                });

                setOrcamentos(orcamentosProcessados);
            }
        } catch (error) {
            console.error("Erro na carga de dados dos orçamentos:", error);
        } finally {
            setLoading(false);
        }
    }

    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

    return (
        <div className="orc" id="pagina-orcamentos">
            <div className="cabecalho-orc">
                <p className="titulo">Meus Orçamentos</p>
                <button className="btn-novo-orc">+ Novo Orçamento</button>
            </div>

            <div className="grid-orcamentos">
                {loading ? (
                    <p className="msg-status">Carregando dados financeiros...</p>
                ) : orcamentos.length === 0 ? (
                    <p className="msg-status">Nenhum orçamento configurado para este período.</p>
                ) : (
                    orcamentos.map((orc) => (
                        <div className="box-orcamento" key={orc.id}>
                            <div className="topo-box">
                                <p className="cat-nome">{orc.categoriaDespesaDTO?.nome || 'Geral'}</p>
                                <div className="acoes">
                                    <button className="btn-icon">
                                        <i className="material-symbols-outlined">edit</i>
                                    </button>
                                    <button className="btn-icon delete">
                                        <i className="material-symbols-outlined">delete</i>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="valores">
                                <div className="vlr-item">
                                    <p className="label">Gasto</p>
                                    <p className="quantia">{formatarMoeda(orc.gastoAtual)}</p>
                                </div>
                                <div className="vlr-item">
                                    <p className="label">Limite</p>
                                    <p className="quantia">{formatarMoeda(orc.valor_limite)}</p>
                                </div>
                            </div>

                            <div className="barra-container">
                                <div 
                                    className="barra-progresso" 
                                    style={{ 
                                        width: `${orc.progresso}%`,
                                        backgroundColor: orc.progresso >= 90 ? '#d32f2f' : '#8060F6' 
                                    }}
                                ></div>
                            </div>
                            <p className="porcentagem">{Math.round(orc.progresso)}% do limite consumido</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
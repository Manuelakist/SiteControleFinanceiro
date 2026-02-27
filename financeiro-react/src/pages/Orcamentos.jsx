import { useState, useEffect } from 'react';
import { orcamentoService } from '../services/orcamento.service';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';
import { contaService } from '../services/conta.service';
import { authService } from '../services/auth.service';
import { obterDatasMesAtual } from '../utils/dateUtils';
import { ModalOrcamento } from '../components/modals/ModalOrcamento';
import '../assets/css/budgets.css';

/**
 * Componente de Orçamentos Financeiros.
 * Realiza o cruzamento de limites orçamentais com gastos reais por categoria,
 * apresentando indicadores de performance financeira mensal.
 */
export function Orcamentos() {
    const [loading, setLoading] = useState(true);
    const [orcamentos, setOrcamentos] = useState([]);
    const [showModalOrc, setShowModalOrc] = useState(false);
    const [orcEmEdicao, setOrcEmEdicao] = useState(null);

    const [resumo, setResumo] = useState({ receitaMensal: 0, gastoMaximo: 0, gastoAtual: 0, lucroEsperado: 0 });

    /**
     * Efeito para carga inicial e subscrição a eventos de atualização.
     */
    useEffect(() => {
        carregarDados();

        const handleUpdate = () => carregarDados();
        window.addEventListener('atualizarDados', handleUpdate);
        window.addEventListener('contaMudou', handleUpdate);
        return () => {
            window.removeEventListener('atualizarDados', handleUpdate);
            window.removeEventListener('contaMudou', handleUpdate);
        };
    }, []);

    /**
     * Requisita orçamentos, despesas e receitas para consolidar o painel de resumo e a listagem.
     */
    async function carregarDados() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            if (!usuario) return;

            const contas = await contaService.getContasPorUsuario(usuario.id);
            const listaContas = contas.data || contas;
            
            const contaAtiva = contaService.getContaAtivaLocal(listaContas);
            if (!contaAtiva) {
                setLoading(false);
                return;
            }

            const { primeiroDia, ultimoDia } = obterDatasMesAtual();

            const [resOrcamentos, resDespesas, somaReceitas, somaDespesas] = await Promise.all([
                orcamentoService.listarPorConta(contaAtiva.id),
                despesaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                receitaService.getSoma(contaAtiva.id, primeiroDia, ultimoDia),
                despesaService.getSoma(contaAtiva.id, primeiroDia, ultimoDia)
            ]);

            const listaOrc = resOrcamentos.data ?? resOrcamentos ?? [];
            const listaDesp = resDespesas.data ?? resDespesas ?? [];
            const totalOrcado = listaOrc.reduce((acc, orc) => acc + orc.valor, 0);

            setResumo({
                receitaMensal: somaReceitas.data ?? somaReceitas ?? 0,
                gastoMaximo: totalOrcado,
                gastoAtual: somaDespesas.data ?? somaDespesas ?? 0,
                lucroEsperado: (somaReceitas.data ?? somaReceitas ?? 0) - totalOrcado
            });

            const processados = listaOrc.map(orc => {
                const gastoCat = listaDesp
                    .filter(d => d.categoriaDespesaDTO?.id === orc.categoriaDespesaDTO?.id)
                    .reduce((acc, d) => acc + d.valor, 0);
                return { ...orc, gastoAtual: gastoCat, porcentagem: orc.valor > 0 ? (gastoCat / orc.valor) * 100 : 0 };
            });

            setOrcamentos(processados);
            
        } catch (error) {
            console.error("Falha na sincronização de orçamentos:", error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Remove um orçamento após confirmação.
     */
    async function handleExcluirOrcamento(id) {
        if(window.confirm('Deseja excluir este orçamento?')) {
            await orcamentoService.deletarOrcamento(id);
            carregarDados();
        }
    }

    const formatarMoeda = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return (
        <div className="or" id="pagina-orcamentos">
            <div className="conteudo">
                <div className="cabecalho-orc">
                    <div className="coluna">
                        <div className="caixa-1 box"><p className="titulo">Receita mensal</p><p className="valor">{loading ? '...' : formatarMoeda(resumo.receitaMensal)}</p></div>
                        <div className="caixa-2 box"><p className="titulo">Gasto máximo</p><p className="valor">{loading ? '...' : formatarMoeda(resumo.gastoMaximo)}</p></div>
                    </div>
                    <div className="coluna">
                        <div className="caixa-3 box"><p className="titulo">Gasto atual</p><p className="valor">{loading ? '...' : formatarMoeda(resumo.gastoAtual)}</p></div>
                        <div className="caixa-4 box"><p className="titulo">Lucro esperado</p><p className="valor">{loading ? '...' : formatarMoeda(resumo.lucroEsperado)}</p></div>
                    </div>
                </div>

                <div className="lista">
                    <div className="cabecalho-lista"><p>categoria</p><p>valor gasto</p><p>valor máximo</p><p className="cbc-barra">percentual</p><div style={{ width: '20px' }}></div></div>
                    
                    <div id="tabela-orc">
                        {!loading && orcamentos.map(orc => (
                            <div className="linha" key={orc.id}>
                                <p className="nome">{orc.categoriaDespesaDTO?.nome}</p>
                                <p className="valor">{formatarMoeda(orc.gastoAtual)}</p>
                                <p className="valor">{formatarMoeda(orc.valor)}</p>
                                <div className={`barra-container ${orc.porcentagem < 15 ? 'pequena' : ''}`}>
                                    <div className="barra-progresso" style={{ width: `${Math.min(orc.porcentagem, 100)}%` }}><span className="porcentagem-texto">{orc.porcentagem.toFixed(1)}%</span></div>
                                </div>
                                <div className="acoes">
                                    <button className="alt" onClick={() => { setOrcEmEdicao(orc); setShowModalOrc(true); }}><i className="material-symbols-outlined">edit_square</i></button>
                                    <button className="delete" onClick={() => handleExcluirOrcamento(orc.id)}><i className="material-symbols-outlined">delete</i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <ModalOrcamento isOpen={showModalOrc} onClose={() => setShowModalOrc(false)} onSave={carregarDados} orcamentoParaEditar={orcEmEdicao} />
        </div>
    );
}
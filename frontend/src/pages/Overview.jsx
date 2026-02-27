import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import '../assets/css/overview.css';
import { obterDatasMesAtual } from '../utils/dateUtils';
import { authService } from '../services/auth.service';
import { contaService } from '../services/conta.service';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';
import { categoriaService } from '../services/categoria.service';
import { metaService } from '../services/meta.service';
import { orcamentoService } from '../services/orcamento.service';

Chart.register(...registerables);

/**
 * Componente do Dashboard (Visão Geral).
 * Apresenta o panorama financeiro do utilizador, integrando gráficos,
 * indicadores chave de performance (KPIs) e resumos estruturados das despesas/receitas.
 */
export function Overview() {
    const navigate = useNavigate();
    
    const chartOrcamentoRef = useRef(null);
    const canvasOrcamentoRef = useRef(null);
    const chartFluxoRef = useRef(null);
    const canvasFluxoRef = useRef(null);

    const [resumo, setResumo] = useState({ saldo: 0, disponivel: 0, gasto: 0, receita: 0 });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [idContaAtual, setIdContaAtual] = useState(null);

    const [todasDespesas, setTodasDespesas] = useState([]);
    const [todasReceitas, setTodasReceitas] = useState([]);
    const [catsDespesa, setCatsDespesa] = useState([]);
    const [catsReceita, setCatsReceita] = useState([]);
    const [metas, setMetas] = useState([]);
    const [dadosOrcamento, setDadosOrcamento] = useState({ totalOrcado: 0, gastoOrcado: 0 });
    const [dadosFluxo, setDadosFluxo] = useState({ labels: [], receitas: [], despesas: [] });

    const [tipoDespesa, setTipoDespesa] = useState('todas');
    const [tipoReceita, setTipoReceita] = useState('todas');
    const [catDespesaSelecionada, setCatDespesaSelecionada] = useState('todas');
    const [catReceitaSelecionada, setCatReceitaSelecionada] = useState('todas');

    /**
     * Ciclo de vida: Dispara a carga inicial de dados e regista um listener
     * global para manter o ecrã atualizado quando ocorre uma mudança de contexto de conta.
     */
    useEffect(() => {
        carregarDados();

        const handleContaMudou = () => carregarDados();
        window.addEventListener('contaMudou', handleContaMudou);
        return () => window.removeEventListener('contaMudou', handleContaMudou);
    }, []);

    /**
     * Rotina principal de requisição de dados. Promove paralelismo (Promise.all)
     * nas requisições HTTP para otimizar o tempo de carregamento.
     */
    async function carregarDados() {
        try {
            setLoading(true);
            setErro(null);

            const usuarioLogado = authService.getUsuarioLogado();
            if (!usuarioLogado) throw new Error("Sessão expirada ou utilizador não autenticado.");

            const contasDoUsuario = await contaService.getContasPorUsuario(usuarioLogado.id);
            const listaContas = contasDoUsuario.data || contasDoUsuario;

            const contaAtiva = contaService.getContaAtivaLocal(listaContas);
            if (!contaAtiva) {
                setLoading(false);
                return;
            }

            setIdContaAtual(contaAtiva.id);
            const { primeiroDia, ultimoDia } = obterDatasMesAtual();

            const [
                somaDespesas, somaReceitas, despesas, receitas, 
                listaCatsDespesa, listaCatsReceita, resMetas, resOrcamentos
            ] = await Promise.all([
                despesaService.getSoma(contaAtiva.id, primeiroDia, ultimoDia),
                receitaService.getSoma(contaAtiva.id, primeiroDia, ultimoDia),
                despesaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                receitaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                categoriaService.listarCategoriasDespesa(contaAtiva.id), 
                categoriaService.listarCategoriasReceita(contaAtiva.id),
                metaService.listarPorConta(contaAtiva.id),
                orcamentoService.listarPorConta(contaAtiva.id)
            ]);

            const despesasReais = despesas.data ?? despesas ?? [];
            const receitasReais = receitas.data ?? receitas ?? [];

            setResumo({
                saldo: contaAtiva.saldo || 0,
                gasto: somaDespesas.data ?? somaDespesas ?? 0,
                receita: somaReceitas.data ?? somaReceitas ?? 0,
                disponivel: contaAtiva.saldo || 0 
            });

            setTodasDespesas(despesasReais);
            setTodasReceitas(receitasReais);
            setCatsDespesa(listaCatsDespesa.data ?? listaCatsDespesa ?? []);
            setCatsReceita(listaCatsReceita.data ?? listaCatsReceita ?? []);

            const listaMetas = resMetas.data ?? resMetas ?? [];
            const metasProcessadas = await Promise.all(listaMetas.map(async (m) => {
                const resSoma = await fetch(`http://localhost:8080/deposito/soma/${m.id}`);
                const soma = parseFloat(await resSoma.text()) || 0;
                return { ...m, soma, porcentagem: m.valor > 0 ? (soma / m.valor) * 100 : 0 };
            }));
            setMetas(metasProcessadas.sort((a, b) => b.porcentagem - a.porcentagem));

            const listaOrc = resOrcamentos.data ?? resOrcamentos ?? [];
            let totalOrcado = 0, gastoOrcado = 0;
            listaOrc.forEach(orc => {
                totalOrcado += orc.valor;
                gastoOrcado += despesasReais.filter(d => d.categoriaDespesaDTO?.id === orc.categoriaDespesaDTO?.id).reduce((acc, d) => acc + d.valor, 0);
            });
            setDadosOrcamento({ totalOrcado, gastoOrcado });

            const [anoStr, mesStr] = primeiroDia.split('-');
            const diasNoMes = new Date(parseInt(anoStr), parseInt(mesStr), 0).getDate();
            const labelsDias = Array.from({ length: diasNoMes }, (_, i) => i + 1);
            const receitasPorDia = new Array(diasNoMes).fill(0);
            const despesasPorDia = new Array(diasNoMes).fill(0);

            receitasReais.forEach(r => { receitasPorDia[new Date(r.data + 'T12:00:00').getDate() - 1] += r.valor; });
            despesasReais.forEach(d => { despesasPorDia[new Date(d.data + 'T12:00:00').getDate() - 1] += d.valor; });

            setDadosFluxo({ labels: labelsDias, receitas: receitasPorDia, despesas: despesasPorDia });

        } catch (error) {
            console.error("Erro na sincronização de dados:", error);
            setErro(error.message || "Não foi possível carregar os dados financeiros.");
        } finally {
            setLoading(false);
        }
    }

    /**
     * Efeito secundário que gere as instâncias do Chart.js.
     * Prevê a destruição de canvas prévios antes de instanciar novos para prevenir leaks de memória.
     */
    useEffect(() => {
        if (loading) return;

        if (canvasOrcamentoRef.current && dadosOrcamento.totalOrcado > 0) {
            if (chartOrcamentoRef.current) chartOrcamentoRef.current.destroy();
            const ctxOrc = canvasOrcamentoRef.current.getContext('2d');
            chartOrcamentoRef.current = new Chart(ctxOrc, {
                type: 'doughnut',
                data: {
                    labels: ['Gasto', 'Disponível'],
                    datasets: [{
                        data: [dadosOrcamento.gastoOrcado, Math.max(0, dadosOrcamento.totalOrcado - dadosOrcamento.gastoOrcado)],
                        backgroundColor: ['#8060F6', '#EFEFEF'], borderWidth: 0
                    }]
                },
                options: { cutout: '82%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, maintainAspectRatio: false }
            });
        }

        if (canvasFluxoRef.current && dadosFluxo.labels.length > 0) {
            if (chartFluxoRef.current) chartFluxoRef.current.destroy();
            const ctxFluxo = canvasFluxoRef.current.getContext('2d');
            chartFluxoRef.current = new Chart(ctxFluxo, {
                type: 'line',
                data: {
                    labels: dadosFluxo.labels,
                    datasets: [
                        { label: '  Receitas', data: dadosFluxo.receitas, borderColor: '#8060F6', backgroundColor: 'rgba(128, 96, 246, 0.08)', borderWidth: 3.5, tension: 0.4, fill: true, pointRadius: 0, pointHoverRadius: 4 },
                        { label: '  Despesas', data: dadosFluxo.despesas, borderColor: '#1B1239', backgroundColor: 'rgba(27, 18, 57, 0.04)', borderWidth: 3.5, tension: 0.4, fill: true, pointRadius: 0, pointHoverRadius: 4 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
                    plugins: { legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11, family: "'Poppins', sans-serif" }, color: '#888' } }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { size: 11 }, bodyFont: { size: 11 } } },
                    scales: { y: { beginAtZero: true, border: { display: false }, grid: { color: '#f9f9f9', drawTicks: false }, ticks: { maxTicksLimit: 4, padding: 5, color: '#ccc', font: { size: 10 } } }, x: { grid: { display: false, drawBorder: false }, ticks: { maxTicksLimit: 6, color: '#ccc', font: { size: 10 } } } }
                }
            });
        }
        return () => {
            if (chartOrcamentoRef.current) chartOrcamentoRef.current.destroy();
            if (chartFluxoRef.current) chartFluxoRef.current.destroy();
        };
    }, [loading, dadosOrcamento, dadosFluxo]);

    /** Funções utilitárias para processamento local de arrays e máscaras. */
    const getDespesasFiltradas = () => todasDespesas.filter(d => (tipoDespesa === 'todas' || d.tipo?.toLowerCase() === tipoDespesa.toLowerCase()) && (catDespesaSelecionada === 'todas' || d.categoriaDespesaDTO?.id.toString() === catDespesaSelecionada));
    const getReceitasFiltradas = () => todasReceitas.filter(r => (tipoReceita === 'todas' || r.tipo?.toLowerCase() === tipoReceita.toLowerCase()) && (catReceitaSelecionada === 'todas' || r.categoriaReceitaDTO?.id.toString() === catReceitaSelecionada));
    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    const getCorTipo = (tipo) => { const t = tipo?.toLowerCase(); return t === 'fixa' ? 'cor2' : t === 'parcelada' ? 'cor3' : 'cor1'; };

    if (erro) return (<div className="vg"><h3 style={{ color: '#d9534f' }}>Aviso de Sistema</h3><p>{erro}</p><button onClick={() => window.location.reload()}>Atualizar Página</button></div>);

    return (
        <div className="vg">
            <div className="info-box">
                <div className="box saldo-total"><p className="lbl">Saldo total</p><div className="espaco"></div><p className="valor">{loading ? '...' : formatarMoeda(resumo.saldo)}</p></div>
                <div className="box vlr-disp"><p className="lbl">Valor disponível</p><div className="espaco"></div><p className="valor">{loading ? '...' : formatarMoeda(resumo.disponivel)}</p></div>
                <div className="box total-gasto"><p className="lbl">Total gasto</p><div className="espaco"></div><p className="valor">{loading ? '...' : formatarMoeda(resumo.gasto)}</p></div>
                <div className="box alguma-info"><p className="lbl">Receita total</p><div className="espaco"></div><p className="valor">{loading ? '...' : formatarMoeda(resumo.receita)}</p></div>
            </div>

            <div className="vg-tela">
                <div className="box grid-grafico" style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className="link" onClick={() => navigate('/reports')}>Relatórios</p>
                    <div className="container-grafico" style={{ flexGrow: 1, position: 'relative', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? <p style={{ margin: 0, color: '#ccc' }}>A carregar...</p> : <div style={{ position: 'relative', width: '100%', height: '100%', paddingTop: '10px' }}><canvas ref={canvasFluxoRef} style={{ width: '100%', height: '100%' }}></canvas></div>}
                    </div>
                </div>

                <div className="box grid-orcamento" style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className="link" onClick={() => navigate('/budgets')}>Orçamentos</p>
                    <div className="container-grafico" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? <p style={{ margin: 0, textAlign: 'center', color: '#ccc', alignSelf: 'center' }}>A carregar...</p> : dadosOrcamento.totalOrcado === 0 ? <p style={{ margin: 0, textAlign: 'center', color: '#ccc', alignSelf: 'center' }}>Nenhum orçamento definido</p> : (
                            <div className="grafico-orcamentos" style={{ position: 'relative', width: '100%', height: '210px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <canvas ref={canvasOrcamentoRef} style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}></canvas>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, pointerEvents: 'none', width: '80%' }}>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gasto</p>
                                    <p style={{ margin: '4px 0', fontSize: '17px', fontWeight: '800', color: 'var(--cor4)' }}>{formatarMoeda(dadosOrcamento.gastoOrcado)}</p>
                                    <p style={{ margin: 0, fontSize: '10px', color: '#bbb' }}>de {formatarMoeda(dadosOrcamento.totalOrcado)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="box grid-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className="link" onClick={() => navigate('/goals')}>Metas</p>
                    <div className="lista-orc" style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '5px' }}>
                        {loading ? <p style={{ margin: 0, textAlign: 'center', color: '#ccc' }}>A carregar...</p> : metas.length === 0 ? <p style={{ margin: 0, textAlign: 'center', color: '#ccc' }}>Nenhuma meta criada</p> : metas.slice(0, 4).map(meta => (
                                <div className="linha-orc" key={meta.id}>
                                    <p style={{ fontWeight: 600, color: 'var(--cor4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{meta.objetivo}</p>
                                    <div className="espaco"></div>
                                    <div className="barra-container"><div className="barra-progresso" style={{ width: `${Math.min(meta.porcentagem, 100)}%` }}></div></div>
                                </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/goals')} style={{ marginTop: 'auto' }}>Ver Detalhes</button>
                </div>

                <div className="box grid-despesa">
                    <div className="linha1"><p className="link" onClick={() => navigate('/fluxo-caixa')}>Despesas</p><div className="espaco"></div><select value={catDespesaSelecionada} onChange={(e) => setCatDespesaSelecionada(e.target.value)} disabled={loading}><option value="todas">Todas as categorias</option>{catsDespesa.map(cat => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}</select></div>
                    <div className="linha2">
                        <input type="radio" id="btn-todos" checked={tipoDespesa === 'todas'} onChange={() => setTipoDespesa('todas')} disabled={loading} /><label htmlFor="btn-todos">Todas</label>
                        <input type="radio" id="btn-fixos" checked={tipoDespesa === 'fixa'} onChange={() => setTipoDespesa('fixa')} disabled={loading} /><label htmlFor="btn-fixos">Fixas</label>
                        <input type="radio" id="btn-parceladas" checked={tipoDespesa === 'parcelada'} onChange={() => setTipoDespesa('parcelada')} disabled={loading} /><label htmlFor="btn-parceladas">Parceladas</label>
                        <input type="radio" id="btn-pontuais" checked={tipoDespesa === 'pontual'} onChange={() => setTipoDespesa('pontual')} disabled={loading} /><label htmlFor="btn-pontuais">Pontuais</label>
                    </div>
                    <div className="tabela">
                        {loading ? <p style={{ margin: 0, textAlign: 'center', padding: '1rem' }}>A carregar despesas...</p> : getDespesasFiltradas().length === 0 ? <p style={{ margin: 0, textAlign: 'center', color: '#999', padding: '1rem' }}>Nenhuma despesa encontrada.</p> : getDespesasFiltradas().map(despesa => (
                            <div className="linha" key={despesa.id}><div className={`cor ${getCorTipo(despesa.tipo)}`}></div><p className="titulo">{despesa.descricao}</p><p className="valor">{formatarMoeda(despesa.valor)}</p><p className="categoria">{despesa.categoriaDespesaDTO?.nome || 'Outros'}</p></div>
                        ))}
                    </div>
                </div>

                <div className="box grid-receita">
                    <div className="linha1"><p className="link" onClick={() => navigate('/fluxo-caixa')}>Receitas</p><div className="espaco"></div><select value={catReceitaSelecionada} onChange={(e) => setCatReceitaSelecionada(e.target.value)} disabled={loading}><option value="todas">Todas as categorias</option>{catsReceita.map(cat => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}</select></div>
                    <div className="linha2">
                        <input type="radio" id="btn-todos-rec" checked={tipoReceita === 'todas'} onChange={() => setTipoReceita('todas')} disabled={loading} /><label htmlFor="btn-todos-rec">Todas</label>
                        <input type="radio" id="btn-fixos-rec" checked={tipoReceita === 'fixa'} onChange={() => setTipoReceita('fixa')} disabled={loading} /><label htmlFor="btn-fixos-rec">Fixas</label>
                        <input type="radio" id="btn-parceladas-rec" checked={tipoReceita === 'parcelada'} onChange={() => setTipoReceita('parcelada')} disabled={loading} /><label htmlFor="btn-parceladas-rec">Parceladas</label>
                        <input type="radio" id="btn-pontuais-rec" checked={tipoReceita === 'pontual'} onChange={() => setTipoReceita('pontual')} disabled={loading} /><label htmlFor="btn-pontuais-rec">Pontuais</label>
                    </div>
                    <div className="tabela">
                        {loading ? <p style={{ margin: 0, textAlign: 'center', padding: '1rem' }}>A carregar receitas...</p> : getReceitasFiltradas().length === 0 ? <p style={{ margin: 0, textAlign: 'center', color: '#999', padding: '1rem' }}>Nenhuma receita encontrada.</p> : getReceitasFiltradas().map(receita => (
                            <div className="linha" key={receita.id}><div className={`cor ${getCorTipo(receita.tipo)}`}></div><p className="titulo">{receita.descricao}</p><p className="valor">{formatarMoeda(receita.valor)}</p><p className="categoria">{receita.categoriaReceitaDTO?.nome || 'Outros'}</p></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
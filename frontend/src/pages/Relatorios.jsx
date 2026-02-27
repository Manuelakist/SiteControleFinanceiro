import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { authService } from '../services/auth.service';
import { contaService } from '../services/conta.service';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';
import { orcamentoService } from '../services/orcamento.service'; 
import '../assets/css/reports.css';

Chart.register(...registerables);

/**
 * Componente de Inteligência Financeira e Relatórios.
 * Consolida dados comparativos, métricas de poupança, distribuição de categorias
 * e monitorização de limites orçamentais através de visualizações gráficas.
 */
export function Relatorios() {
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState({
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear()
    });

    const [dados, setDados] = useState({
        totalReceitas: 0,
        totalDespesas: 0,
        taxaPoupanca: 0,
        valorPoupado: 0,
        evolucaoDespesas: 0, 
        receitasPorDia: [],
        despesasPorDia: [],
        labelsDias: [],
        labelsCatDespesas: [],
        dadosCatDespesas: [],
        resumoCategoria: '',
        resumoReceita: '',
        resumoFluxo: '',
        labelsCatReceitas: [],
        dadosCatReceitas: [],
        maioresDespesas: [],
        alertasOrcamento: []
    });

    const chartLinhaRef = useRef(null);
    const canvasLinhaRef = useRef(null);
    const chartPizzaDespesaRef = useRef(null);
    const canvasPizzaDespesaRef = useRef(null);
    const chartPizzaReceitaRef = useRef(null);
    const canvasPizzaReceitaRef = useRef(null);

    const formatarMoeda = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    useEffect(() => {
        carregarDadosRelatorio();
    }, [periodo]);

    /**
     * Consolida dados do mês atual e anterior para gerar métricas de evolução e gráficos.
     */
    async function carregarDadosRelatorio() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            if (!usuario) return;

            const contas = await contaService.getContasPorUsuario(usuario.id);
            const listaContas = contas.data || contas;
            const contaAtiva = contaService.getContaAtivaLocal(listaContas);

            if (contaAtiva) {
                const ano = parseInt(periodo.ano);
                const mes = parseInt(periodo.mes);
                const primeiroDiaStr = `${ano}-${String(mes).padStart(2, '0')}-01`;
                const ultimoDiaNum = new Date(ano, mes, 0).getDate();
                const ultimoDiaStr = `${ano}-${String(mes).padStart(2, '0')}-${String(ultimoDiaNum).padStart(2, '0')}`;

                let mesAnterior = mes - 1;
                let anoAnterior = ano;
                if (mesAnterior === 0) { mesAnterior = 12; anoAnterior -= 1; }
                const primeiroDiaAntStr = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-01`;
                const ultimoDiaAntStr = `${anoAnterior}-${String(mesAnterior).padStart(2, '0')}-${new Date(anoAnterior, mesAnterior, 0).getDate()}`;

                const [resDespesas, resReceitas, resDespesasAnt, resOrcamentos] = await Promise.all([
                    despesaService.listarPorConta(contaAtiva.id, primeiroDiaStr, ultimoDiaStr),
                    receitaService.listarPorConta(contaAtiva.id, primeiroDiaStr, ultimoDiaStr),
                    despesaService.listarPorConta(contaAtiva.id, primeiroDiaAntStr, ultimoDiaAntStr),
                    orcamentoService.listarPorConta(contaAtiva.id)
                ]);

                const despesas = resDespesas.data ?? resDespesas ?? [];
                const receitas = resReceitas.data ?? resReceitas ?? [];
                const despesasAnt = resDespesasAnt.data ?? resDespesasAnt ?? [];
                const orcamentos = resOrcamentos.data ?? resOrcamentos ?? [];

                let totalDespesas = 0;
                let totalReceitas = 0;
                let totalDespesasAnt = 0;

                const labelsDias = Array.from({ length: ultimoDiaNum }, (_, i) => i + 1);
                const receitasPorDia = new Array(ultimoDiaNum).fill(0);
                const despesasPorDia = new Array(ultimoDiaNum).fill(0);

                receitas.forEach(r => {
                    receitasPorDia[new Date(r.data + 'T12:00:00').getDate() - 1] += r.valor;
                    totalReceitas += r.valor;
                });

                despesas.forEach(d => {
                    despesasPorDia[new Date(d.data + 'T12:00:00').getDate() - 1] += d.valor;
                    totalDespesas += d.valor;
                });

                despesasAnt.forEach(d => { totalDespesasAnt += d.valor; });

                const valorPoupado = totalReceitas - totalDespesas;

                // Processamento de Categorias de Despesa
                const gastosPorCategoria = {};
                despesas.forEach(d => {
                    const nomeCat = d.categoriaDespesaDTO ? d.categoriaDespesaDTO.nome : 'Outros';
                    gastosPorCategoria[nomeCat] = (gastosPorCategoria[nomeCat] || 0) + d.valor;
                });
                const catDespOrdenadas = Object.entries(gastosPorCategoria).sort((a, b) => b[1] - a[1]);

                let resumoCategoria = "Ainda não existem gastos para analisar.";
                if (catDespOrdenadas.length > 0) {
                    const perc = ((catDespOrdenadas[0][1] / totalDespesas) * 100).toFixed(1);
                    resumoCategoria = `A maior parte dos gastos foi com ${catDespOrdenadas[0][0]}, representando ${perc}% do total.`;
                }

                // Processamento de Categorias de Receita
                const recPorCategoria = {};
                receitas.forEach(r => {
                    const nomeCat = r.categoriaReceitaDTO ? r.categoriaReceitaDTO.nome : 'Outros';
                    recPorCategoria[nomeCat] = (recPorCategoria[nomeCat] || 0) + r.valor;
                });
                const catRecOrdenadas = Object.entries(recPorCategoria).sort((a, b) => b[1] - a[1]);

                let resumoReceita = "Nenhuma receita registada neste período.";
                if (catRecOrdenadas.length > 0) {
                    resumoReceita = `A sua principal fonte de rendimento foi ${catRecOrdenadas[0][0]}.`;
                }

                // Alertas de Orçamento
                const alertasOrcamento = [];
                orcamentos.forEach(orc => {
                    const gastoCat = despesas.filter(d => d.categoriaDespesaDTO?.id === orc.categoriaDespesaDTO?.id).reduce((acc, d) => acc + d.valor, 0);
                    if (gastoCat > orc.valor) {
                        alertasOrcamento.push({
                            categoria: orc.categoriaDespesaDTO?.nome || 'Geral',
                            limite: orc.valor,
                            gasto: gastoCat,
                            excedente: gastoCat - orc.valor
                        });
                    }
                });

                setDados({
                    totalReceitas, totalDespesas, valorPoupado,
                    taxaPoupanca: totalReceitas > 0 ? (valorPoupado / totalReceitas) * 100 : 0,
                    evolucaoDespesas: totalDespesasAnt > 0 ? ((totalDespesas - totalDespesasAnt) / totalDespesasAnt) * 100 : 0,
                    receitasPorDia, despesasPorDia, labelsDias,
                    labelsCatDespesas: catDespOrdenadas.map(c => c[0]),
                    dadosCatDespesas: catDespOrdenadas.map(c => c[1]),
                    resumoCategoria,
                    resumoReceita,
                    resumoFluxo: totalReceitas >= totalDespesas ? "O seu fluxo de entradas superou as saídas." : "As despesas foram superiores às receitas este mês.",
                    labelsCatReceitas: catRecOrdenadas.map(c => c[0]),
                    dadosCatReceitas: catRecOrdenadas.map(c => c[1]),
                    maioresDespesas: [...despesas].sort((a, b) => b.valor - a.valor).slice(0, 5),
                    alertasOrcamento: alertasOrcamento.sort((a, b) => b.excedente - a.excedente)
                });
            }
        } catch (error) {
            console.error("Erro na carga de relatórios:", error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Gere a inicialização e destruição dos gráficos com as legendas em estilo de ponto circular.
     */
    useEffect(() => {
        if (loading) return;
        const cores = ['#1B1239', '#41337A', '#8060F6', '#A594F9', '#C2B6FA', '#E1DCF8', '#F0EEF5', '#D1D1D1'];

        const renderCharts = () => {
            if (chartLinhaRef.current) chartLinhaRef.current.destroy();
            if (canvasLinhaRef.current) {
                chartLinhaRef.current = new Chart(canvasLinhaRef.current.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: dados.labelsDias,
                        datasets: [
                            { label: '  Receitas', data: dados.receitasPorDia, borderColor: '#8060F6', backgroundColor: 'rgba(128, 96, 246, 0.08)', borderWidth: 3.5, tension: 0.4, fill: true, pointRadius: 0, pointHoverRadius: 6 },
                            { label: '  Despesas', data: dados.despesasPorDia, borderColor: '#1B1239', backgroundColor: 'rgba(27, 18, 57, 0.04)', borderWidth: 3.5, tension: 0.4, fill: true, pointRadius: 0, pointHoverRadius: 6 }
                        ]
                    },
                    options: { 
                        responsive: true, maintainAspectRatio: false, 
                        interaction: { mode: 'index', intersect: false },
                        plugins: { legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 8, padding: 20, font: { size: 12, family: "'Poppins', sans-serif" }, color: '#666' } } },
                        scales: { 
                            y: { beginAtZero: true, border: { display: false }, grid: { color: '#f5f5f5', drawTicks: false }, ticks: { maxTicksLimit: 5, padding: 10, color: '#aaa', font: { family: "'Poppins', sans-serif", size: 11 } } },
                            x: { grid: { display: false, drawBorder: false }, ticks: { maxTicksLimit: 10, color: '#aaa', font: { family: "'Poppins', sans-serif", size: 11 } } }
                        }
                    }
                });
            }

            if (chartPizzaDespesaRef.current) chartPizzaDespesaRef.current.destroy();
            if (canvasPizzaDespesaRef.current && dados.dadosCatDespesas.length > 0) {
                chartPizzaDespesaRef.current = new Chart(canvasPizzaDespesaRef.current.getContext('2d'), {
                    type: 'doughnut',
                    data: { labels: dados.labelsCatDespesas, datasets: [{ data: dados.dadosCatDespesas, backgroundColor: cores, borderWidth: 1, borderColor: '#fff' }] },
                    options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11, family: "'Poppins', sans-serif" }, color: '#666' } } } }
                });
            }

            if (chartPizzaReceitaRef.current) chartPizzaReceitaRef.current.destroy();
            if (canvasPizzaReceitaRef.current && dados.dadosCatReceitas.length > 0) {
                chartPizzaReceitaRef.current = new Chart(canvasPizzaReceitaRef.current.getContext('2d'), {
                    type: 'doughnut',
                    data: { labels: dados.labelsCatReceitas, datasets: [{ data: dados.dadosCatReceitas, backgroundColor: cores, borderWidth: 1, borderColor: '#fff' }] },
                    options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11, family: "'Poppins', sans-serif" }, color: '#666' } } } }
                });
            }
        };

        const timer = setTimeout(renderCharts, 100);
        return () => {
            clearTimeout(timer);
            if (chartLinhaRef.current) chartLinhaRef.current.destroy();
            if (chartPizzaDespesaRef.current) chartPizzaDespesaRef.current.destroy();
            if (chartPizzaReceitaRef.current) chartPizzaReceitaRef.current.destroy();
        };
    }, [dados, loading]);

    return (
        <div className="reports-container" id="pagina-relatorios">
            <div className="cabecalho-reports">
                <p className="titulo">Relatórios e Análises</p>
                <div className="filtros-periodo">
                    <select value={periodo.mes} onChange={(e) => setPeriodo({...periodo, mes: e.target.value})}>
                        {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"].map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                    </select>
                    <div className="divisor-filtro"></div>
                    <input type="number" value={periodo.ano} onChange={(e) => setPeriodo({...periodo, ano: e.target.value})} />
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <p className="kpi-lbl">Entradas</p>
                    <p className="kpi-valor" style={{ color: 'var(--cor1)' }}>{formatarMoeda(dados.totalReceitas)}</p>
                </div>
                <div className="kpi-card">
                    <p className="kpi-lbl">Saídas</p>
                    <p className="kpi-valor">{formatarMoeda(dados.totalDespesas)}</p>
                    {dados.evolucaoDespesas !== 0 && !loading && (
                        <p className={`kpi-trend ${dados.evolucaoDespesas > 0 ? 'bad' : 'good'}`}>
                            {dados.evolucaoDespesas > 0 ? '↑' : '↓'} {Math.abs(dados.evolucaoDespesas).toFixed(1)}% vs anterior
                        </p>
                    )}
                </div>
                <div className="kpi-card">
                    <p className="kpi-lbl">Taxa de Poupança</p>
                    <p className="kpi-valor">{dados.taxaPoupanca.toFixed(1)}%</p>
                    <p className="kpi-desc">Você guardou {formatarMoeda(Math.max(0, dados.valorPoupado))}</p>
                </div>
            </div>

            <div className="grid-reports">
                <div className="card-report grande">
                    <div className="head-report">
                        <p className="subtitulo">Fluxo de Caixa Mensal</p>
                        <p className="texto-resumo">{!loading && dados.resumoFluxo}</p>
                    </div>
                    <div className="canvas-container linha-container">
                        <canvas ref={canvasLinhaRef}></canvas>
                    </div>
                </div>

                <div className="card-report">
                    <div className="head-report">
                        <p className="subtitulo">Gastos por Categoria</p>
                        <p className="texto-resumo">{!loading && dados.resumoCategoria}</p>
                    </div>
                    <div className="canvas-container pizza">
                        {!loading && dados.dadosCatDespesas.length === 0 ? <p>Sem dados.</p> : <canvas ref={canvasPizzaDespesaRef}></canvas>}
                    </div>
                </div>

                <div className="card-report">
                    <div className="head-report">
                        <p className="subtitulo">Fontes de Receita</p>
                        <p className="texto-resumo">{!loading && dados.resumoReceita}</p>
                    </div>
                    <div className="canvas-container pizza">
                        {!loading && dados.dadosCatReceitas.length === 0 ? <p>Sem dados.</p> : <canvas ref={canvasPizzaReceitaRef}></canvas>}
                    </div>
                </div>

                <div className="card-report">
                    <div className="head-report">
                        <p className="subtitulo">Maiores Despesas</p>
                        <p className="texto-resumo">Top 5 saídas de maior valor do mês.</p>
                    </div>
                    <div className="lista-rank">
                        {!loading && dados.maioresDespesas.map((d, i) => (
                            <div className="linha-rank" key={i}>
                                <div className="info-despesa">
                                    <p className="nome-despesa">{d.descricao}</p>
                                    <p className="data-despesa">{new Date(d.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                                </div>
                                <p className="valor-despesa">{formatarMoeda(d.valor)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-report alertas-card">
                    <div className="head-report">
                        <p className="subtitulo" style={{color: '#1B1239'}}>Alertas de Orçamento</p>
                        <p className="texto-resumo">Monitorização de categorias que excederam o limite.</p>
                    </div>
                    <div className="lista-rank">
                        {!loading && dados.alertasOrcamento.length === 0 ? (
                            <div className="status-msg success">
                                <i className="material-symbols-outlined" style={{fontSize: '40px', color: '#74c69d'}}>check_circle</i>
                                <p>Saúde financeira excelente! Tudo dentro do limite.</p>
                            </div>
                        ) : (
                            dados.alertasOrcamento.map((a, i) => (
                                <div className="linha-rank" key={i} style={{ borderLeft: '4px solid #f68274', paddingLeft: '12px' }}>
                                    <div className="info-despesa">
                                        <p className="nome-despesa">{a.categoria}</p>
                                        <p className="data-despesa">Limite: {formatarMoeda(a.limite)}</p>
                                    </div>
                                    <p className="valor-despesa" style={{color: '#f68274'}}>+{formatarMoeda(a.excedente)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
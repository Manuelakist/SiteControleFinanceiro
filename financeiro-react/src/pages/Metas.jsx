import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Chart, registerables } from 'chart.js';
import { metaService } from '../services/meta.service';
import { authService } from '../services/auth.service';
import { contaService } from '../services/conta.service';
import { ModalMeta } from '../components/modals/ModalMeta';
import '../assets/css/goals.css';

Chart.register(...registerables);

/**
 * Componente de Gestão de Metas Financeiras.
 * Permite a visualização, criação, edição e monitorização de objetivos de poupança,
 * incluindo histórico de depósitos e projeção de aportes mensais.
 */
export function Metas() {
    const [loading, setLoading] = useState(true);
    const [metas, setMetas] = useState([]);
    const [metaAtiva, setMetaAtiva] = useState(null);
    const [depositos, setDepositos] = useState([]);
    
    const [showModalDetalhes, setShowModalDetalhes] = useState(false);
    const [showModalAddDep, setShowModalAddDep] = useState(false);
    const [showModalFormMeta, setShowModalFormMeta] = useState(false);
    const [metaEmEdicao, setMetaEmEdicao] = useState(null);

    const [tipoDep, setTipoDep] = useState('positivo');
    const [valorDep, setValorDep] = useState('');

    const chartRef = useRef(null);
    const canvasRef = useRef(null);

    /**
     * Efeito inicial para carregar dados e registar listeners de atualização global.
     */
    useEffect(() => {
        carregarMetas();

        const handleUpdate = () => carregarMetas();
        window.addEventListener('atualizarMetas', handleUpdate);
        window.addEventListener('contaMudou', handleUpdate);
        return () => {
            window.removeEventListener('atualizarMetas', handleUpdate);
            window.removeEventListener('contaMudou', handleUpdate);
        };
    }, []);

    /**
     * Monitoriza a abertura do modal de detalhes para instanciar o gráfico de progresso.
     */
    useEffect(() => {
        if (showModalDetalhes && metaAtiva) {
            const timer = setTimeout(() => {
                if (canvasRef.current) renderizarGrafico();
            }, 80);
            return () => clearTimeout(timer);
        }
    }, [showModalDetalhes, metaAtiva]);

    /**
     * Sincroniza a listagem de metas com o backend, calculando o somatório acumulado.
     */
    async function carregarMetas() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            const resContas = await contaService.getContasPorUsuario(usuario.id);
            const listaContas = resContas.data || resContas;
            
            const contaAtiva = contaService.getContaAtivaLocal(listaContas);
            if (!contaAtiva) {
                setLoading(false);
                return;
            }

            const resMetas = await metaService.listarPorConta(contaAtiva.id);
            const lista = resMetas.data || resMetas || [];

            const processadas = await Promise.all(lista.map(async (m) => {
                const resSoma = await fetch(`http://localhost:8080/deposito/soma/${m.id}`);
                const somaText = await resSoma.text();
                return { ...m, soma: parseFloat(somaText) || 0 };
            }));

            setMetas(processadas);
            
        } catch (e) {
            console.error("Erro na sincronização de metas:", e);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Recupera o histórico de movimentações e ativa a interface de detalhes.
     * @param {Object} meta - A meta selecionada para visualização.
     */
    async function abrirDetalhes(meta) {
        setMetaAtiva(meta);
        try {
            const resDeps = await fetch(`http://localhost:8080/deposito/${meta.id}`);
            const listaDeps = await resDeps.json();
            setDepositos(listaDeps);
            setShowModalDetalhes(true);
        } catch (e) {
            console.error("Erro ao carregar movimentações:", e);
        }
    }

    /**
     * Renderiza o gráfico Doughnut representando a evolução da meta.
     */
    function renderizarGrafico() {
        if (chartRef.current) chartRef.current.destroy();
        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [metaAtiva.soma, Math.max(0, metaAtiva.valor - metaAtiva.soma)],
                    backgroundColor: ['#8060F6', '#EFEFEF'],
                    borderWidth: 0
                }]
            },
            options: { cutout: '82%', plugins: { legend: { display: false } }, maintainAspectRatio: false }
        });
    }

    const formatarMoeda = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    /**
     * Calcula a projeção de investimento mensal necessário para atingir o objetivo no prazo.
     */
    const calcularMensal = () => {
        if (!metaAtiva) return 0;
        const hoje = new Date();
        const fim = new Date(metaAtiva.dataFim + 'T12:00:00'); 
        const meses = (fim.getFullYear() - hoje.getFullYear()) * 12 + (fim.getMonth() - hoje.getMonth());
        const dif = metaAtiva.valor - metaAtiva.soma;
        return meses > 0 ? (dif / meses).toFixed(2) : Math.max(0, dif).toFixed(2);
    };

    /**
     * Regista uma nova movimentação (depósito ou retirada) vinculada à meta.
     */
    async function salvarDeposito(e) {
        e.preventDefault();
        const valorFinal = tipoDep === 'negativo' ? parseFloat(valorDep) * -1 : parseFloat(valorDep);
        
        const hoje = new Date();
        const dataLocal = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');

        await fetch('http://localhost:8080/deposito', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                valor: valorFinal,
                data: dataLocal,
                metaDTO: { id: metaAtiva.id }
            })
        });

        setValorDep('');
        setShowModalAddDep(false);
        await carregarMetas();
        
        const resSoma = await fetch(`http://localhost:8080/deposito/soma/${metaAtiva.id}`);
        const novaSoma = await resSoma.text();
        const resDeps = await fetch(`http://localhost:8080/deposito/${metaAtiva.id}`);
        const listaDeps = await resDeps.json();
        
        setDepositos(listaDeps);
        setMetaAtiva(prev => ({ ...prev, soma: parseFloat(novaSoma) }));
    }

    return (
        <div className="goals-container" id="pagina-metas">
            <div className="cabecalho-metas">
                <p className="titulo">Minhas Metas</p>
            </div>

            <div className="grid-metas">
                <div className="card-meta add-card" onClick={() => { setMetaEmEdicao(null); setShowModalFormMeta(true); }}>
                    <i className="material-symbols-outlined">add</i>
                </div>

                {!loading && metas.map(meta => {
                    const pct = meta.valor > 0 ? (meta.soma / meta.valor) * 100 : 0;
                    return (
                        <div className="card-meta" key={meta.id} onClick={() => abrirDetalhes(meta)}>
                            <p className="nome-meta">{meta.objetivo}</p>
                            <div className="detalhes-valores">
                                <p className="valor-atual">{formatarMoeda(meta.soma)}</p>
                                <p className="valor-alvo">objetivo: {formatarMoeda(meta.valor)}</p>
                            </div>
                            <div className="barra-externa">
                                <div className="barra-interna" style={{ width: `${Math.min(pct, 100)}%` }}></div>
                            </div>
                            <div className="rodape-meta">
                                <p>{Math.round(pct)}% concluído</p>
                                <p>Prazo: {new Date(meta.dataFim + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModalDetalhes && metaAtiva && createPortal(
                <div className="metaBox modal5">
                    <div className="box-conteudo">
                        <span className="close-btn" onClick={() => setShowModalDetalhes(false)}>&times;</span>
                        <div className="colunas">
                            <div className="col1">
                                <div className="linhaTitulo">
                                    <h1>{metaAtiva.objetivo}</h1>
                                    <div className="acoes-modal">
                                        <button className="btn-edit" onClick={() => {
                                            setMetaEmEdicao(metaAtiva);
                                            setShowModalFormMeta(true);
                                            setShowModalDetalhes(false);
                                        }}><i className="material-symbols-outlined">edit_square</i></button>
                                        <button className="btn-delete" onClick={async () => {
                                            if (window.confirm("Deseja realmente excluir esta meta?")) {
                                                await metaService.deletarMeta(metaAtiva.id);
                                                setShowModalDetalhes(false);
                                                carregarMetas();
                                            }
                                        }}><i className="material-symbols-outlined">delete</i></button>
                                    </div>
                                </div>
                                <p style={{color: '#888', margin: '5px 0'}}>Prazo: {new Date(metaAtiva.dataFim + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                                <div className="grafico-meta">
                                    <div className="container-graf">
                                        <canvas ref={canvasRef}></canvas>
                                    </div>
                                </div>
                                <div className="legenda">
                                    <p><b>{formatarMoeda(metaAtiva.soma)}</b></p> / <p>{formatarMoeda(metaAtiva.valor)}</p>
                                </div>
                                <div className="texto-informativo" style={{ textAlign: 'center', marginTop: '15px' }}>
                                    {metaAtiva.soma < metaAtiva.valor ? (
                                        <><p style={{fontWeight: 300, fontSize: '0.9rem', margin: 0}}>aporte mensal sugerido:</p><h3 style={{margin: '5px 0 0 0', color: 'var(--cor1)'}}>R$ {calcularMensal()}</h3></>
                                    ) : (
                                        <p style={{color: '#74c69d', margin: 0}}><b>Parabéns! Meta atingida.</b></p>
                                    )}
                                </div>
                            </div>
                            <div className="col2">
                                <div className="movimentacoes">
                                    <h2 style={{fontSize: '1.1rem', marginBottom: '10px'}}>Histórico</h2>
                                    <div id="listaDepositos">
                                        {depositos.map(d => (
                                            <div className="linha-dep" key={d.id}>
                                                <div style={{color: '#666'}}>{new Date(d.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</div>
                                                <div className={d.valor >= 0 ? 'positivo' : 'negativo'}>
                                                    {d.valor >= 0 ? '+' : '-'} {formatarMoeda(Math.abs(d.valor))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className="btn-deposito-principal" onClick={() => setShowModalAddDep(true)}>adicionar valor</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showModalAddDep && createPortal(
                <div className="adc-deposito">
                    <div className="conteudo-deposito">
                        <span className="close-btn" onClick={() => setShowModalAddDep(false)}>&times;</span>
                        <form onSubmit={salvarDeposito}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                                <input type="radio" id="adcDep" name="radioDep" checked={tipoDep === 'positivo'} onChange={() => setTipoDep('positivo')} />
                                <label htmlFor="adcDep" style={{cursor:'pointer', color: tipoDep === 'positivo' ? '#74c69d' : '#ccc'}}>+</label>
                                <input type="radio" id="retDep" name="radioDep" checked={tipoDep === 'negativo'} onChange={() => setTipoDep('negativo')} />
                                <label htmlFor="retDep" style={{cursor:'pointer', color: tipoDep === 'negativo' ? '#f68274' : '#ccc'}}>-</label>
                                <input type="number" step="0.01" value={valorDep} onChange={(e) => setValorDep(e.target.value)} placeholder="0,00" style={{border:'none', outline:'none', fontSize:'1.2rem', width:'100%'}} required />
                            </div>
                            <button className="btn-salvar-deposito" type="submit">salvar</button>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            <ModalMeta isOpen={showModalFormMeta} onClose={() => setShowModalFormMeta(false)} onSave={carregarMetas} metaParaEditar={metaEmEdicao} />
        </div>
    );
}
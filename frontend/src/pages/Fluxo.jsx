import { useState, useEffect } from 'react';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';
import { categoriaService } from '../services/categoria.service';
import { contaService } from '../services/conta.service';
import { authService } from '../services/auth.service';
import '../assets/css/cashflow.css';

/**
 * Componente de Gestão de Fluxo de Caixa.
 * Interface para monitorização e gestão de entradas e saídas financeiras,
 * permitindo filtragem dinâmica por categoria e tipo de transação.
 */
export function FluxoCaixa() {
    const [loading, setLoading] = useState(true);
    const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
    const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

    const [todasDespesas, setTodasDespesas] = useState([]);
    const [todasReceitas, setTodasReceitas] = useState([]);
    const [catsDespesa, setCatsDespesa] = useState([]);
    const [catsReceita, setCatsReceita] = useState([]);

    const [tipoDespesa, setTipoDespesa] = useState('todas');
    const [tipoReceita, setTipoReceita] = useState('todas');
    const [catDespesaSelecionada, setCatDespesaSelecionada] = useState('todas');
    const [catReceitaSelecionada, setCatReceitaSelecionada] = useState('todas');

    /**
     * Sincroniza os dados da página sempre que o período ou a conta ativa são alterados.
     */
    useEffect(() => {
        carregarDadosFluxo();

        const handleContaMudou = () => carregarDadosFluxo();
        window.addEventListener('contaMudou', handleContaMudou);
        return () => window.removeEventListener('contaMudou', handleContaMudou);
    }, [mesAtual, anoAtual]);

    /**
     * Obtém os registos financeiros e metadados de categorias via API.
     */
    async function carregarDadosFluxo() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            if (!usuario) return;

            const resContas = await contaService.getContasPorUsuario(usuario.id);
            const listaContas = resContas.data || resContas;
            
            const contaAtiva = contaService.getContaAtivaLocal(listaContas);
            if (!contaAtiva) {
                setLoading(false);
                return;
            }

            const primeiroDia = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-01`;
            const ultimoDiaNum = new Date(anoAtual, mesAtual, 0).getDate();
            const ultimoDia = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(ultimoDiaNum).padStart(2, '0')}`;

            const [despesas, receitas, listaCatsDespesa, listaCatsReceita] = await Promise.all([
                despesaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                receitaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                categoriaService.listarCategoriasDespesa(contaAtiva.id),
                categoriaService.listarCategoriasReceita(contaAtiva.id)
            ]);

            setTodasDespesas(despesas.data ?? despesas ?? []);
            setTodasReceitas(receitas.data ?? receitas ?? []);
            setCatsDespesa(listaCatsDespesa.data ?? listaCatsDespesa ?? []);
            setCatsReceita(listaCatsReceita.data ?? listaCatsReceita ?? []);

        } catch (error) {
            console.error("Erro na carga de dados do fluxo:", error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Navegação mensal.
     * @param {number} direcao - Deslocamento em meses.
     */
    const mudarMes = (direcao) => {
        let novoMes = mesAtual + direcao;
        let novoAno = anoAtual;
        if (novoMes > 12) { novoMes = 1; novoAno++; }
        if (novoMes < 1) { novoMes = 12; novoAno--; }
        setMesAtual(novoMes);
        setAnoAtual(novoAno);
    };

    /** Processamento de filtros locais. */
    const getDespesasFiltradas = () => todasDespesas.filter(d => (tipoDespesa === 'todas' || d.tipo?.toLowerCase() === tipoDespesa.toLowerCase()) && (catDespesaSelecionada === 'todas' || d.categoriaDespesaDTO?.id.toString() === catDespesaSelecionada));
    const getReceitasFiltradas = () => todasReceitas.filter(r => (tipoReceita === 'todas' || r.tipo?.toLowerCase() === tipoReceita.toLowerCase()) && (catReceitaSelecionada === 'todas' || r.categoriaReceitaDTO?.id.toString() === catReceitaSelecionada));

    /** Cálculos dinâmicos de somatório baseados nos filtros aplicados. */
    const calcularTotalDespesas = () => getDespesasFiltradas().reduce((acc, d) => acc + (d.valor || 0), 0);
    const calcularTotalReceitas = () => getReceitasFiltradas().reduce((acc, r) => acc + (r.valor || 0), 0);

    /** Utilitários visuais. */
    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    const getCorTipo = (tipo) => { const t = tipo?.toLowerCase(); return t === 'fixa' ? 'cor2' : t === 'parcelada' ? 'cor3' : 'cor1'; };
    const getNomeMes = (m) => ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][m - 1];

    /** Remoção de registos. */
    async function handleExcluirDespesa(id) {
        if(window.confirm('Confirmar exclusão desta despesa?')) {
            await despesaService.deletarDespesa(id);
            carregarDadosFluxo();
        }
    }

    async function handleExcluirReceita(id) {
        if(window.confirm('Confirmar exclusão desta receita?')) {
            await receitaService.deletarReceita(id);
            carregarDadosFluxo();
        }
    }

    return (
        <div className="fc" id="pagina-fluxo-caixa">
            <div className="grid">
                
                {/* --- SEÇÃO SAÍDAS --- */}
                <section className="grid-despesa">
                    <div className="linha1">
                        <p className="titulo">Saídas</p>
                        <div className="mes">
                            <button onClick={() => mudarMes(-1)}><i className="material-symbols-outlined">chevron_left</i></button>
                            <div className="mes-atual">
                                <span id="textoMesDespesa">{getNomeMes(mesAtual)}</span>
                                <span id="textoAnoDespesa">{anoAtual}</span>
                            </div>
                            <button onClick={() => mudarMes(1)}><i className="material-symbols-outlined">chevron_right</i></button>
                        </div>
                        <div className="espaco"></div>
                        {/* AQUI ESTÁ A ATUALIZAÇÃO: Calcula o total dinamicamente com base no filtro */}
                        <p className="valor">{loading ? '...' : formatarMoeda(calcularTotalDespesas())}</p>
                    </div>

                    <div className="linha2">
                        <div className="radio-desp">
                            <input type="radio" id="todasDes" checked={tipoDespesa === 'todas'} onChange={() => setTipoDespesa('todas')} /><label htmlFor="todasDes">Todas</label>
                            <input type="radio" id="fixasDes" checked={tipoDespesa === 'fixa'} onChange={() => setTipoDespesa('fixa')} /><label htmlFor="fixasDes">Fixas</label>
                            <input type="radio" id="parceladasDes" checked={tipoDespesa === 'parcelada'} onChange={() => setTipoDespesa('parcelada')} /><label htmlFor="parceladasDes">Parceladas</label>
                            <input type="radio" id="pontuaisDes" checked={tipoDespesa === 'pontual'} onChange={() => setTipoDespesa('pontual')} /><label htmlFor="pontuaisDes">Pontuais</label>
                        </div>
                        <div className="espaco"></div>
                        <select value={catDespesaSelecionada} onChange={(e) => setCatDespesaSelecionada(e.target.value)} className="seletor">
                            <option value="todas">Todas as categorias</option>
                            {catsDespesa.map(cat => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}
                        </select>
                    </div>

                    <div className="container-tabela">
                        <div className="cabecalho">
                            <p>título</p><p>valor</p><p>data</p><p>categoria</p><div style={{width:'20px'}}></div>
                        </div>
                        <div className="tabela">
                            {loading ? <p style={{textAlign:'center', marginTop:'20px'}}>Sincronizando...</p> : getDespesasFiltradas().length === 0 ? <p style={{textAlign:'center', color:'#888', marginTop:'20px'}}>Nenhum registo encontrado.</p> : getDespesasFiltradas().map(despesa => (
                                <div className="linha" key={despesa.id}>
                                    <div className="flex" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div className={`cor ${getCorTipo(despesa.tipo)}`}></div><p className="titulo">{despesa.descricao}</p>
                                    </div>
                                    <p className="valor">{formatarMoeda(despesa.valor)}</p>
                                    <p className="data">{new Date(despesa.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                                    <p className="categoria">{despesa.categoriaDespesaDTO?.nome || 'Outros'}</p>
                                    <div className="acoes">
                                        <button className="delete" onClick={() => handleExcluirDespesa(despesa.id)}><i className="material-symbols-outlined">delete</i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- SEÇÃO ENTRADAS --- */}
                <section className="grid-receita">
                    <div className="linha1">
                        <p className="titulo">Entradas</p>
                        <div className="mes">
                            <button onClick={() => mudarMes(-1)}><i className="material-symbols-outlined">chevron_left</i></button>
                            <div className="mes-atual">
                                <span id="textoMesReceita">{getNomeMes(mesAtual)}</span>
                                <span id="textoAnoReceita">{anoAtual}</span>
                            </div>
                            <button onClick={() => mudarMes(1)}><i className="material-symbols-outlined">chevron_right</i></button>
                        </div>
                        <div className="espaco"></div>
                        {/* AQUI ESTÁ A ATUALIZAÇÃO: Calcula o total dinamicamente com base no filtro */}
                        <p className="valor">{loading ? '...' : formatarMoeda(calcularTotalReceitas())}</p>
                    </div>

                    <div className="linha2">
                        <div className="radio-rec">
                            <input type="radio" id="todasRec" checked={tipoReceita === 'todas'} onChange={() => setTipoReceita('todas')} /><label htmlFor="todasRec">Todas</label>
                            <input type="radio" id="fixasRec" checked={tipoReceita === 'fixa'} onChange={() => setTipoReceita('fixa')} /><label htmlFor="fixasRec">Fixas</label>
                            <input type="radio" id="parceladasRec" checked={tipoReceita === 'parcelada'} onChange={() => setTipoReceita('parcelada')} /><label htmlFor="parceladasRec">Parceladas</label>
                            <input type="radio" id="pontuaisRec" checked={tipoReceita === 'pontual'} onChange={() => setTipoReceita('pontual')} /><label htmlFor="pontuaisRec">Pontuais</label>
                        </div>
                        <div className="espaco"></div>
                        <select value={catReceitaSelecionada} onChange={(e) => setCatReceitaSelecionada(e.target.value)} className="seletor">
                            <option value="todas">Todas as categorias</option>
                            {catsReceita.map(cat => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}
                        </select>
                    </div>

                    <div className="container-tabela">
                        <div className="cabecalho">
                            <p>título</p><p>valor</p><p>data</p><p>categoria</p><div style={{width:'20px'}}></div>
                        </div>
                        <div className="tabela">
                            {loading ? <p style={{textAlign:'center', marginTop:'20px'}}>Sincronizando...</p> : getReceitasFiltradas().length === 0 ? <p style={{textAlign:'center', color:'#888', marginTop:'20px'}}>Nenhum registo encontrado.</p> : getReceitasFiltradas().map(receita => (
                                <div className="linha" key={receita.id}>
                                    <div className="flex" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div className={`cor ${getCorTipo(receita.tipo)}`}></div><p className="titulo">{receita.descricao}</p>
                                    </div>
                                    <p className="valor">{formatarMoeda(receita.valor)}</p>
                                    <p className="data">{new Date(receita.data + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                                    <p className="categoria">{receita.categoriaReceitaDTO?.nome || 'Outros'}</p>
                                    <div className="acoes">
                                        <button className="delete" onClick={() => handleExcluirReceita(receita.id)}><i className="material-symbols-outlined">delete</i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
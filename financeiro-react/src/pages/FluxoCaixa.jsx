import { useState, useEffect } from 'react';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';
import { contaService } from '../services/conta.service';
import { categoriaService } from '../services/categoria.service';
import { authService } from '../services/auth.service';
import '../assets/css/cashflow.css';

/**
 * Componente de Fluxo de Caixa.
 * Incorpora correções de alinhamento vertical no cabeçalho (linha1) 
 * e redimensionamento dinâmico das colunas para prevenir o corte de texto nas etiquetas de categoria.
 */
export function FluxoCaixa() {
    const [loading, setLoading] = useState(true);
    const [idConta, setIdConta] = useState(null);
    
    const [dataFiltro, setDataFiltro] = useState(new Date());

    const [despesas, setDespesas] = useState([]);
    const [receitas, setReceitas] = useState([]);
    const [categoriasDespesa, setCategoriasDespesa] = useState([]);
    const [categoriasReceita, setCategoriasReceita] = useState([]);

    const [filtroTipoDespesa, setFiltroTipoDespesa] = useState('todas');
    const [filtroCatDespesa, setFiltroCatDespesa] = useState('todas');
    
    const [filtroTipoReceita, setFiltroTipoReceita] = useState('todas');
    const [filtroCatReceita, setFiltroCatReceita] = useState('todas');

    useEffect(() => {
        carregarDados();
    }, [dataFiltro]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            if (!usuario) return;

            const resContas = await contaService.getContasPorUsuario(usuario.id);
            const contas = resContas.data || resContas;
            
            if (contas && contas.length > 0) {
                const contaAtiva = contas[0];
                setIdConta(contaAtiva.id);

                const primeiroDia = new Date(dataFiltro.getFullYear(), dataFiltro.getMonth(), 1).toISOString().split('T')[0];
                const ultimoDia = new Date(dataFiltro.getFullYear(), dataFiltro.getMonth() + 1, 0).toISOString().split('T')[0];

                const [resDesp, resRec, resCatDesp, resCatRec] = await Promise.all([
                    despesaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                    receitaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                    categoriaService.listarCategoriasDespesa(contaAtiva.id),
                    categoriaService.listarCategoriasReceita(contaAtiva.id)
                ]);

                setDespesas(resDesp.data ?? resDesp ?? []);
                setReceitas(resRec.data ?? resRec ?? []);
                
                if (categoriasDespesa.length === 0) setCategoriasDespesa(resCatDesp.data ?? resCatDesp ?? []);
                if (categoriasReceita.length === 0) setCategoriasReceita(resCatRec.data ?? resCatRec ?? []);
            }
        } catch (error) {
            console.error("Erro na sincronização do fluxo de caixa:", error);
        } finally {
            setLoading(false);
        }
    };

    const avancarMes = () => setDataFiltro(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    const voltarMes = () => setDataFiltro(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));

    const despesasFiltradas = despesas.filter(d => {
        const matchTipo = filtroTipoDespesa === 'todas' || (d.tipo && d.tipo.toLowerCase() === filtroTipoDespesa);
        const matchCat = filtroCatDespesa === 'todas' || (d.categoriaDespesaDTO && d.categoriaDespesaDTO.id.toString() === filtroCatDespesa);
        return matchTipo && matchCat;
    });

    const receitasFiltradas = receitas.filter(r => {
        const matchTipo = filtroTipoReceita === 'todas' || (r.tipo && r.tipo.toLowerCase() === filtroTipoReceita);
        const matchCat = filtroCatReceita === 'todas' || (r.categoriaReceitaDTO && r.categoriaReceitaDTO.id.toString() === filtroCatReceita);
        return matchTipo && matchCat;
    });

    const totalDespesas = despesasFiltradas.reduce((acc, curr) => acc + curr.valor, 0);
    const totalReceitas = receitasFiltradas.reduce((acc, curr) => acc + curr.valor, 0);

    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    const getNomeMes = () => dataFiltro.toLocaleString('pt-BR', { month: 'long' });
    const getAno = () => dataFiltro.getFullYear();

    const getCorTipo = (tipo) => {
        if (!tipo) return 'cor1';
        const t = tipo.toLowerCase();
        if (t === 'parcelada') return 'cor2';
        if (t === 'fixa') return 'cor3';
        if (t === 'pontual') return 'cor4';
        return 'cor1';
    };

    return (
        <div className="fc">
            <div className="grid">
                
                {/* --- MÓDULO DE DESPESAS --- */}
                <div className="despesa" id="despesas">
                    {/* Alinhamento vertical forçado para o centro */}
                    <div className="linha1" style={{ alignItems: 'center' }}>
                        <p className="titulo" style={{ margin: 0 }}>Despesas</p>
                        <div className="mes">
                            <button className="alt" onClick={voltarMes} style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="material-symbols-outlined" id="btn-prev">chevron_left</i>
                            </button>
                            <div className="mes-atual" style={{ display: 'flex', alignItems: 'baseline', padding: '5px 15px' }}>
                                <p id="textoMesDespesa" style={{ margin: 0, textTransform: 'lowercase' }}>{getNomeMes()}</p>
                                <p id="textoAnoDespesa" style={{ margin: 0, marginLeft: '5px' }}>{getAno()}</p>
                            </div>
                            <button className="alt" onClick={avancarMes} style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="material-symbols-outlined" id="btn-next">chevron_right</i>
                            </button>
                        </div>
                        <div className="espaco"></div>
                        <p className="valor" id="cashflowValorDespesas" style={{ margin: 0 }}>
                            {loading ? '...' : formatarMoeda(totalDespesas)}
                        </p>
                    </div>
                    
                    <div className="box grid-despesa">
                        <div className="linha2">
                            <div className="radio-desp" id="radioDespesas">
                                <input type="radio" id="todasDes" name="cashflow-des" value="todas" checked={filtroTipoDespesa === 'todas'} onChange={(e) => setFiltroTipoDespesa(e.target.value)} />
                                <label htmlFor="todasDes">Todas</label>
                                
                                <input type="radio" id="fixasDes" name="cashflow-des" value="fixa" checked={filtroTipoDespesa === 'fixa'} onChange={(e) => setFiltroTipoDespesa(e.target.value)} />
                                <label htmlFor="fixasDes">Fixas</label>
                                
                                <input type="radio" id="parceladasDes" name="cashflow-des" value="parcelada" checked={filtroTipoDespesa === 'parcelada'} onChange={(e) => setFiltroTipoDespesa(e.target.value)} />
                                <label htmlFor="parceladasDes">Parceladas</label>
                                
                                <input type="radio" id="pontuaisDes" name="cashflow-des" value="pontual" checked={filtroTipoDespesa === 'pontual'} onChange={(e) => setFiltroTipoDespesa(e.target.value)} />
                                <label htmlFor="pontuaisDes">Pontuais</label>
                            </div>
                            <div className="espaco"></div>
                            <select className="seletor" id="filtroDespesas" value={filtroCatDespesa} onChange={(e) => setFiltroCatDespesa(e.target.value)}>
                                <option value="todas">Todas as categorias</option>
                                {categoriasDespesa.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="container-tabela">
                            {/* Ajuste do grid-template-columns para garantir espaço fluido (1fr) à categoria */}
                            <div className="cabecalho" style={{ gridTemplateColumns: '1.5fr 3fr 2fr 2fr 1fr' }}>
                                <div className="cbc-cor"><p style={{ margin: 0 }}>classe</p></div>
                                <div className="cbc-titulo"><p style={{ margin: 0 }}>descrição</p></div>
                                <div className="cbc-valor"><p style={{ margin: 0 }}>valor</p></div>
                                <div className="cbc-data"><p style={{ margin: 0 }}>data</p></div>
                                <div className="cbc-categoria"><p style={{ margin: 0 }}>categoria</p></div>
                            </div>
                            <div className="tabela" id="tabelaDespesa" style={{ justifyContent: 'flex-start' }}>
                                {loading && <p style={{textAlign:'center', marginTop: '20px'}}>A carregar...</p>}
                                {!loading && despesasFiltradas.length === 0 && <p style={{textAlign:'center', color:'#999', marginTop: '20px'}}>Nenhuma despesa encontrada.</p>}
                                {!loading && despesasFiltradas.map(despesa => (
                                    <div className="linha" key={despesa.id} style={{ gridTemplateColumns: '1.5fr 3fr 2fr 2fr 1fr auto' }}>
                                        <div className={`cor ${getCorTipo(despesa.tipo)}`}></div>
                                        <p className="titulo" style={{ margin: 0 }}>{despesa.descricao}</p>
                                        <p className="valor" style={{ margin: 0 }}>{formatarMoeda(despesa.valor)}</p>
                                        <p className="data" style={{ margin: 0 }}>{new Date(despesa.data).toLocaleDateString('pt-BR')}</p>
                                        <p className="categoria" style={{ margin: 0, width: 'fit-content', padding: '5px 10px', whiteSpace: 'nowrap' }}>
                                            {despesa.categoriaDespesaDTO?.nome || 'Geral'}
                                        </p>
                                        <div className="acoes">
                                            <button className="alt"><i className="material-symbols-outlined">edit</i></button>
                                            <button className="delete"><i className="material-symbols-outlined">delete</i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MÓDULO DE RECEITAS --- */}
                <div className="receita" id="receitas">
                    <div className="linha1" style={{ alignItems: 'center' }}>
                        <p className="titulo" style={{ margin: 0 }}>Receitas</p>
                        <div className="mes">
                            <button className="alt" onClick={voltarMes} style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="material-symbols-outlined" id="btn-prev-rec">chevron_left</i>
                            </button>
                            <div className="mes-atual" style={{ display: 'flex', alignItems: 'baseline', padding: '5px 15px' }}>
                                <p id="textoMesReceita" style={{ margin: 0, textTransform: 'lowercase' }}>{getNomeMes()}</p>
                                <p id="textoAnoReceita" style={{ margin: 0, marginLeft: '5px' }}>{getAno()}</p>
                            </div>
                            <button className="alt" onClick={avancarMes} style={{ display: 'flex', alignItems: 'center' }}>
                                <i className="material-symbols-outlined" id="btn-next-rec">chevron_right</i>
                            </button>
                        </div>
                        <div className="espaco"></div>
                        <p className="valor" id="cashflowValorReceitas" style={{ margin: 0 }}>
                            {loading ? '...' : formatarMoeda(totalReceitas)}
                        </p>
                    </div>
                    
                    <div className="box grid-receita">
                        <div className="linha2">
                            <div className="radio-rec" id="radioReceitas">
                                <input type="radio" id="todasRec" name="cashflow-rec" value="todas" checked={filtroTipoReceita === 'todas'} onChange={(e) => setFiltroTipoReceita(e.target.value)} />
                                <label htmlFor="todasRec">Todas</label>
                                
                                <input type="radio" id="fixasRec" name="cashflow-rec" value="fixa" checked={filtroTipoReceita === 'fixa'} onChange={(e) => setFiltroTipoReceita(e.target.value)} />
                                <label htmlFor="fixasRec">Fixas</label>
                                
                                <input type="radio" id="parceladasRec" name="cashflow-rec" value="parcelada" checked={filtroTipoReceita === 'parcelada'} onChange={(e) => setFiltroTipoReceita(e.target.value)} />
                                <label htmlFor="parceladasRec">Parceladas</label>
                                
                                <input type="radio" id="pontuaisRec" name="cashflow-rec" value="pontual" checked={filtroTipoReceita === 'pontual'} onChange={(e) => setFiltroTipoReceita(e.target.value)} />
                                <label htmlFor="pontuaisRec">Pontuais</label>
                            </div>
                            <div className="espaco"></div>
                            <select className="seletor" id="filtroReceitas" value={filtroCatReceita} onChange={(e) => setFiltroCatReceita(e.target.value)}>
                                <option value="todas">Todas as categorias</option>
                                {categoriasReceita.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="container-tabela">
                            <div className="cabecalho" style={{ gridTemplateColumns: '1.5fr 3fr 2fr 2fr 1fr' }}>
                                <div className="cbc-cor"><p style={{ margin: 0 }}>classe</p></div>
                                <div className="cbc-titulo"><p style={{ margin: 0 }}>descrição</p></div>
                                <div className="cbc-valor"><p style={{ margin: 0 }}>valor</p></div>
                                <div className="cbc-data"><p style={{ margin: 0 }}>data</p></div>
                                <div className="cbc-categoria"><p style={{ margin: 0 }}>categoria</p></div>
                            </div>
                            <div className="tabela" id="tabelaReceita" style={{ justifyContent: 'flex-start' }}>
                                {loading && <p style={{textAlign:'center', marginTop: '20px'}}>A carregar...</p>}
                                {!loading && receitasFiltradas.length === 0 && <p style={{textAlign:'center', color:'#999', marginTop: '20px'}}>Nenhuma receita encontrada.</p>}
                                {!loading && receitasFiltradas.map(receita => (
                                    <div className="linha" key={receita.id} style={{ gridTemplateColumns: '1.5fr 3fr 2fr 2fr 1fr auto' }}>
                                        <div className={`cor ${getCorTipo(receita.tipo)}`}></div>
                                        <p className="titulo" style={{ margin: 0 }}>{receita.descricao}</p>
                                        <p className="valor" style={{ margin: 0 }}>{formatarMoeda(receita.valor)}</p>
                                        <p className="data" style={{ margin: 0 }}>{new Date(receita.data).toLocaleDateString('pt-BR')}</p>
                                        <p className="categoria" style={{ margin: 0, width: 'fit-content', padding: '5px 10px', whiteSpace: 'nowrap' }}>
                                            {receita.categoriaReceitaDTO?.nome || 'Geral'}
                                        </p>
                                        <div className="acoes">
                                            <button className="alt"><i className="material-symbols-outlined">edit</i></button>
                                            <button className="delete"><i className="material-symbols-outlined">delete</i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
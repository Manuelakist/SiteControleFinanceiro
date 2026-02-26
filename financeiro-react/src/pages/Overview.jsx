import { useEffect, useState } from 'react';
import '../assets/css/overview.css';
import { obterDatasMesAtual } from '../utils/dateUtils';
import { authService } from '../services/auth.service';
import { contaService } from '../services/conta.service';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';
import { categoriaService } from '../services/categoria.service';

export function Overview() {
    
    const [resumo, setResumo] = useState({ saldo: 0, disponivel: 0, gasto: 0, receita: 0 });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [idContaAtual, setIdContaAtual] = useState(null);

    const [todasDespesas, setTodasDespesas] = useState([]);
    const [todasReceitas, setTodasReceitas] = useState([]);
    
    const [catsDespesa, setCatsDespesa] = useState([]);
    const [catsReceita, setCatsReceita] = useState([]);

    const [tipoDespesa, setTipoDespesa] = useState('todas');
    const [tipoReceita, setTipoReceita] = useState('todas');
    const [catDespesaSelecionada, setCatDespesaSelecionada] = useState('todas');
    const [catReceitaSelecionada, setCatReceitaSelecionada] = useState('todas');

    useEffect(() => {
        async function carregarDados() {
            try {
                setErro(null);

                const usuarioLogado = authService.getUsuarioLogado();
                if (!usuarioLogado) {
                    throw new Error("Sessão expirada ou utilizador não autenticado.");
                }

                const contasDoUsuario = await contaService.getContasPorUsuario(usuarioLogado.id);
                
                if (!contasDoUsuario || contasDoUsuario.length === 0) {
                    setErro("Ainda não tem nenhuma Conta Financeira associada ao seu perfil.");
                    setLoading(false);
                    return;
                }

                const contaAtiva = contasDoUsuario[0];
                setIdContaAtual(contaAtiva.id);

                const { primeiroDia, ultimoDia } = obterDatasMesAtual();

                const [
                    somaDespesas, somaReceitas, 
                    despesas, receitas, 
                    listaCatsDespesa, listaCatsReceita
                ] = await Promise.all([
                    despesaService.getSoma(contaAtiva.id, primeiroDia, ultimoDia),
                    receitaService.getSoma(contaAtiva.id, primeiroDia, ultimoDia),
                    despesaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                    receitaService.listarPorConta(contaAtiva.id, primeiroDia, ultimoDia),
                    categoriaService.listarCategoriasDespesa(contaAtiva.id), 
                    categoriaService.listarCategoriasReceita(contaAtiva.id)
                ]);

                setResumo({
                    saldo: contaAtiva.saldo || 0,
                    gasto: somaDespesas.data ?? somaDespesas ?? 0,
                    receita: somaReceitas.data ?? somaReceitas ?? 0,
                    disponivel: contaAtiva.saldo || 0 
                });

                setTodasDespesas(despesas.data ?? despesas ?? []);
                setTodasReceitas(receitas.data ?? receitas ?? []);
                setCatsDespesa(listaCatsDespesa.data ?? listaCatsDespesa ?? []);
                setCatsReceita(listaCatsReceita.data ?? listaCatsReceita ?? []);

            } catch (error) {
                console.error("Erro na sincronização de dados:", error);
                setErro(error.message || "Não foi possível carregar os dados financeiros.");
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    const getDespesasFiltradas = () => {
        return todasDespesas.filter(d => {
            const bateuTipo = tipoDespesa === 'todas' || (d.tipo && d.tipo.toLowerCase() === tipoDespesa.toLowerCase());
            const bateuCategoria = catDespesaSelecionada === 'todas' || 
                (d.categoriaDespesaDTO && d.categoriaDespesaDTO.id.toString() === catDespesaSelecionada);
            return bateuTipo && bateuCategoria;
        });
    };

    const getReceitasFiltradas = () => {
        return todasReceitas.filter(r => {
            const bateuTipo = tipoReceita === 'todas' || (r.tipo && r.tipo.toLowerCase() === tipoReceita.toLowerCase());
            const bateuCategoria = catReceitaSelecionada === 'todas' || 
                (r.categoriaReceitaDTO && r.categoriaReceitaDTO.id.toString() === catReceitaSelecionada);
            return bateuTipo && bateuCategoria;
        });
    };

    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

    const getCorTipo = (tipo) => {
        if (!tipo) return 'cor1';
        const t = tipo.toLowerCase();
        if (t === 'fixa') return 'cor2';
        if (t === 'parcelada') return 'cor3';
        return 'cor1';
    };

    if (erro) {
        return (
            <div className="vg">
                <h3 style={{ color: '#d9534f' }}>Aviso de Sistema</h3>
                <p>{erro}</p>
                <button onClick={() => window.location.reload()}>Atualizar Página</button>
            </div>
        );
    }

    return (
        <div className="vg">
            <div className="info-box">
                <div className="box saldo-total">
                    <p className="lbl">Saldo total</p>
                    <div className="espaco"></div>
                    <p className="valor">{loading ? '...' : formatarMoeda(resumo.saldo)}</p>
                </div>
                <div className="box vlr-disp">
                    <p className="lbl">Valor disponível</p>
                    <div className="espaco"></div>
                    <p className="valor">{loading ? '...' : formatarMoeda(resumo.disponivel)}</p>
                </div>
                <div className="box total-gasto">
                    <p className="lbl">Total gasto</p>
                    <div className="espaco"></div>
                    <p className="valor">{loading ? '...' : formatarMoeda(resumo.gasto)}</p>
                </div>
                <div className="box alguma-info">
                    <p className="lbl">Receita total</p>
                    <div className="espaco"></div>
                    <p className="valor">{loading ? '...' : formatarMoeda(resumo.receita)}</p>
                </div>
            </div>

            <div className="vg-tela">
                <div className="box grid-grafico">
                    <p className="link">Relatórios</p>
                    <div className="container-grafico">
                        <div className="grafico-relatorios">
                            <p style={{ margin: 0, marginTop: '50px', textAlign: 'center', color: '#ccc' }}>Gráfico em breve</p>
                        </div>
                    </div>
                </div>
                <div className="box grid-orcamento">
                    <p className="link">Orçamentos</p>
                    <div className="container-grafico">
                        <div className="grafico-orcamentos">
                             <p style={{ margin: 0, marginTop: '50px', textAlign: 'center', color: '#ccc' }}>Gráfico em breve</p>
                        </div>
                    </div>
                </div>
                <div className="box grid-meta">
                    <p className="link">Metas</p>
                     <div className="lista-orc">
                        <p style={{ margin: 0, textAlign: 'center', color: '#ccc' }}>Em breve</p>
                    </div>
                    <button>Ver Detalhes</button>
                </div>

                <div className="box grid-despesa">
                    <div className="linha1">
                        <p className="link">Despesas</p>
                        <div className="espaco"></div>
                        <select 
                            name="seletor" 
                            id="filtroResumoDespesas"
                            value={catDespesaSelecionada}
                            onChange={(e) => setCatDespesaSelecionada(e.target.value)}
                            disabled={loading}
                        >
                            <option value="todas">Todas as categorias</option>
                            {catsDespesa.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="linha2">
                        <input type="radio" id="btn-todos" name="filtro-des" 
                               checked={tipoDespesa === 'todas'} onChange={() => setTipoDespesa('todas')} disabled={loading} />
                        <label htmlFor="btn-todos">Todas</label>

                        <input type="radio" id="btn-fixos" name="filtro-des" 
                               checked={tipoDespesa === 'fixa'} onChange={() => setTipoDespesa('fixa')} disabled={loading} />
                        <label htmlFor="btn-fixos">Fixas</label>

                        <input type="radio" id="btn-parceladas" name="filtro-des" 
                               checked={tipoDespesa === 'parcelada'} onChange={() => setTipoDespesa('parcelada')} disabled={loading} />
                        <label htmlFor="btn-parceladas">Parceladas</label>

                        <input type="radio" id="btn-pontuais" name="filtro-des" 
                               checked={tipoDespesa === 'pontual'} onChange={() => setTipoDespesa('pontual')} disabled={loading} />
                        <label htmlFor="btn-pontuais">Pontuais</label>
                    </div>
                    
                    <div className="tabela">
                        {loading ? <p style={{ margin: 0, textAlign: 'center', padding: '1rem' }}>A carregar despesas...</p> : 
                         getDespesasFiltradas().length === 0 ? <p style={{ margin: 0, textAlign: 'center', color: '#999', padding: '1rem' }}>Nenhuma despesa encontrada.</p> :
                         getDespesasFiltradas().map(despesa => (
                            <div className="linha" key={despesa.id}>
                                <div className={`cor ${getCorTipo(despesa.tipo)}`}></div>
                                <p className="titulo">{despesa.descricao}</p>
                                <p className="valor">{formatarMoeda(despesa.valor)}</p>
                                <p className="categoria">
                                    {despesa.categoriaDespesaDTO ? despesa.categoriaDespesaDTO.nome : 'Outros'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="box grid-receita">
                    <div className="linha1">
                        <p className="link">Receitas</p>
                        <div className="espaco"></div>
                        <select 
                            name="seletor" 
                            id="filtroResumoReceitas"
                            value={catReceitaSelecionada}
                            onChange={(e) => setCatReceitaSelecionada(e.target.value)}
                            disabled={loading}
                        >
                            <option value="todas">Todas as categorias</option>
                            {catsReceita.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="linha2">
                        <input type="radio" id="btn-todos-rec" name="filtro-rec" 
                               checked={tipoReceita === 'todas'} onChange={() => setTipoReceita('todas')} disabled={loading} />
                        <label htmlFor="btn-todos-rec">Todas</label>

                        <input type="radio" id="btn-fixos-rec" name="filtro-rec" 
                               checked={tipoReceita === 'fixa'} onChange={() => setTipoReceita('fixa')} disabled={loading} />
                        <label htmlFor="btn-fixos-rec">Fixas</label>

                        <input type="radio" id="btn-parceladas-rec" name="filtro-rec" 
                               checked={tipoReceita === 'parcelada'} onChange={() => setTipoReceita('parcelada')} disabled={loading} />
                        <label htmlFor="btn-parceladas-rec">Parceladas</label>

                        <input type="radio" id="btn-pontuais-rec" name="filtro-rec" 
                               checked={tipoReceita === 'pontual'} onChange={() => setTipoReceita('pontual')} disabled={loading} />
                        <label htmlFor="btn-pontuais-rec">Pontuais</label>
                    </div>

                    <div className="tabela">
                        {loading ? <p style={{ margin: 0, textAlign: 'center', padding: '1rem' }}>A carregar receitas...</p> : 
                         getReceitasFiltradas().length === 0 ? <p style={{ margin: 0, textAlign: 'center', color: '#999', padding: '1rem' }}>Nenhuma receita encontrada.</p> :
                         getReceitasFiltradas().map(receita => (
                            <div className="linha" key={receita.id}>
                                <div className={`cor ${getCorTipo(receita.tipo)}`}></div>
                                <p className="titulo">{receita.descricao}</p>
                                <p className="valor">{formatarMoeda(receita.valor)}</p>
                                <p className="categoria">
                                    {receita.categoriaReceitaDTO ? receita.categoriaReceitaDTO.nome : 'Outros'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
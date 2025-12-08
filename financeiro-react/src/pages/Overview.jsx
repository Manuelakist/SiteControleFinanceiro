import { useEffect, useState } from 'react';
import '../assets/css/overview.css';
import { obterDatasMesAtual } from '../utils/dateUtils';
import { contaService } from '../services/conta.service';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';
import { categoriaService } from '../services/categoria.service'; // Novo serviço

export function Overview() {
    const ID_CONTA = 1; 

    // --- ESTADOS DE DADOS ---
    const [resumo, setResumo] = useState({ saldo: 0, disponivel: 0, gasto: 0, receita: 0 });
    const [loading, setLoading] = useState(true);

    // Listas Originais (Do Banco)
    const [todasDespesas, setTodasDespesas] = useState([]);
    const [todasReceitas, setTodasReceitas] = useState([]);
    
    // Listas de Categorias (Para os Dropdowns)
    const [catsDespesa, setCatsDespesa] = useState([]);
    const [catsReceita, setCatsReceita] = useState([]);

    // --- ESTADOS DE FILTRO ---
    // Filtro de Tipo (Botões: Fixa, Parcelada...)
    const [tipoDespesa, setTipoDespesa] = useState('todas');
    const [tipoReceita, setTipoReceita] = useState('todas');

    // Filtro de Categoria (Dropdown: Alimentação, Salário...)
    const [catDespesaSelecionada, setCatDespesaSelecionada] = useState('todas');
    const [catReceitaSelecionada, setCatReceitaSelecionada] = useState('todas');

    useEffect(() => {
        async function carregarDados() {
            try {
                const { primeiroDia, ultimoDia } = obterDatasMesAtual();

                // Busca TUDO de uma vez (Dados + Categorias)
                const [
                    dadosConta, somaDespesas, somaReceitas, 
                    despesas, receitas, 
                    listaCatsDespesa, listaCatsReceita
                ] = await Promise.all([
                    contaService.getContaById(ID_CONTA),
                    despesaService.getSoma(ID_CONTA, primeiroDia, ultimoDia),
                    receitaService.getSoma(ID_CONTA, primeiroDia, ultimoDia),
                    despesaService.listarPorConta(ID_CONTA, primeiroDia, ultimoDia),
                    receitaService.listarPorConta(ID_CONTA, primeiroDia, ultimoDia),
                    categoriaService.listarCategoriasDespesa(ID_CONTA), 
                    categoriaService.listarCategoriasReceita(ID_CONTA)
                ]);

                setResumo({
                    saldo: dadosConta?.saldo || 0,
                    gasto: somaDespesas || 0,
                    receita: somaReceitas || 0,
                    disponivel: dadosConta?.saldo || 0 
                });

                setTodasDespesas(despesas || []);
                setTodasReceitas(receitas || []);
                setCatsDespesa(listaCatsDespesa || []);
                setCatsReceita(listaCatsReceita || []);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    // --- LÓGICA DE FILTRAGEM AVANÇADA ---
    // Filtra considerando TANTO o Tipo (botão) QUANTO a Categoria (dropdown)
    const getDespesasFiltradas = () => {
        return todasDespesas.filter(d => {
            // 1. Filtro de Tipo (Botões)
            const bateuTipo = tipoDespesa === 'todas' || (d.tipo && d.tipo.toLowerCase() === tipoDespesa.toLowerCase());
            
            // 2. Filtro de Categoria (Dropdown)
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

    return (
        <div className="vg">
            {/* CARDS TOPO */}
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

            {/* GRID PRINCIPAL */}
            <div className="vg-tela">
                
                {/* GRÁFICOS (Placeholders) */}
                <div className="box grid-grafico">
                    <p className="link" data-page="reports">Relatórios</p>
                    <div className="container-grafico">
                        <div className="grafico-relatorios">
                            <p style={{marginTop: '50px', textAlign: 'center', color: '#ccc'}}>Gráfico em breve</p>
                        </div>
                    </div>
                </div>
                <div className="box grid-orcamento">
                    <p className="link" data-page="budgets">Orçamentos</p>
                    <div className="container-grafico">
                        <div className="grafico-orcamentos">
                             <p style={{marginTop: '50px', textAlign: 'center', color: '#ccc'}}>Gráfico em breve</p>
                        </div>
                    </div>
                </div>
                <div className="box grid-meta">
                    <p className="link" data-page="goals">Metas</p>
                     <div className="lista-orc">
                        <p style={{textAlign: 'center', color: '#ccc'}}>Em breve</p>
                    </div>
                    <button>Ver Detalhes</button>
                </div>

                {/* --- DESPESAS (Com Filtros de Categoria) --- */}
                <div className="box grid-despesa">
                    <div className="linha1">
                        <p className="link">Despesas</p>
                        <div className="espaco"></div>
                        
                        {/* DROPDOWN DE CATEGORIAS (Preenchido dinamicamente) */}
                        <select 
                            name="seletor" 
                            id="filtroResumoDespesas"
                            value={catDespesaSelecionada}
                            onChange={(e) => setCatDespesaSelecionada(e.target.value)}
                        >
                            <option value="todas">Todas</option>
                            {catsDespesa.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Filtros de Tipo (Botões) */}
                    <div className="linha2">
                        <input type="radio" id="btn-todos" name="filtro-des" 
                               checked={tipoDespesa === 'todas'} onChange={() => setTipoDespesa('todas')} />
                        <label htmlFor="btn-todos">Todas</label>

                        <input type="radio" id="btn-fixos" name="filtro-des" 
                               checked={tipoDespesa === 'fixa'} onChange={() => setTipoDespesa('fixa')} />
                        <label htmlFor="btn-fixos">Fixas</label>

                        <input type="radio" id="btn-parceladas" name="filtro-des" 
                               checked={tipoDespesa === 'parcelada'} onChange={() => setTipoDespesa('parcelada')} />
                        <label htmlFor="btn-parceladas">Parceladas</label>

                        <input type="radio" id="btn-pontuais" name="filtro-des" 
                               checked={tipoDespesa === 'pontual'} onChange={() => setTipoDespesa('pontual')} />
                        <label htmlFor="btn-pontuais">Pontuais</label>
                    </div>

                    <div className="tabela">
                        {loading ? <p style={{textAlign: 'center'}}>Carregando...</p> : 
                         getDespesasFiltradas().length === 0 ? <p style={{textAlign: 'center', color: '#999'}}>Nenhuma despesa encontrada.</p> :
                         getDespesasFiltradas().slice(0, 5).map(despesa => (
                            <div className="linha" key={despesa.id}>
                                <div className={`cor ${getCorTipo(despesa.tipo)}`}></div>
                                <p className="titulo">{despesa.descricao}</p>
                                <p className="valor">R$ {despesa.valor}</p>
                                <p className="categoria">
                                    {despesa.categoriaDespesaDTO ? despesa.categoriaDespesaDTO.nome : 'Outros'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RECEITAS (Com Filtros de Categoria) --- */}
                <div className="box grid-receita">
                    <div className="linha1">
                        <p className="link">Receitas</p>
                        <div className="espaco"></div>
                        
                        {/* DROPDOWN DE CATEGORIAS */}
                        <select 
                            name="seletor" 
                            id="filtroResumoReceitas"
                            value={catReceitaSelecionada}
                            onChange={(e) => setCatReceitaSelecionada(e.target.value)}
                        >
                            <option value="todas">Todas</option>
                            {catsReceita.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nome}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtros de Tipo (Botões) */}
                    <div className="linha2">
                        <input type="radio" id="btn-todos-rec" name="filtro-rec" 
                               checked={tipoReceita === 'todas'} onChange={() => setTipoReceita('todas')} />
                        <label htmlFor="btn-todos-rec">Todas</label>

                        <input type="radio" id="btn-fixos-rec" name="filtro-rec" 
                               checked={tipoReceita === 'fixa'} onChange={() => setTipoReceita('fixa')} />
                        <label htmlFor="btn-fixos-rec">Fixas</label>

                        <input type="radio" id="btn-parceladas-rec" name="filtro-rec" 
                               checked={tipoReceita === 'parcelada'} onChange={() => setTipoReceita('parcelada')} />
                        <label htmlFor="btn-parceladas-rec">Parceladas</label>

                        <input type="radio" id="btn-pontuais-rec" name="filtro-rec" 
                               checked={tipoReceita === 'pontual'} onChange={() => setTipoReceita('pontual')} />
                        <label htmlFor="btn-pontuais-rec">Pontuais</label>
                    </div>

                    <div className="tabela">
                        {loading ? <p style={{textAlign: 'center'}}>Carregando...</p> : 
                         getReceitasFiltradas().length === 0 ? <p style={{textAlign: 'center', color: '#999'}}>Nenhuma receita encontrada.</p> :
                         getReceitasFiltradas().slice(0, 5).map(receita => (
                            <div className="linha" key={receita.id}>
                                <div className={`cor ${getCorTipo(receita.tipo)}`}></div>
                                <p className="titulo">{receita.descricao}</p>
                                <p className="valor">R$ {receita.valor}</p>
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
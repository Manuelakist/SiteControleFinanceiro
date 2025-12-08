import { useEffect, useState } from 'react';
import '../assets/css/overview.css';
import { obterDatasMesAtual } from '../utils/dateUtils';
import { contaService } from '../services/conta.service';
import { despesaService } from '../services/despesa.service';
import { receitaService } from '../services/receita.service';

export function Overview() {
    const ID_CONTA = 1; 

    // ESTADOS
    const [resumo, setResumo] = useState({ saldo: 0, disponivel: 0, gasto: 0, receita: 0 });
    const [loading, setLoading] = useState(true);

    // Listas Originais (trazidas do banco)
    const [todasDespesas, setTodasDespesas] = useState([]);
    const [todasReceitas, setTodasReceitas] = useState([]);

    // Filtros selecionados ('todas', 'fixa', 'parcelada', 'pontual')
    const [filtroDespesa, setFiltroDespesa] = useState('todas');
    const [filtroReceita, setFiltroReceita] = useState('todas');

    useEffect(() => {
        async function carregarDados() {
            try {
                const { primeiroDia, ultimoDia } = obterDatasMesAtual();
                const [dadosConta, somaDespesas, somaReceitas, despesas, receitas] = await Promise.all([
                    contaService.getContaById(ID_CONTA),
                    despesaService.getSoma(ID_CONTA, primeiroDia, ultimoDia),
                    receitaService.getSoma(ID_CONTA, primeiroDia, ultimoDia),
                    despesaService.listarPorConta(ID_CONTA, primeiroDia, ultimoDia),
                    receitaService.listarPorConta(ID_CONTA, primeiroDia, ultimoDia)
                ]);

                setResumo({
                    saldo: dadosConta?.saldo || 0,
                    gasto: somaDespesas || 0,
                    receita: somaReceitas || 0,
                    disponivel: dadosConta?.saldo || 0 
                });

                // Salvamos os dados originais
                setTodasDespesas(despesas || []);
                setTodasReceitas(receitas || []);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    // FUNÇÕES DE FILTRAGEM
    // Filtra a lista original baseado no botão selecionado
    const getDespesasFiltradas = () => {
        if (filtroDespesa === 'todas') return todasDespesas;
        return todasDespesas.filter(d => d.tipo === filtroDespesa);
    };

    const getReceitasFiltradas = () => {
        if (filtroReceita === 'todas') return todasReceitas;
        return todasReceitas.filter(r => r.tipo === filtroReceita);
    };

    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

    const getCorTipo = (tipo) => {
        if (tipo === 'fixa') return 'cor3';
        if (tipo === 'parcelada') return 'cor1'; 
        if (tipo == 'pontual') return 'cor4';
        return 'cor2'; 
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

            {/* GRID */}
            <div className="vg-tela">
                
                {/* ... PLACEHOLDERS (Graficos/Metas) MANTIDOS IGUAIS ... */}
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

                {/* --- DESPESAS (Com Filtros Funcionando) --- */}
                <div className="box grid-despesa">
                    <div className="linha1">
                        <p className="link">Despesas</p>
                        <div className="espaco"></div>
                        <select name="seletor" id="filtroResumoDespesas">
                            <option value="todas">Todas</option>
                        </select>
                    </div>
                    <div className="linha2">
                        {/* Radio buttons com IDs exatos do CSS */}
                        
                        <input type="radio" id="btn-todos" name="filtro-des" 
                               checked={filtroDespesa === 'todas'} 
                               onChange={() => setFiltroDespesa('todas')} />
                        <label htmlFor="btn-todos">Todas</label>

                        <input type="radio" id="btn-fixos" name="filtro-des" 
                               checked={filtroDespesa === 'fixa'} 
                               onChange={() => setFiltroDespesa('fixa')} />
                        <label htmlFor="btn-fixos">Fixas</label>

                        <input type="radio" id="btn-parceladas" name="filtro-des" 
                               checked={filtroDespesa === 'parcelada'} 
                               onChange={() => setFiltroDespesa('parcelada')} />
                        <label htmlFor="btn-parceladas">Parceladas</label>

                        <input type="radio" id="btn-pontuais" name="filtro-des" 
                               checked={filtroDespesa === 'pontual'} 
                               onChange={() => setFiltroDespesa('pontual')} />
                        <label htmlFor="btn-pontuais">Pontuais</label>
                    </div>

                    <div className="tabela">
                        {loading ? <p style={{textAlign: 'center'}}>Carregando...</p> : 
                         getDespesasFiltradas().length === 0 ? <p style={{textAlign: 'center', color: '#999'}}>Nenhuma despesa.</p> :
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

                {/* --- RECEITAS (Com Filtros Funcionando) --- */}
                <div className="box grid-receita">
                    <div className="linha1">
                        <p className="link">Receitas</p>
                        <div className="espaco"></div>
                        <select name="seletor" id="filtroResumoReceitas">
                            <option value="todas">Todas</option>
                        </select>
                    </div>
                    <div className="linha2">
                        {/* Radio buttons com IDs exatos (sufixo -rec) */}
                        
                        <input type="radio" id="btn-todos-rec" name="filtro-rec" 
                               checked={filtroReceita === 'todas'} 
                               onChange={() => setFiltroReceita('todas')} />
                        <label htmlFor="btn-todos-rec">Todas</label>

                        <input type="radio" id="btn-fixos-rec" name="filtro-rec" 
                               checked={filtroReceita === 'fixa'} 
                               onChange={() => setFiltroReceita('fixa')} />
                        <label htmlFor="btn-fixos-rec">Fixas</label>

                        <input type="radio" id="btn-parceladas-rec" name="filtro-rec" 
                               checked={filtroReceita === 'parcelada'} 
                               onChange={() => setFiltroReceita('parcelada')} />
                        <label htmlFor="btn-parceladas-rec">Parceladas</label>

                        <input type="radio" id="btn-pontuais-rec" name="filtro-rec" 
                               checked={filtroReceita === 'pontual'} 
                               onChange={() => setFiltroReceita('pontual')} />
                        <label htmlFor="btn-pontuais-rec">Pontuais</label>
                    </div>

                    <div className="tabela">
                        {loading ? <p style={{textAlign: 'center'}}>Carregando...</p> : 
                         getReceitasFiltradas().length === 0 ? <p style={{textAlign: 'center', color: '#999'}}>Nenhuma receita.</p> :
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
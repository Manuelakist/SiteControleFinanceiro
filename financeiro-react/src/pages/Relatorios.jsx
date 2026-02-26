import { useState, useEffect } from 'react';
import { relatorioService } from '../services/relatorio.service';
import { authService } from '../services/auth.service';
import { contaService } from '../services/conta.service';
import '../assets/css/reports.css';

/**
 * Componente de Relatórios e Análise Financeira.
 */
export function Relatorios() {
    const [loading, setLoading] = useState(true);
    const [periodo, setPeriodo] = useState({
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear()
    });

    useEffect(() => {
        carregarDadosRelatorio();
    }, [periodo]);

    async function carregarDadosRelatorio() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            const contas = await contaService.getContasPorUsuario(usuario.id);
            const contaAtiva = (contas.data || contas)[0];

            if (contaAtiva) {
                // Aqui chamaremos os serviços para popular os estados dos gráficos
                await relatorioService.getDadosMensais(contaAtiva.id, periodo.mes, periodo.ano);
            }
        } catch (error) {
            console.error("Erro ao processar relatórios:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="reports-container" id="pagina-relatorios">
            <div className="cabecalho-reports">
                <p className="titulo">Relatórios e Análises</p>
                <div className="filtros-periodo">
                    <select 
                        value={periodo.mes} 
                        onChange={(e) => setPeriodo({...periodo, mes: e.target.value})}
                    >
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                    </select>
                    <input 
                        type="number" 
                        value={periodo.ano} 
                        onChange={(e) => setPeriodo({...periodo, ano: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid-reports">
                <div className="card-report grande">
                    <p className="subtitulo">Fluxo de Caixa Mensal</p>
                    <div className="canvas-container">
                        {/* Espaço reservado para gráfico de barras/linha */}
                        <div className="placeholder-chart">Gráfico de barras: Entradas vs Saídas</div>
                    </div>
                </div>

                <div className="card-report">
                    <p className="subtitulo">Gastos por Categoria</p>
                    <div className="canvas-container">
                        {/* Espaço reservado para gráfico de rosca/pizza */}
                        <div className="placeholder-chart">Gráfico de Pizza: Categorias</div>
                    </div>
                </div>

                <div className="card-report">
                    <p className="subtitulo">Maiores Despesas</p>
                    <div className="lista-rank">
                        {/* Lista simples de maiores gastos */}
                        <p className="status-msg">Processando maiores gastos...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
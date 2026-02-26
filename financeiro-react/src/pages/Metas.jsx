import { useState, useEffect } from 'react';
import { metaService } from '../services/meta.service';
import { authService } from '../services/auth.service';
import '../assets/css/goals.css';

/**
 * Componente de visualização e gestão de metas financeiras.
 */
export function Metas() {
    const [loading, setLoading] = useState(true);
    const [metas, setMetas] = useState([]);

    useEffect(() => {
        carregarMetas();
    }, []);

    async function carregarMetas() {
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            const res = await metaService.listarPorUsuario(usuario.id);
            
            const listaMetas = res.data ?? res ?? [];

            const metasProcessadas = listaMetas.map(meta => {
                const progresso = meta.valor_alvo > 0 
                    ? Math.min((meta.valor_atual / meta.valor_alvo) * 100, 100) 
                    : 0;
                return { ...meta, porcentagem: progresso };
            });

            setMetas(metasProcessadas);
        } catch (error) {
            console.error("Erro ao carregar metas:", error);
        } finally {
            setLoading(false);
        }
    }

    const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

    return (
        <div className="goals-container" id="pagina-metas">
            <div className="cabecalho-metas">
                <p className="titulo">Minhas Metas</p>
                <button className="btn-nova-meta">+ Nova Meta</button>
            </div>

            <div className="grid-metas">
                {loading ? (
                    <p className="status-msg">Sincronizando metas...</p>
                ) : metas.length === 0 ? (
                    <p className="status-msg">Você ainda não possui metas cadastradas.</p>
                ) : (
                    metas.map((meta) => (
                        <div className="card-meta" key={meta.id}>
                            <div className="info-meta">
                                <p className="nome-meta">{meta.nome}</p>
                                <div className="acoes">
                                    <button className="btn-icon"><i className="material-symbols-outlined">edit</i></button>
                                    <button className="btn-icon delete"><i className="material-symbols-outlined">delete</i></button>
                                </div>
                            </div>

                            <div className="detalhes-valores">
                                <p className="valor-atual">{formatarMoeda(meta.valor_atual)}</p>
                                <p className="valor-alvo">objetivo: {formatarMoeda(meta.valor_alvo)}</p>
                            </div>

                            <div className="barra-externa">
                                <div 
                                    className="barra-interna" 
                                    style={{ width: `${meta.porcentagem}%` }}
                                ></div>
                            </div>
                            
                            <div className="rodape-meta">
                                <p className="percentual-texto">{Math.round(meta.porcentagem)}% concluído</p>
                                {meta.data_limite && (
                                    <p className="prazo">Prazo: {new Date(meta.data_limite).toLocaleDateString('pt-BR')}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
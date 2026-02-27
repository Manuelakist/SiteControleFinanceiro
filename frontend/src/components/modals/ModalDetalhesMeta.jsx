import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { depositoService } from '../../services/deposito.service';
import '../../assets/css/goals.css';

/**
 * Modal de detalhes da meta para visualização de histórico e novos depósitos.
 */
export function ModalDetalhesMeta({ isOpen, onClose, meta, onUpdate }) {
    if (!isOpen || !meta) return null;

    const [depositos, setDepositos] = useState([]);
    const [valorDeposito, setValorDeposito] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarDepositos();
    }, [meta]);

    async function carregarDepositos() {
        try {
            const res = await depositoService.listarPorMeta(meta.id);
            setDepositos(res.data || res || []);
        } catch (error) {
            console.error("Falha ao carregar depósitos:", error);
        }
    }

    async function handleAddDeposito(e) {
        e.preventDefault();
        if (!valorDeposito) return;

        try {
            setLoading(true);
            const payload = {
                valor: parseFloat(valorDeposito),
                data: new Date().toISOString().split('T')[0],
                metaDTO: { id: meta.id }
            };

            await depositoService.adicionarDeposito(payload);
            setValorDeposito('');
            await carregarDepositos();
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Erro ao registrar depósito:", error);
        } finally {
            setLoading(false);
        }
    }

    const formatarMoeda = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="detalhe-meta-container" onClick={e => e.stopPropagation()}>
                <header>
                    <h3>{meta.objetivo}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </header>

                <section className="form-deposito">
                    <form onSubmit={handleAddDeposito}>
                        <div className="input-group">
                            <label>Adicionar valor:</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                value={valorDeposito} 
                                onChange={e => setValorDeposito(e.target.value)}
                                placeholder="R$ 0,00"
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? '...' : 'Depositar'}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="historico-depositos">
                    <h4>Histórico de depósitos</h4>
                    <div className="lista-depositos">
                        {depositos.length === 0 ? (
                            <p className="empty-msg">Nenhum depósito realizado.</p>
                        ) : (
                            depositos.map(dep => (
                                <div className="item-deposito" key={dep.id}>
                                    <span>{new Date(dep.data).toLocaleDateString('pt-BR')}</span>
                                    <strong>{formatarMoeda(dep.valor)}</strong>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>,
        document.body
    );
}
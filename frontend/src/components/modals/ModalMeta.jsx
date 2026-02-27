import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { metaService } from '../../services/meta.service';
import { authService } from '../../services/auth.service';
import { contaService } from '../../services/conta.service';
import '../../assets/css/components.css';

export function ModalMeta({ isOpen, onClose, onSave, metaParaEditar }) {
    const [form, setForm] = useState({ objetivo: '', valor: '', dataFim: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (metaParaEditar) {
            setForm({
                objetivo: metaParaEditar.objetivo,
                valor: metaParaEditar.valor,
                dataFim: metaParaEditar.dataFim ? metaParaEditar.dataFim.split('T')[0] : ''
            });
        } else {
            setForm({ objetivo: '', valor: '', dataFim: '' });
        }
    }, [metaParaEditar, isOpen]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const usuario = authService.getUsuarioLogado();
            const resContas = await contaService.getContasPorUsuario(usuario.id);
            const idConta = (resContas.data ? resContas.data[0].id : resContas[0].id);
            const dadosMeta = { 
                ...form, 
                valor: parseFloat(form.valor),
                dataInicio: metaParaEditar ? metaParaEditar.dataInicio : new Date().toISOString().split('T')[0], 
                contaDTO: { id: idConta } 
            };
            if (metaParaEditar) await metaService.alterarMeta(metaParaEditar.id, dadosMeta);
            else await metaService.adicionarMeta(dadosMeta);
            onSave(); onClose();
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="conteudo-adc-meta" onClick={e => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h1>{metaParaEditar ? 'Editar Meta' : 'Nova Meta'}</h1>
                <form onSubmit={handleSubmit} className="inputs">
                    <div className="linha">
                        <i className="material-icons">flag</i>
                        <input type="text" value={form.objetivo} onChange={e => setForm({...form, objetivo: e.target.value})} placeholder="Ex: Viagem" required />
                    </div>
                    <div className="linha">
                        <p className="rs">R$</p>
                        <input type="number" step="0.01" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="Valor Total" required />
                    </div>
                    <div className="linha">
                        <i className="material-icons">calendar_today</i>
                        <input type="date" value={form.dataFim} onChange={e => setForm({...form, dataFim: e.target.value})} required />
                    </div>
                    <button className="btn-salvar" type="submit" disabled={loading}>
                        {loading ? '...' : 'Salvar'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
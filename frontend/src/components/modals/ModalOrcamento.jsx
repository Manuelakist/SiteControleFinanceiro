import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { orcamentoService } from '../../services/orcamento.service';
import { categoriaService } from '../../services/categoria.service';
import { authService } from '../../services/auth.service';
import { contaService } from '../../services/conta.service';
import '../../assets/css/components.css';

export function ModalOrcamento({ isOpen, onClose, onSave, orcamentoParaEditar }) {
    const [form, setForm] = useState({ categoriaId: '', valor: '' });
    const [categorias, setCategorias] = useState([]);
    const [idConta, setIdConta] = useState(null);

    useEffect(() => {
        if (isOpen) {
            carregarCategorias();
            if (orcamentoParaEditar) setForm({ categoriaId: orcamentoParaEditar.categoriaDespesaDTO?.id, valor: orcamentoParaEditar.valor });
            else setForm({ categoriaId: '', valor: '' });
        }
    }, [isOpen, orcamentoParaEditar]);

    async function carregarCategorias() {
        const usuario = authService.getUsuarioLogado();
        const resContas = await contaService.getContasPorUsuario(usuario.id);
        const id = resContas.data ? resContas.data[0].id : resContas[0].id;
        setIdConta(id);
        const resCat = await categoriaService.listarCategoriasDespesa(id);
        setCategorias(resCat.data || resCat || []);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const dados = { valor: parseFloat(form.valor), categoriaDespesaDTO: { id: parseInt(form.categoriaId) }, contaDTO: { id: idConta } };
        if (orcamentoParaEditar) await orcamentoService.alterarOrcamento(orcamentoParaEditar.id, dados);
        else await orcamentoService.adicionarOrcamento(dados);
        onSave(); onClose();
    }

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="adc-orcamento-box" onClick={e => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h1>{orcamentoParaEditar ? 'Editar Orçamento' : 'Novo Orçamento'}</h1>
                <form onSubmit={handleSubmit} className="inputs">
                    <div className="linha">
                        <i className="material-icons">category</i>
                        <select value={form.categoriaId} onChange={e => setForm({...form, categoriaId: e.target.value})} required>
                            <option value="">Qual categoria?</option>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>
                    <div className="linha">
                        <p className="rs">R$</p>
                        <input type="number" step="0.01" placeholder="Limite mensal" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn-salvar">Salvar</button>
                </form>
            </div>
        </div>,
        document.body
    );
}
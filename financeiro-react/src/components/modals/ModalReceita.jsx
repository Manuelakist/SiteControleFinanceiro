import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { receitaService } from '../../services/receita.service';
import { categoriaService } from '../../services/categoria.service';
import { authService } from '../../services/auth.service';
import { contaService } from '../../services/conta.service';
import '../../assets/css/components.css';

/**
 * Modal para registo de novas Receitas.
 * Suporta entradas pontuais, fixas ou parceladas com integração à conta ativa.
 */
export function ModalReceita({ isOpen, onClose, onReceitaAdicionada }) {
    const [form, setForm] = useState({
        descricao: '', valor: '', data: new Date().toISOString().split('T')[0],
        categoriaId: '', novaCategoriaNome: '', tipo: 'PONTUAL', tempo: '1'
    });
    const [categorias, setCategorias] = useState([]);
    const [idConta, setIdConta] = useState(null);

    useEffect(() => {
        if (isOpen) carregarCategorias();
    }, [isOpen]);

    const carregarCategorias = async () => {
        const usuario = authService.getUsuarioLogado();
        const resContas = await contaService.getContasPorUsuario(usuario.id);
        if (resContas.data?.length > 0 || resContas.length > 0) {
            const id = resContas.data ? resContas.data[0].id : resContas[0].id;
            setIdConta(id);
            const resCat = await categoriaService.listarCategoriasReceita(id);
            setCategorias(resCat.data || resCat || []);
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    async function handleSubmit(e) {
        e.preventDefault();
        let catId = form.categoriaId;
        if (catId === 'NOVA_CATEGORIA') {
            const res = await categoriaService.adicionarCategoriaReceita({ nome: form.novaCategoriaNome, contaDTO: { id: idConta } });
            catId = res.data?.id || res.id;
        }
        let tempo = form.tipo === 'FIXA' ? 12 : (form.tipo === 'PARCELADA' ? parseInt(form.tempo) : 1);
        await receitaService.adicionarReceita({
            descricao: form.descricao, valor: parseFloat(form.valor), data: form.data,
            tipo: form.tipo, tempo, contaDTO: { id: idConta },
            categoriaReceitaDTO: { id: parseInt(catId) }
        });
        onReceitaAdicionada ? onReceitaAdicionada() : window.location.reload();
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="adc-conteudo" onClick={e => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h3>Adicionar Receita</h3>
                <form onSubmit={handleSubmit} className="inputs">
                    <div className="linha"><i className="material-icons">edit</i><input type="text" name="descricao" placeholder="Descrição da entrada" value={form.descricao} onChange={handleChange} required /></div>
                    <div className="linha-valor">
                        <div className="linha"><p className="rs">R$</p><input type="number" step="0.01" name="valor" placeholder="0,00" value={form.valor} onChange={handleChange} required /></div>
                        <div className="linha"><i className="material-icons">category</i>
                            <select name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
                                <option value="">Categoria...</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                <option value="NOVA_CATEGORIA">Nova Categoria</option>
                            </select>
                        </div>
                    </div>
                    {form.categoriaId === 'NOVA_CATEGORIA' && <div className="linha"><i className="material-icons">add_circle</i><input type="text" name="novaCategoriaNome" placeholder="Nome" value={form.novaCategoriaNome} onChange={handleChange} required /></div>}
                    <div className="linha"><i className="material-icons">calendar_today</i><input type="date" name="data" value={form.data} onChange={handleChange} required /></div>
                    <div className="input-tipo">
                        <div className="radio-tipo">
                            <input type="radio" id="p-rec" name="tipo" value="PONTUAL" checked={form.tipo === 'PONTUAL'} onChange={handleChange} /><label htmlFor="p-rec">Pontual</label>
                            <input type="radio" id="f-rec" name="tipo" value="FIXA" checked={form.tipo === 'FIXA'} onChange={handleChange} /><label htmlFor="f-rec">Fixa</label>
                            <input type="radio" id="par-rec" name="tipo" value="PARCELADA" checked={form.tipo === 'PARCELADA'} onChange={handleChange} /><label htmlFor="par-rec">Parcelada</label>
                        </div>
                    </div>
                    {form.tipo === 'PARCELADA' && <div className="linha"><i className="material-icons">reorder</i><input type="number" name="tempo" placeholder="Parcelas" value={form.tempo} onChange={handleChange} required /></div>}
                    <button type="submit" className="btn-salvar">Salvar Receita</button>
                </form>
            </div>
        </div>, document.body
    );
}
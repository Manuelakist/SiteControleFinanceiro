import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { receitaService } from '../../services/receita.service';
import { categoriaService } from '../../services/categoria.service';
import '../../assets/css/components.css';

export function ModalReceita({ isOpen, onClose, idConta, onReceitaAdicionada }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        categoriaId: '', 
        novaCategoriaNome: '',
        tipo: 'PONTUAL',
        tempo: '2'
    });

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (isOpen && idConta) carregarCategorias();
    }, [isOpen, idConta]);

    const carregarCategorias = async () => {
        try {
            const data = await categoriaService.listarCategoriasReceita(idConta);
            setCategorias(data || []);
            if (data?.length > 0 && !form.categoriaId) {
                setForm(prev => ({ ...prev, categoriaId: data[0].id }));
            }
        } catch (error) {
            setErro('Erro ao carregar categorias.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            let catIdFinal = form.categoriaId;

            if (form.categoriaId === 'NOVA_CATEGORIA') {
                if (!form.novaCategoriaNome.trim()) throw new Error('Nome da categoria obrigatório.');
                const novaCat = await categoriaService.adicionarCategoriaReceita({
                    nome: form.novaCategoriaNome,
                    contaDTO: { id: idConta } // Mapeamento correto para o DTO Java
                });
                catIdFinal = novaCat.id;
            }

            const payload = {
                descricao: form.descricao,
                valor: parseFloat(form.valor),
                data: form.data,
                tipo: form.tipo,
                tempo: form.tipo === 'PARCELADA' ? parseInt(form.tempo) : 0,
                contaDTO: { id: idConta },
                categoriaReceitaDTO: { id: parseInt(catIdFinal) }
            };

            await receitaService.adicionarReceita(payload);
            if (onReceitaAdicionada) onReceitaAdicionada();
            onClose();
        } catch (error) {
            setErro(error.message || 'Erro ao processar receita.');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="adc-conteudo" onClick={(e) => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h3>Nova Receita</h3>
                <form onSubmit={handleSubmit}>
                    {erro && <p className="erro-form" style={{ color: '#d9534f', textAlign: 'center' }}>{erro}</p>}
                    <div className="inputs">
                        <div className="input-desc linha">
                            <i className="material-icons">edit</i>
                            <input type="text" name="descricao" placeholder="descrição" value={form.descricao} onChange={handleChange} required />
                        </div>
                        <div className="linha-valor">
                            <div className="input-valor linha">
                                <i className="material-icons">attach_money</i>
                                <span className="rs">R$</span>
                                <input type="number" name="valor" placeholder="valor" step="0.01" value={form.valor} onChange={handleChange} required />
                            </div>
                            <div className="input-categoria linha">
                                <i className="material-icons">category</i>
                                <select name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
                                    <option value="" disabled>categoria</option>
                                    {categorias.map(cat => (<option key={cat.id} value={cat.id}>{cat.nome}</option>))}
                                    <option value="NOVA_CATEGORIA">+ nova categoria...</option>
                                </select>
                            </div>
                        </div>
                        {form.categoriaId === 'NOVA_CATEGORIA' && (
                            <div className="input-nova-cat linha">
                                <i className="material-icons">add_circle</i>
                                <input type="text" name="novaCategoriaNome" placeholder="nome da nova categoria" value={form.novaCategoriaNome} onChange={handleChange} required />
                            </div>
                        )}
                        <div className="input-tipo linha" style={{borderBottom: 'none'}}>
                            <div className="radio-tipo">
                                {['PONTUAL', 'FIXA', 'PARCELADA'].map(t => (
                                    <span key={t}>
                                        <input type="radio" id={`${t}-rec`} name="tipo" value={t} checked={form.tipo === t} onChange={handleChange} />
                                        <label htmlFor={`${t}-rec`}>{t.toLowerCase()}</label>
                                    </span>
                                ))}
                            </div>
                        </div>
                        {form.tipo === 'PARCELADA' && (
                            <div className="input-parcelas linha">
                                <i className="material-icons">reorder</i>
                                <input type="number" name="tempo" placeholder="nº parcelas" min="2" value={form.tempo} onChange={handleChange} required />
                            </div>
                        )}
                        <div className="input-data linha">
                            <i className="material-icons">calendar_today</i>
                            <input type="date" name="data" value={form.data} onChange={handleChange} required />
                        </div>
                    </div>
                    <button type="submit" className="btn-salvar" disabled={loading}>{loading ? 'processando...' : 'salvar'}</button>
                </form>
            </div>
        </div>,
        document.body
    );
}
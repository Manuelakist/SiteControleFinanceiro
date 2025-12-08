import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // <--- O segredo do teletransporte
import { despesaService } from '../../services/despesa.service';
import { categoriaService } from '../../services/categoria.service';
import '../../assets/css/components.css';

export function ModalDespesa({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        categoriaId: '', 
        tipo: 'PONTUAL'
    });

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        if (isOpen) {
            categoriaService.listarCategoriasDespesa(1)
                .then(data => setCategorias(data || []));
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const novaDespesa = {
                descricao: form.descricao,
                valor: parseFloat(form.valor),
                data: form.data,
                tipo: form.tipo,
                conta: { id: 1 },
                categoriaDespesaDTO: { id: form.categoriaId }
            };

            await despesaService.criar(novaDespesa);
            alert('Despesa salva com sucesso!');
            window.location.reload();
            
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar.');
        }
    };

    // Aqui usamos o createPortal para jogar o modal direto no body do site
    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="adc-conteudo" onClick={(e) => e.stopPropagation()}>
                
                <span className="close-btn" onClick={onClose}>&times;</span>
                
                <h3>Nova Despesa</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        
                        {/* Descrição */}
                        <div className="input-desc linha">
                            <i className="material-icons">edit</i>
                            <input 
                                type="text" name="descricao" placeholder="descrição" 
                                value={form.descricao} onChange={handleChange} required 
                            />
                        </div>

                        {/* Valor e Categoria */}
                        <div className="linha-valor">
                            <div className="input-valor linha">
                                <i className="material-icons">attach_money</i>
                                <span className="rs">R$</span>
                                <input 
                                    type="number" name="valor" placeholder="valor" step="0.01"
                                    value={form.valor} onChange={handleChange} required 
                                />
                            </div>
                            <div className="input-categoria linha">
                                <i className="material-icons">category</i>
                                <select name="categoriaId" value={form.categoriaId} onChange={handleChange} required>
                                    <option value="" disabled>Categoria</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tipo (Radio) */}
                        <div className="input-tipo linha" style={{borderBottom: 'none'}}>
                            <div className="radio-tipo">
                                <input 
                                    type="radio" id="pontual-des" name="tipo" value="PONTUAL" 
                                    checked={form.tipo === 'PONTUAL'} onChange={handleChange} 
                                />
                                <label htmlFor="pontual-des">pontual</label>

                                <input 
                                    type="radio" id="fixa-des" name="tipo" value="FIXA" 
                                    checked={form.tipo === 'FIXA'} onChange={handleChange} 
                                />
                                <label htmlFor="fixa-des">fixa</label>

                                <input 
                                    type="radio" id="parcelada-des" name="tipo" value="PARCELADA" 
                                    checked={form.tipo === 'PARCELADA'} onChange={handleChange} 
                                />
                                <label htmlFor="parcelada-des">parcelada</label>
                            </div>
                        </div>

                        {/* Data */}
                        <div className="input-data linha">
                            <i className="material-icons">calendar_today</i>
                            <input 
                                type="date" name="data" 
                                value={form.data} onChange={handleChange} required 
                            />
                        </div>

                    </div>

                    <button type="submit" className="btn-salvar">salvar</button>
                </form>
            </div>
        </div>,
        document.body // <--- O destino do portal
    );
}
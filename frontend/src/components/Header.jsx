import { useState, useEffect, useRef } from 'react';
import '../assets/css/components.css';
import { ModalDespesa } from './modals/ModalDespesa';
import { ModalReceita } from './modals/ModalReceita';
import { ModalOrcamento } from './modals/ModalOrcamento';
import { ModalMeta } from './modals/ModalMeta';
import { ModalConta } from './modals/ModalConta';
import { contaService } from '../services/conta.service';
import { authService } from '../services/auth.service';

/**
 * Componente do Cabeçalho Global (Header).
 * Contém a identificação do utilizador, a funcionalidade de adição rápida de registos (Dropdown) 
 * e o seletor de contexto de conta financeira.
 */
export function Header() {
    const usuario = authService.getUsuarioLogado() || { nome: 'Utilizador' };
    
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef(null);

    const [contas, setContas] = useState([]);
    const [contaSelecionada, setContaSelecionada] = useState('');

    const [showModalDespesa, setShowModalDespesa] = useState(false);
    const [showModalReceita, setShowModalReceita] = useState(false);
    const [showModalOrcamento, setShowModalOrcamento] = useState(false);
    const [showModalMeta, setShowModalMeta] = useState(false);
    
    const [showModalConta, setShowModalConta] = useState(false);
    const [isContaObrigatoria, setIsContaObrigatoria] = useState(false);

    useEffect(() => {
        carregarContas();

        const handleContaMudou = () => carregarContas();
        window.addEventListener('contaMudou', handleContaMudou);
        return () => window.removeEventListener('contaMudou', handleContaMudou);
    }, []);

    /**
     * Sincroniza o estado local de contas com o backend e define a conta ativa em cache.
     * Caso o utilizador não possua contas, força a abertura do modal de criação.
     */
    async function carregarContas() {
        try {
            if (!usuario.id) return;
            const res = await contaService.getContasPorUsuario(usuario.id);
            const lista = res.data || res || [];
            
            setContas(lista);

            if (lista.length === 0) {
                setIsContaObrigatoria(true);
                setShowModalConta(true);
            } else {
                const ativa = contaService.getContaAtivaLocal(lista);
                setContaSelecionada(ativa.id.toString());
                setIsContaObrigatoria(false);
                setShowModalConta(false);
            }
        } catch (error) {
            console.error("Erro na sincronização de contas financeiras:", error);
        }
    }

    /**
     * Interceta a mudança no seletor de contas.
     * Atualiza o contexto global ou abre o modal de criação se a opção "+ Adicionar Conta" for selecionada.
     */
    const handleChangeConta = (e) => {
        const id = e.target.value;
        if (id === 'nova_conta') {
            setIsContaObrigatoria(false);
            setShowModalConta(true);
            setContaSelecionada(contaSelecionada); 
        } else {
            setContaSelecionada(id);
            contaService.setContaAtivaLocal(id);
        }
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuAberto(!menuAberto);
    };

    const handleOpcaoClick = (tipo) => {
        setMenuAberto(false);
        if (tipo === 'Despesa') setShowModalDespesa(true);
        if (tipo === 'Receita') setShowModalReceita(true);
        if (tipo === 'Orçamento') setShowModalOrcamento(true);
        if (tipo === 'Meta') setShowModalMeta(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAberto(false);
            }
        };
        if (menuAberto) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [menuAberto]);

    return (
        <header className="barra">
            <p>Olá, {usuario.nome}</p>
            
            <div className="espaco"></div>
            
            <div className="botoes-nav" ref={menuRef}>
                <button className="adc-btn" onClick={toggleMenu} aria-label="Adicionar Novo Registo">+</button>
                
                {menuAberto && (
                    <div className="options-menu">
                        <div className="option" onClick={() => handleOpcaoClick('Despesa')}><i className="material-icons">trending_down</i><p>despesa</p></div>
                        <div className="option" onClick={() => handleOpcaoClick('Receita')}><i className="material-icons">trending_up</i><p>receita</p></div>
                        <div className="option" onClick={() => handleOpcaoClick('Orçamento')}><i className="material-icons">account_balance_wallet</i><p>orçamento</p></div>
                        <div className="option" onClick={() => handleOpcaoClick('Meta')}><i className="material-icons">savings</i><p>meta</p></div>
                    </div>
                )}
                
                <select 
                    className="select-conta-header"
                    name="select-conta" 
                    value={contaSelecionada} 
                    onChange={handleChangeConta}
                >
                    {contas.map(c => {
                        const nome = c.titulo || 'Conta';
                        const nomeCurto = nome.length > 18 ? nome.substring(0, 18) + '...' : nome;
                        return (
                            <option key={c.id} value={c.id} title={nome}>
                                {nomeCurto}
                            </option>
                        );
                    })}
                    <option value="nova_conta" style={{fontWeight: 'bold', color: 'var(--cor1)'}}>Adicionar Conta</option>
                </select>
            </div>

            <ModalDespesa isOpen={showModalDespesa} onClose={() => setShowModalDespesa(false)} onSave={() => window.dispatchEvent(new Event('contaMudou'))} />
<ModalReceita isOpen={showModalReceita} onClose={() => setShowModalReceita(false)} onSave={() => window.dispatchEvent(new Event('contaMudou'))} />
            <ModalOrcamento isOpen={showModalOrcamento} onClose={() => setShowModalOrcamento(false)} onSave={() => window.dispatchEvent(new Event('contaMudou'))} />
            <ModalMeta isOpen={showModalMeta} onClose={() => setShowModalMeta(false)} onSave={() => window.dispatchEvent(new Event('contaMudou'))} />
            <ModalConta isOpen={showModalConta} onClose={() => setShowModalConta(false)} onSave={carregarContas} obrigatorio={isContaObrigatoria} />
        </header>
    );
}
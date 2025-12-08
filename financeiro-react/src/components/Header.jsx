import { useState, useEffect, useRef } from 'react';
import '../assets/css/components.css';
import { ModalDespesa } from './modals/ModalDespesa'; // <--- Importando o Modal

export function Header() {
    const usuario = JSON.parse(localStorage.getItem('usuario_logado')) || { nome: 'Manuela' };
    
    // Estados do Menu
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef(null);

    // Estado do Modal de Despesa
    const [showModalDespesa, setShowModalDespesa] = useState(false);

    // Função do Menu
    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuAberto(!menuAberto);
    };

    // Lógica do Clique nas Opções
    const handleOpcaoClick = (tipo) => {
        setMenuAberto(false); // Fecha o menu primeiro

        if (tipo === 'Despesa') {
            setShowModalDespesa(true); // Abre o modal de despesa
        } else {
            // Futuramente faremos os outros: Receita, Orçamento...
            alert(`Em breve: Modal de ${tipo}`);
        }
    };

    // Fecha menu ao clicar fora
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
        <div className="barra">
            <p>Olá, {usuario.nome}</p>
            
            <div className="espaco"></div>
            
            <div className="botoes-nav" ref={menuRef}>
                <button 
                    className="adc-btn" 
                    id="optionsButton" 
                    onClick={toggleMenu}
                >
                    +
                </button>
                
                {menuAberto && (
                    <div className="options-menu">
                        <div className="option" onClick={() => handleOpcaoClick('Despesa')}>
                            <i className="material-icons">trending_down</i>
                            <p>despesa</p>
                        </div>
                        <div className="option" onClick={() => handleOpcaoClick('Receita')}>
                            <i className="material-icons">trending_up</i>
                            <p>receita</p>
                        </div>
                        <div className="option" onClick={() => handleOpcaoClick('Orçamento')}>
                            <i className="material-icons">account_balance_wallet</i>
                            <p>orçamento</p>
                        </div>
                        <div className="option" onClick={() => handleOpcaoClick('Meta')}>
                            <i className="material-icons">savings</i>
                            <p>meta</p>
                        </div>
                    </div>
                )}
                
                <select name="select-conta" id="select">
                    <option value="1">Conta 1</option>
                    <option value="2">Poupança</option>
                </select>
            </div>

            {/* --- AQUI ESTÁ O MODAL --- */}
            {/* Ele fica invisível até showModalDespesa ser true */}
            <ModalDespesa 
                isOpen={showModalDespesa} 
                onClose={() => setShowModalDespesa(false)} 
            />
        </div>
    );
}
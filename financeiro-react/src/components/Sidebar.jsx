// src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/components.css';
import logoImg from '../assets/img/logo.png';

export function Sidebar() {
    const location = useLocation();

    // Função para manter a classe 'ativo' funcionando
    const getLinkClass = (path) => {
        return location.pathname === path ? 'ativo' : '';
    };

    return (
        <nav className="menu">
            <div className="conteudo-menu">
                <div className="user">
                    <img src={logoImg} alt="Logo" />
                    <div className="site">
                        <p className="nome">aaaaa</p>
                        <p className="sub">CONTROLE FINANCEIRO</p>
                    </div>
                </div>
                <ul className="sidebar">
                    <li className="item">
                        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                            <i className="fa-solid fa-house"></i>
                            <span>Visão Geral</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/cashflow" className={getLinkClass('/cashflow')}>
                            <i className="material-icons">shopping_cart</i>
                            <span>Fluxo de Caixa</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/budgets" className={getLinkClass('/budgets')}>
                            <i className="material-icons">sell</i>
                            <span>Orçamentos</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/goals" className={getLinkClass('/goals')}>
                            <i className="material-icons">savings</i>
                            <span>Metas</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/reports" className={getLinkClass('/reports')}>
                            <i className="material-icons">equalizer</i>
                            <span>Relatórios</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="logout">
                <button id="logout-btn" onClick={() => {
                    localStorage.removeItem('usuario_logado');
                    window.location.href = '/';
                }}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sair</span>
                </button>
            </div>
        </nav>
    );
}
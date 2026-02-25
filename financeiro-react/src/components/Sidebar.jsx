import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import '../assets/css/components.css';
import logoImg from '../assets/img/logo.png';

/**
 * Componente de navegação lateral.
 * Gere o estado ativo dos links baseado na rota atual e processa o encerramento da sessão.
 */
export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Define a classe CSS baseada na correspondência com a rota ativa.
     * @param {string} path - Caminho da rota para validação.
     */
    const getLinkClass = (path) => {
        return location.pathname === path ? 'ativo' : '';
    };

    /**
     * Executa o processo de logout e redireciona para a página inicial.
     */
    const handleLogout = () => {
        authService.logout();
        navigate('/');
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
                        <Link to="/fluxo-caixa" className={getLinkClass('/fluxo-caixa')}>
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
                <button id="logout-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Sair</span>
                </button>
            </div>
        </nav>
    );
}
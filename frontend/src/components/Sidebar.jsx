import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import '../assets/css/components.css';
import logoImg from '../assets/img/logo.png';

/**
 * Componente de Navegação Lateral (Sidebar).
 * Providencia links de roteamento para as áreas principais do sistema e a função de encerramento de sessão.
 */
export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * Retorna a classe ativa se o caminho atual coincidir com o link da navegação.
     * @param {string} path - O caminho da rota a ser validado.
     * @returns {string} Classe CSS 'ativo' ou string vazia.
     */
    const getLinkClass = (path) => {
        return location.pathname === path ? 'ativo' : '';
    };

    /**
     * Interceta a intenção de logout, solicitando confirmação ao utilizador
     * antes de limpar a sessão e redirecionar para a interface de login.
     */
    const handleLogout = () => {
        if (window.confirm("Deseja realmente encerrar a sessão e sair?")) {
            authService.logout();
            navigate('/');
        }
    };

    return (
        <nav className="menu">
            <div className="conteudo-menu">
                <div className="user">
                    <img src={logoImg} alt="Logotipo do Sistema" />
                    <div className="site">
                        <p className="nome">aaaaa</p>
                        <p className="sub">CONTROLE FINANCEIRO</p>
                    </div>
                </div>
                
                <ul className="sidebar-links">
                    <li className="item">
                        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                            <i className="fa-solid fa-house"></i>
                            <span className="link-text">Visão Geral</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/fluxo-caixa" className={getLinkClass('/fluxo-caixa')}>
                            <i className="material-icons">shopping_cart</i>
                            <span className="link-text">Fluxo de Caixa</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/budgets" className={getLinkClass('/budgets')}>
                            <i className="material-icons">sell</i>
                            <span className="link-text">Orçamentos</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/goals" className={getLinkClass('/goals')}>
                            <i className="material-icons">savings</i>
                            <span className="link-text">Metas</span>
                        </Link>
                    </li>
                    <li className="item">
                        <Link to="/reports" className={getLinkClass('/reports')}>
                            <i className="material-icons">equalizer</i>
                            <span className="link-text">Relatórios</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="logout">
                <button id="logout-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <span className="link-text">Sair</span>
                </button>
            </div>
        </nav>
    );
}
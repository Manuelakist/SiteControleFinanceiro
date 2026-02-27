import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

/**
 * @component ProtectedRoute
 * @description Wrapper de rota que verifica a autenticação do utilizador.
 * Redireciona para o login caso não exista uma sessão ativa.
 */
export function ProtectedRoute({ children }) {
    const user = authService.getUsuarioLogado();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
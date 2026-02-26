import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

/**
 * Componente de proteção de rotas.
 * Redireciona para o login se o utilizador não estiver autenticado.
 */
export function ProtectedRoute({ children }) {
    const usuario = authService.getUsuarioLogado();

    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    return children;
}
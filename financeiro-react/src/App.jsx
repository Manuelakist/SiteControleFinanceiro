import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Overview } from './pages/Dashboard/Overview';
import { FluxoCaixa } from './pages/FluxoCaixa/FluxoCaixa';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

/**
 * Configuração central de rotas da aplicação.
 * Define acessos públicos e privados protegidos pelo ProtectedRoute.
 */
export function App() {
    return (
        <Router>
            <Routes>
                {/* Rota pública */}
                <Route path="/" element={<Login />} />

                {/* Rotas protegidas que compartilham o mesmo Layout (Sidebar/Header) */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Overview />} />
                    <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
                </Route>
            </Routes>
        </Router>
    );
}
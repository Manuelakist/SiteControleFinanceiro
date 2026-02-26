import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Overview } from './pages/Overview';
import { FluxoCaixa } from './pages/FluxoCaixa';
import { Orcamentos } from './pages/Orcamentos';
import { Metas } from './pages/Metas';
import { Relatorios } from './pages/Relatorios';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

/**
 * Configuração central de rotas.
 * Ajustada para corresponder à estrutura física de ficheiros e pastas do projeto.
 */
export function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Overview />} />
                    <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
                    <Route path="/budgets" element={<Orcamentos />} />
                    <Route path="/goals" element={<Metas />} />
                    <Route path="/reports" element={<Relatorios />} />
                </Route>
            </Routes>
        </Router>
    );
}
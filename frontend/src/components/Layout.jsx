import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import '../assets/css/components.css';

/**
 * Componente Wrapper de Layout.
 * Responsável por renderizar a estrutura base da área autenticada da aplicação,
 * integrando a barra de navegação lateral, o cabeçalho superior e o conteúdo dinâmico.
 */
export function Layout() {
    return (
        <>
            <Sidebar />
            <Header />
            <main className="app-container">
                <Outlet />
            </main>
        </>
    );
}
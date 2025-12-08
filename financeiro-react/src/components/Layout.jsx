import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

// Estilo local para simular a classe .container original
// No seu CSS original: margin-left: 18%; width: 100%; (efetivamente)
const containerStyle = {
    marginLeft: '18%', 
    width: '82%', 
    marginTop: '75px', // Altura do Header original
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#EFEFEF',
    minHeight: 'calc(100vh - 75px)'
};

export function Layout() {
    return (
        <>
            <Sidebar />
            <Header />
            {/* Usamos o estilo direto para garantir o posicionamento */}
            <div style={containerStyle}>
                <div className="main-content">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
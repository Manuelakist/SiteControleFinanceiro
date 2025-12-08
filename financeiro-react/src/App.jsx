import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from "./components/Login";
import { Layout } from "./components/Layout";
import { Overview } from "./pages/Overview"; // <--- Importe a nova página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas Protegidas (Dashboard) */}
        <Route element={<Layout />}>
            {/* Use o componente Overview aqui */}
            <Route path="/dashboard" element={<Overview />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
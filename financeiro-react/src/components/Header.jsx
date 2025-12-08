// src/components/Header.jsx
import '../assets/css/components.css'; // Garante que o CSS original seja carregado

export function Header() {
    const usuario = JSON.parse(localStorage.getItem('usuario_logado')) || { nome: 'Manuela' };

    return (
        <div className="barra">
            {/* O 'p' aqui estava desalinhado pq tinha margem padrão do navegador. O reset no index.css resolveu. */}
            <p>Olá, {usuario.nome}</p>
            
            <div className="espaco"></div>
            
            <div className="botoes-nav">
                <button className="adc-btn" id="optionsButton">+</button>
                {/* Removi o menu de opções por enquanto para focar no alinhamento, depois colocamos de volta */}
                
                <select name="select-conta" id="select">
                    <option value="1">Conta 1</option>
                    <option value="2">Poupança</option>
                </select>
            </div>
        </div>
    );
}
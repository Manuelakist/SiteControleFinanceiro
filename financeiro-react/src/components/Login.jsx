import { useState } from 'react';
import { authService } from '../services/auth.service';

import '../assets/css/login.css'; 

// Importa as imagens
// O Vite precisa que as imagens sejam importadas assim para funcionarem no build final
import logoImg from '../assets/img/aaaaa.svg';
import threeChartImg from '../assets/img/threechart.png';

export function Login() {
    // ESTADOS (Variáveis que o React vigia)
    // isRegistroAtivo: controla se o painel roxo está na esquerda ou direita
    const [isRegistroAtivo, setIsRegistroAtivo] = useState(false);
    
    // Dados do formulário de Login
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    // Feedback para o usuário
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    // FUNÇÃO DE LOGIN (Chamada quando clica no botão "Login")
    const handleLogin = async (e) => {
        e.preventDefault(); // Impede a página de recarregar
        setErro('');
        setLoading(true);

        try {
            // Chama o serviço que conecta com o Java
            await authService.login(email, senha);
            
            // Se der certo, redireciona para o Dashboard
            window.location.href = '/dashboard'; 
        } catch (error) {
            // Se der erro (senha errada, etc), mostra na tela
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // A div pai "login-page-wrapper" é importante para o CSS funcionar sem quebrar o resto do site
        <div className="login-page-wrapper">
            
            {/* --- PAINEL ROXO (Overlay) --- 
                A classe 'ativo' é adicionada dinamicamente pelo React quando clicamos nos links
            */}
            <div className={`login-registro ${isRegistroAtivo ? 'ativo' : ''}`} id="overlay">
                <img src={threeChartImg} alt="Decoração" />
            </div>

            {/* --- TELA DE LOGIN (Fica na esquerda) --- */}
            <div className="login">
                <div className="login-tela">
                    <div className="container-login">
                        <div className="logo">
                            <img src={logoImg} alt="logo" className="logo-img" />
                        </div>
                        <p className="texto-login">Faça login na sua conta</p>
                        
                        <form onSubmit={handleLogin}>
                            <input 
                                className="form-control" 
                                type="text" 
                                placeholder="Endereço de email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Atualiza o estado enquanto digita
                                required
                            />
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="**********"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            
                            {/* Mostra mensagem de erro se houver */}
                            {erro && <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{erro}</p>}

                            <button type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Login'}
                            </button>
                        </form>

                        <a className="esq-senha" href="#!">Esqueceu a senha?</a>
                        
                        <p className="login-footer">
                            Ainda não tem uma conta?{' '}
                            {/* Ao clicar aqui, mudamos o estado para TRUE, movendo o painel */}
                            <span 
                                className="text-reset" 
                                id="ir-registro" 
                                onClick={() => setIsRegistroAtivo(true)}
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Registre-se aqui
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="espaco"></div>

            {/* --- TELA DE REGISTRO (Fica na direita) --- */}
            <div className="registro">
                <div className="registro-tela">
                    <div className="container-registro">
                        <div className="logo">
                            <img src={logoImg} alt="logo" className="logo-img" />
                        </div>
                        <p className="texto-registro">Crie sua conta</p>
                        
                        <form>
                            <input className="form-control" type="text" placeholder="Nome completo" />
                            <input className="form-control" type="text" placeholder="Endereço de email" />
                            <input className="form-control" type="password" placeholder="**********" />
                            <button type="button">Cadastrar</button>
                        </form>
                        
                        <p className="registro-footer">
                            Já tem uma conta?{' '}
                            {/* Ao clicar aqui, mudamos o estado para FALSE, voltando o painel */}
                            <span 
                                className="text-reset" 
                                id="ir-login"
                                onClick={() => setIsRegistroAtivo(false)}
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Faça login aqui
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
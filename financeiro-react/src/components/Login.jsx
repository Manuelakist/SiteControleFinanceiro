import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

import '../assets/css/login.css'; 

import logoImg from '../assets/img/aaaaa.svg';
import threeChartImg from '../assets/img/threechart.png';

export function Login() {
    // Hook de roteamento do React Router (evita o reload completo da página)
    const navigate = useNavigate();

    // Controle de UI (Alternância entre Login e Registro)
    const [isRegistroAtivo, setIsRegistroAtivo] = useState(false);
    
    // --- ESTADOS DO FORMULÁRIO DE LOGIN ---
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroLogin, setErroLogin] = useState('');
    const [loadingLogin, setLoadingLogin] = useState(false);

    // --- ESTADOS DO FORMULÁRIO DE REGISTRO ---
    const [nomeReg, setNomeReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [senhaReg, setSenhaReg] = useState('');
    const [erroReg, setErroReg] = useState('');
    const [sucessoReg, setSucessoReg] = useState('');
    const [loadingReg, setLoadingReg] = useState(false);

    /**
     * Processa a autenticação do usuário.
     * Em caso de sucesso, armazena o contexto e navega para o Dashboard.
     */
    const handleLogin = async (e) => {
        e.preventDefault(); 
        setErroLogin('');
        setLoadingLogin(true);

        try {
            await authService.login(email, senha);
            navigate('/dashboard'); // Substitui window.location.href (Single Page Application approach)
        } catch (error) {
            setErroLogin(error.message || 'Erro ao efetuar login. Verifique suas credenciais.');
        } finally {
            setLoadingLogin(false);
        }
    };

    /**
     * Processa a criação de uma nova conta de usuário.
     * Requer a implementação do método 'registrar' no authService conectando ao endpoint POST do Spring Boot.
     */
    const handleRegistro = async (e) => {
        e.preventDefault();
        setErroReg('');
        setSucessoReg('');
        setLoadingReg(true);

        try {
            // Nota: Você precisará adicionar o método registrar() no auth.service.js
            // Ex: await api.post('/usuario', { nome: nomeReg, email: emailReg, senha: senhaReg })
            await authService.registrar({ nome: nomeReg, email: emailReg, senha: senhaReg });
            
            setSucessoReg('Conta criada com sucesso! Faça login.');
            
            // Limpa o formulário e retorna visualmente para a tela de login
            setNomeReg('');
            setEmailReg('');
            setSenhaReg('');
            setTimeout(() => setIsRegistroAtivo(false), 2000); 

        } catch (error) {
            setErroReg(error.message || 'Erro ao criar conta. Tente novamente mais tarde.');
        } finally {
            setLoadingReg(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            
            {/* PAINEL DE TRANSIÇÃO (Overlay) */}
            <div className={`login-registro ${isRegistroAtivo ? 'ativo' : ''}`} id="overlay">
                <img src={threeChartImg} alt="Decoração Gráfico" />
            </div>

            {/* --- SEÇÃO DE LOGIN --- */}
            <div className="login">
                <div className="login-tela">
                    <div className="container-login">
                        <div className="logo">
                            <img src={logoImg} alt="Logotipo Site Controle Financeiro" className="logo-img" />
                        </div>
                        <p className="texto-login">Faça login na sua conta</p>
                        
                        <form onSubmit={handleLogin}>
                            <input 
                                className="form-control" 
                                type="email" 
                                placeholder="Endereço de email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            
                            {/* Feedback visual de erro para o Login */}
                            {erroLogin && <p style={{ color: '#d9534f', fontSize: '14px', marginTop: '5px', textAlign: 'center' }}>{erroLogin}</p>}

                            <button type="submit" disabled={loadingLogin}>
                                {loadingLogin ? 'Autenticando...' : 'Login'}
                            </button>
                        </form>

                        <a className="esq-senha" href="#!">Esqueceu a senha?</a>
                        
                        <p className="login-footer">
                            Ainda não tem uma conta?{' '}
                            <span 
                                className="text-reset" 
                                id="ir-registro" 
                                onClick={() => {
                                    setIsRegistroAtivo(true);
                                    setErroLogin(''); // Limpa erros ao trocar de aba
                                }}
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                role="button"
                            >
                                Registre-se aqui
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="espaco"></div>

            {/* --- SEÇÃO DE REGISTRO --- */}
            <div className="registro">
                <div className="registro-tela">
                    <div className="container-registro">
                        <div className="logo">
                            <img src={logoImg} alt="Logotipo Site Controle Financeiro" className="logo-img" />
                        </div>
                        <p className="texto-registro">Crie sua conta</p>
                        
                        <form onSubmit={handleRegistro}>
                            <input 
                                className="form-control" 
                                type="text" 
                                placeholder="Nome completo" 
                                value={nomeReg}
                                onChange={(e) => setNomeReg(e.target.value)}
                                required
                            />
                            <input 
                                className="form-control" 
                                type="email" 
                                placeholder="Endereço de email" 
                                value={emailReg}
                                onChange={(e) => setEmailReg(e.target.value)}
                                required
                            />
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="Crie uma senha" 
                                value={senhaReg}
                                onChange={(e) => setSenhaReg(e.target.value)}
                                minLength="6"
                                required
                            />

                            {/* Feedbacks visuais para o Registro */}
                            {erroReg && <p style={{ color: '#d9534f', fontSize: '14px', marginTop: '5px', textAlign: 'center' }}>{erroReg}</p>}
                            {sucessoReg && <p style={{ color: '#5cb85c', fontSize: '14px', marginTop: '5px', textAlign: 'center' }}>{sucessoReg}</p>}

                            <button type="submit" disabled={loadingReg}>
                                {loadingReg ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </form>
                        
                        <p className="registro-footer">
                            Já tem uma conta?{' '}
                            <span 
                                className="text-reset" 
                                id="ir-login"
                                onClick={() => {
                                    setIsRegistroAtivo(false);
                                    setErroReg('');
                                    setSucessoReg('');
                                }}
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                role="button"
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
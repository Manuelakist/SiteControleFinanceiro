import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import '../assets/css/login.css'; 
import logoImg from '../assets/img/aaaaa.svg';
import threeChartImg from '../assets/img/threechart.png';

/**
 * @component Login
 * @description Componente de autenticação que gere os estados de acesso e criação de conta.
 * Possui uma interface dinâmica com transição lateral entre os formulários.
 */
export function Login() {
    const navigate = useNavigate();
    const [isRegistroAtivo, setIsRegistroAtivo] = useState(false);
    
    // Estados do Formulário de Login
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroLogin, setErroLogin] = useState('');
    const [loadingLogin, setLoadingLogin] = useState(false);

    // Estados do Formulário de Registro
    const [nomeReg, setNomeReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [senhaReg, setSenhaReg] = useState('');
    const [erroReg, setErroReg] = useState('');
    const [sucessoReg, setSucessoReg] = useState('');
    const [loadingReg, setLoadingReg] = useState(false);

    /**
     * @function handleLogin
     * @description Realiza o processo de autenticação via authService.
     * @param {Event} e - Evento de submissão do formulário.
     */
    const handleLogin = async (e) => {
        e.preventDefault(); 
        setErroLogin('');
        setLoadingLogin(true);
        try {
            await authService.login(email, senha);
            navigate('/dashboard');
        } catch (error) {
            setErroLogin(error.message || 'Credenciais inválidas.');
        } finally {
            setLoadingLogin(false);
        }
    };

    /**
     * @function handleRegistro
     * @description Efetua o cadastro de um novo utilizador no sistema.
     * @param {Event} e - Evento de submissão do formulário.
     */
    const handleRegistro = async (e) => {
        e.preventDefault();
        setErroReg('');
        setSucessoReg('');
        setLoadingReg(true);
        try {
            await authService.registrar({ nome: nomeReg, email: emailReg, senha: senhaReg });
            setSucessoReg('Conta criada com sucesso! Redirecionando para o login...');
            setNomeReg(''); setEmailReg(''); setSenhaReg('');
            
            // Retorna ao painel de login após sucesso
            setTimeout(() => setIsRegistroAtivo(false), 2000); 
        } catch (error) {
            setErroReg(error.message || 'Erro ao criar conta. Verifique os dados.');
        } finally {
            setLoadingReg(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            {/* Painel de Transição Lateral (Overlay Roxo) */}
            <div className={`login-registro ${isRegistroAtivo ? 'ativo' : ''}`} id="overlay">
                <img src={threeChartImg} alt="Decoração" />
            </div>

            {/* Coluna de Login */}
            <div className="login">
                <div className="login-tela">
                    <div className="container-login">
                        <div className="logo"><img src={logoImg} alt="Logo" className="logo-img" /></div>
                        <p className="texto-login">Acesse sua conta</p>
                        <form onSubmit={handleLogin}>
                            <input 
                                className="form-control" 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="Senha" 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required 
                            />
                            {erroLogin && <p className="error-msg">{erroLogin}</p>}
                            <button type="submit" disabled={loadingLogin}>
                                {loadingLogin ? 'Autenticando...' : 'Entrar'}
                            </button>
                        </form>
                        <a className="esq-senha" href="#!">Esqueceu a senha?</a>
                        <p className="login-footer">Não tem uma conta?{' '}
                            <span onClick={() => { setIsRegistroAtivo(true); setErroLogin(''); }}>Registre-se</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="espaco"></div>

            {/* Coluna de Registro */}
            <div className="registro">
                <div className="registro-tela">
                    <div className="container-registro">
                        <div className="logo"><img src={logoImg} alt="Logo" className="logo-img" /></div>
                        <p className="texto-registro">Crie sua conta</p>
                        <form onSubmit={handleRegistro}>
                            <input 
                                className="form-control" 
                                type="text" 
                                placeholder="Nome Completo" 
                                value={nomeReg} 
                                onChange={(e) => setNomeReg(e.target.value)} 
                                required 
                            />
                            <input 
                                className="form-control" 
                                type="email" 
                                placeholder="Email" 
                                value={emailReg} 
                                onChange={(e) => setEmailReg(e.target.value)} 
                                required 
                            />
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="Senha" 
                                value={senhaReg} 
                                onChange={(e) => setSenhaReg(e.target.value)} 
                                minLength="6" 
                                required 
                            />
                            {erroReg && <p className="error-msg">{erroReg}</p>}
                            {sucessoReg && <p className="success-msg">{sucessoReg}</p>}
                            <button type="submit" disabled={loadingReg}>
                                {loadingReg ? 'Processando...' : 'Cadastrar'}
                            </button>
                        </form>
                        <p className="registro-footer">Já possui conta?{' '}
                            <span onClick={() => { setIsRegistroAtivo(false); setErroReg(''); setSucessoReg(''); }}>Faça Login</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
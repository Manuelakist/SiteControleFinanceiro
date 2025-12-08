import { useState } from 'react';
import { authService } from '../sevices/auth.service';

import '../assets/css/login.css';

import logoImg from '../assets/img/aaaaa.svg';
import threeChartImg from '../assets/img/threechart.png';

export function Login() {
    const [isRegistroAtivo, setIsRegistroAtivo] = useState(false);
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.login(email, senha);
            alert("Login realizado com sucesso!"); 
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Overlay Roxo com a Imagem */}
            <div className={`login-registro ${isRegistroAtivo ? 'ativo' : ''}`} id="overlay">
                <img src={threeChartImg} alt="Decoração" />
            </div>

            {/* Tela de Login (Esquerda) */}
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
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input 
                                className="form-control" 
                                type="password" 
                                placeholder="**********"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Login'}
                            </button>
                        </form>

                        <a className="esq-senha" href="#!">Esqueceu a senha?</a>
                        
                        <p className="login-footer">
                            Ainda não tem uma conta?{' '}
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

            {/* Tela de Registro (Direita) */}
            <div className="registro">
                <div className="registro-tela">
                    <div className="container-registro">
                        <div className="logo">
                            <img src={logoImg} alt="logo" className="logo-img" />
                        </div>
                        <p className="texto-registro">Crie sua conta</p>
                        
                        <form action="">
                            <input className="form-control" type="text" placeholder="Nome completo" />
                            <input className="form-control" type="text" placeholder="Endereço de email" />
                            <input className="form-control" type="password" placeholder="**********" />
                            <button type="button">Cadastrar</button>
                        </form>
                        
                        <p className="registro-footer">
                            Já tem uma conta?{' '}
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
        </>
    );
}
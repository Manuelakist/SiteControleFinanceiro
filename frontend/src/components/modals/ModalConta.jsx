import { useState } from 'react';
import { createPortal } from 'react-dom';
import { contaService } from '../../services/conta.service';
import { authService } from '../../services/auth.service';
import '../../assets/css/components.css';

export function ModalConta({ isOpen, onClose, onSave, obrigatorio }) {
    const [nomeBanco, setNomeBanco] = useState('');
    const [saldo, setSaldo] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            
            // 1. Previne erro caso estejas a testar sem passar pela página de Login real
            const usuario = authService.getUsuarioLogado() || { id: 1, nome: 'Manuela' };
            
            // 2. Prepara o objeto. 
            // ⚠️ ATENÇÃO: Se o erro persistir, o teu Java pode estar à espera de outro nome!
            // Tenta mudar 'usuarioDTO' para 'usuario' ou 'idUsuario: usuario.id'
            const dadosNovaConta = {
                titulo: nomeBanco,
                saldo: parseFloat(saldo) || 0,
                usuarioDTO: { id: usuario.id } 
            };

            console.log("A enviar para o backend:", dadosNovaConta);

            const novaConta = await contaService.adicionarConta(dadosNovaConta);

            const idNovaConta = novaConta.data?.id || novaConta.id;
            
            if (idNovaConta) {
                contaService.setContaAtivaLocal(idNovaConta);
            }

            onSave(); 
            if (!obrigatorio) onClose(); 
            
            // Limpa os campos depois de criar
            setNomeBanco('');
            setSaldo('');
        } catch (error) {
            console.error("Erro completo ao criar conta:", error);
            alert("Não foi possível criar a conta. Verifica o Console (F12) para ver o erro exato do backend.");
        } finally {
            setLoading(false);
        }
    }

    return createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '320px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                {!obrigatorio && <span onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '24px', cursor: 'pointer', color: '#aaa' }}>&times;</span>}
                
                <h2 style={{ marginTop: 0, marginBottom: '5px', color: 'var(--cor4)', fontSize: '1.4rem' }}>
                    {obrigatorio ? 'Bem-vinda!' : 'Nova Conta'}
                </h2>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
                    {obrigatorio ? 'Para começar a usar o sistema, crie a sua primeira carteira ou conta bancária.' : 'Adicione uma nova origem de fundos.'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cor4)', display: 'block', marginBottom: '5px' }}>Nome da Conta/Banco</label>
                        <input type="text" value={nomeBanco} onChange={e => setNomeBanco(e.target.value)} placeholder="Ex: Nubank, Carteira..." required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cor4)', display: 'block', marginBottom: '5px' }}>Saldo Inicial Atual</label>
                        <input type="number" step="0.01" value={saldo} onChange={e => setSaldo(e.target.value)} placeholder="0.00" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' }} />
                    </div>

                    <button type="submit" disabled={loading} style={{ background: 'var(--cor1)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                        {loading ? 'A criar...' : 'Criar Conta'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
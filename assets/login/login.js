document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validação simples (apenas para exemplo)
    if (username === 'admin' && password === '1234') {
        // Redireciona para a tela principal
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error-message').textContent = 'Usuário ou senha incorretos!';
    }
});

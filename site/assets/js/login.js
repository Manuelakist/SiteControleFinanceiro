
    document.getElementById('ir-registro').addEventListener('click', function() {
        document.getElementById('overlay').classList.add('ativo');
    })

    document.getElementById('ir-login').addEventListener('click', function() {
        document.getElementById('overlay').classList.remove('ativo');
    })



function validarLogin() {

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('formEmail').value;
        const password = document.getElementById('formSenha').value;
        
        if (username === 'admin' && password === '1234') {
            window.location.href = 'dashboard.html';
        } else {
            alert("Usuário ou senha incorretos");
        }
    });

}

validarLogin();



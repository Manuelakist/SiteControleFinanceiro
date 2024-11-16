function loadReportsCharts() {
    // Seleciona todos os radio buttons e os canvases
    const radios = document.querySelectorAll('input[name="radioGrafs"]');
    const canvasBalGeral = document.getElementById('balGeral');
    const canvasBalDespesas = document.getElementById('balDespesas');
    const canvasBalReceitas = document.getElementById('balReceitas');

    // Função para exibir o gráfico com base na opção selecionada
    function mostrarGrafico() {
        // Oculta todos os gráficos
        canvasBalGeral.style.display = 'none';
        canvasBalDespesas.style.display = 'none';
        canvasBalReceitas.style.display = 'none';

        // Mostra o gráfico correspondente ao radio button selecionado
        const graficoSelecionado = document.querySelector('input[name="radioGrafs"]:checked').value;
        document.getElementById(graficoSelecionado).style.display = 'block';
    }

    // Adiciona o evento 'change' aos radio buttons
    radios.forEach(radio => {
        radio.addEventListener('change', mostrarGrafico);
    });

    // Exibe o gráfico inicial
    mostrarGrafico();

}

function carregarGraficoLinha() {

    

}
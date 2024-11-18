async function loadReportsCharts() {
    const radios = document.querySelectorAll('input[name="radioGrafs"]');
    const canvasBalGeral = document.getElementById('balGeral');
    const canvasBalDespesas = document.getElementById('balDespesas');
    const canvasBalReceitas = document.getElementById('balReceitas');

    // Função para exibir o gráfico com base na opção selecionada
    async function mostrarGrafico() {
        canvasBalGeral.style.display = 'none';
        canvasBalDespesas.style.display = 'none';
        canvasBalReceitas.style.display = 'none';
    
        const graficoSelecionado = document.querySelector('input[name="radioGrafs"]:checked').value;
        document.getElementById(graficoSelecionado).style.display = 'block';
    
        const percentual = document.getElementById("percentualGeral");
        const maximo = document.getElementById("valorMaximo");
        const mesMaximo = document.getElementById("mesMaximo");
        const minimo = document.getElementById("valorMinimo");
        const mesMinimo = document.getElementById("mesMinimo");
        const medio = document.getElementById("valorMedio");
    
        if (graficoSelecionado === "balGeral") {
            const receitas = await somaReceitasPorMes();
            const despesas = await somaDespesasPorMes();
            const diferencaMensal = calcularDiferencaMensal(receitas, despesas);
    
            const max = calcularMaximo(diferencaMensal);
            const min = calcularMinimo(diferencaMensal);
    
            percentual.textContent = calcularDiferencaPercentualAtual(diferencaMensal).toFixed(1) + "%";
            maximo.textContent = "R$ " + max.valor;
            mesMaximo.textContent = max.mes;
            minimo.textContent = "R$ " + min.valor;
            mesMinimo.textContent = min.mes;
            medio.textContent = "R$ " + calcularMedia(diferencaMensal).toFixed(2);
        } else if (graficoSelecionado === "balDespesas") {
            const despesas = await somaDespesasPorMes();
            const max = calcularMaximo(despesas);
            const min = calcularMinimo(despesas);
    
            percentual.textContent = calcularDiferencaPercentualAtual(despesas).toFixed(1) + "%";
            maximo.textContent = "R$ " + max.valor;
            mesMaximo.textContent = max.mes;
            minimo.textContent = "R$ " + min.valor;
            mesMinimo.textContent = min.mes;
            medio.textContent = "R$ " + calcularMedia(despesas).toFixed(2);
        } else if (graficoSelecionado === "balReceitas") {
            const receitas = await somaReceitasPorMes();
            const max = calcularMaximo(receitas);
            const min = calcularMinimo(receitas);
    
            percentual.textContent = calcularDiferencaPercentualAtual(receitas).toFixed(1) + "%";
            maximo.textContent = "R$ " + max.valor;
            mesMaximo.textContent = max.mes;
            minimo.textContent = "R$ " + min.valor;
            mesMinimo.textContent = min.mes;
            medio.textContent = "R$ " + calcularMedia(receitas).toFixed(2);
        }
    }
    

    radios.forEach(radio => {
        radio.addEventListener('change', mostrarGrafico);
    });

    mostrarGrafico();  // Exibe o gráfico inicial
}

async function carregarGraficoLinha() {
    // Aguarda as promessas de soma de despesas e receitas
    const somaDespesas = await somaDespesasPorMes();
    const somaReceitas = await somaReceitasPorMes();
    const diferencaMensal = calcularDiferencaMensal(somaReceitas, somaDespesas);

    // Chama as funções para gerar os relatórios
    createDespesasAnoReports(somaDespesas);
    createReceitasAnoReports(somaReceitas);
    createBalancoAnoReports(diferencaMensal);

    console.log(somaDespesas);
    console.log(somaReceitas);
    console.log(diferencaMensal);
}

async function somaDespesasPorMes() {
    const { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoAno();
    const somaPorMes = Array(12).fill(0);

    const response = await fetch(`http://localhost:8080/despesa/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`);
    if (!response.ok) {
        throw new Error("Erro ao buscar despesas");
    }
    const despesas = await response.json();

    despesas.forEach(despesa => {
        const data = new Date(despesa.data);
        const mes = data.getMonth();
        somaPorMes[mes] += despesa.valor;
    });

    return somaPorMes;
}

async function somaReceitasPorMes() {
    const { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoAno();
    const somaPorMes = Array(12).fill(0);

    const response = await fetch(`http://localhost:8080/receita/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`);
    if (!response.ok) {
        throw new Error("Erro ao buscar receitas");
    }
    const receitas = await response.json();

    receitas.forEach(receita => {
        const data = new Date(receita.data);
        const mes = data.getMonth();
        somaPorMes[mes] += receita.valor;
    });

    return somaPorMes;
}

function calcularDiferencaMensal(receitasPorMes, despesasPorMes) {
    const saldoMensal = receitasPorMes.map((receita, index) => {
        const despesa = despesasPorMes[index];
        return receita - despesa;
    });

    return saldoMensal;
}

function calcularDiferencaPercentualAtual(arr) {
    const mesAtual = new Date().getMonth();  // Pega o mês atual (0 a 11)
    if (mesAtual === 0) {
        return null;  // Não há mês anterior para janeiro
    }

    const valorAtual = arr[mesAtual];
    const valorAnterior = arr[mesAtual - 1];

    const diferencaPercentual = ((valorAtual - valorAnterior) / valorAnterior) * 100;
    return diferencaPercentual;
}

function calcularMedia(arr) {
    const soma = arr.reduce((acc, valor) => acc + valor, 0);
    return soma / arr.length;
}

function calcularMaximo(arr) {
    const maxValor = Math.max(...arr);
    const indexMes = arr.indexOf(maxValor);
    return {
        valor: maxValor,
        mes: obterNomeMes(indexMes)
    };
}

function calcularMinimo(arr) {
    const minValor = Math.min(...arr);
    const indexMes = arr.indexOf(minValor);
    return {
        valor: minValor,
        mes: obterNomeMes(indexMes)
    };
}

function loadBudgetChart() {

    

}

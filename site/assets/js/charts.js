function createChartsOverview() {
    const ctxReceitas = document.getElementById('overviewOrc').getContext('2d');
    const grafico1 = new Chart(ctxReceitas, {
        type: 'doughnut',
        data: {
            labels: ['lazer', 'contas', 'mercado', 'transporte'],
            datasets: [{
                label: 'gastos',
                data: [325.00, 1250.00, 233.90, 80.54],
                backgroundColor: ['#EFEFEF', '#1B1239', '#8060F6', '#A594F9'],
                hoverOffset: 8,
                radius: 90,
                borderWidth: 0,
                cutout: 70
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true, // Usar bolinhas em vez de linhas
                        pointStyle: 'circle', // Estilo da bolinha
                        boxWidth: 8, // Largura da bolinha
                        boxHeight: 8,
                        padding: 20, // Espaçamento entre itens da legenda
                        font: {
                            size: 14
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    
}

function createLineChartOverview(dados) {

    const ctxRelatorio = document.getElementById('overviewRel').getContext('2d');
    const scalesConfig = configurarEscalas(dados);

    const grafico2 = new Chart(ctxRelatorio, {
        type: 'line',
        data: {
            labels: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
            datasets: [{
                label: 'balanço geral',
                data: dados,
                fill: false,
                borderColor: '#8060F6',
                tension: 0.05,
                pointHitRadius: 20,
                pointRadius: 0,
                borderWidth: 8,
                pointHoverColor: '#8060F6',
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: scalesConfig,
            plugins: {
                legend: {
                    display: false,
                }
            },
            layout: {
                padding: {
                    bottom: 0
                }
            }
        }
    });

}

let graficoMeta;
let somaGlobal = 0;
let totalGlobal = 0;

Chart.register({
    id: 'centerText',
    beforeDraw: (chart) => {
        if (chart.canvas.id === 'grafMeta') {
            const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
            ctx.save();
            const percentage = ((somaGlobal / totalGlobal) * 100).toFixed(1); // Calcula a porcentagem
            ctx.font = 'bold 40px Montserrat'; // Define a fonte e o tamanho
            ctx.fillStyle = '#000'; // Cor do texto
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, left + width / 2, top + height / 2);
            ctx.restore();
        }
    }
});


function createChartsGoals(soma, total) {

    somaGlobal = soma;
    totalGlobal = total;

    let restante = (total - soma);

    if (soma >= total) {
        restante = 0;
    }

    if (graficoMeta) {
        graficoMeta.destroy();
    }

    // Criação do gráfico de metas
    const ctxMeta = document.getElementById('grafMeta').getContext('2d');
    graficoMeta = new Chart(ctxMeta, {
        type: 'doughnut',
        data: {
            labels: ['valor reservado', 'valor restante'],
            datasets: [{
                label: 'progresso',
                data: [soma, restante],
                backgroundColor: ['#8060F6', '#EFEFEF'],
                hoverOffset: 8,
                cutout: "85%"
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function configurarEscalas(dados) {
    const minValue = Math.min(...dados);
    const maxValue = Math.max(...dados);
    const padding = 500;
    const minY = minValue - padding > 0 ? minValue - padding : 0;
    const maxY = maxValue + padding;
    const range = maxY - minY;
    let stepSize;

    if (range <= 5000) {
        stepSize = 500;
    } else if (range <= 20000) {
        stepSize = 2000;
    } else {
        stepSize = 5000;
    }

    return {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            grid: {
                display: false
            },
            beginAtZero: true,
            min: minY,
            max: maxY,
            ticks: {
                stepSize: stepSize,
                callback: function (value) {
                    if (value >= 1000) {
                        return 'R$ ' + (value / 1000).toFixed(1) + 'k'; 
                    }
                    return 'R$ ' + value;
                }
            }
        }
    };
}

function createDespesasAnoReports(dados) {

    const ctxRelatorio1 = document.getElementById('balDespesas').getContext('2d');
    const scalesConfig = configurarEscalas(dados);

    const grafico4 = new Chart(ctxRelatorio1, {
        type: 'line',
        data: {
            labels: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
            datasets: [{
                label: 'balanço geral',
                data: dados,
                fill: true,
                backgroundColor: 'rgba(240, 14, 0, 0.7)',
                borderColor: '#F00E00',
                tension: 0.1,
                pointHitRadius: 20,
                pointRadius: 0,
                pointHoverColor: '#F00E00',
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: scalesConfig,
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });

}

function createReceitasAnoReports(dados) {

    const ctxRelatorio2 = document.getElementById('balReceitas').getContext('2d');
    const scalesConfig = configurarEscalas(dados);

    const grafico5 = new Chart(ctxRelatorio2, {
        type: 'line',
        data: {
            labels: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
            datasets: [{
                label: 'receitas',
                data: dados,
                fill: true,
                backgroundColor: 'rgba(182, 249, 201, 0.7)',
                borderColor: '#b6f9c9',
                tension: 0.1,
                pointHitRadius: 20,
                pointRadius: 0,
                pointHoverColor: '#b6f9c9',
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: scalesConfig,
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });

}

function createBalancoAnoReports(dados) {

    const ctxRelatorio3 = document.getElementById('balGeral').getContext('2d');
    const scalesConfig = configurarEscalas(dados);

    const grafico6 = new Chart(ctxRelatorio3, {
        type: 'line', 
        data: {
            labels: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
            datasets: [{
                label: 'Balanço Geral',
                data: dados,
                fill: true, 
                backgroundColor: 'rgba(128, 96, 246, 0.9)', 
                borderColor: '#8060F6',
                tension: 0.1, 
                pointHitRadius: 20,
                pointRadius: 0,
                borderWidth: 2,
                pointHoverColor: '#8060F6',
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: scalesConfig,
            plugins: {
                legend: {
                    display: false, 
                }
            }
        }
    });

}

function createChartsReports() {
    

    

    

    const ctxCategorias = document.getElementById('pizzaOrc').getContext('2d');
    const grafico1 = new Chart(ctxCategorias, {
        type: 'pie',
        data: {
            labels: ['lazer', 'contas', 'mercado', 'transporte'],
            datasets: [{
                label: 'gastos',
                data: [325.00, 1250.00, 233.90, 80.54],
                backgroundColor: ['#EFEFEF', '#1B1239', '#8060F6', '#A594F9'],
                hoverOffset: 8,
                borderWidth: 0,
                radius: 150
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true, // Usar bolinhas em vez de linhas
                        pointStyle: 'circle', // Estilo da bolinha
                        boxWidth: 8, // Largura da bolinha
                        boxHeight: 8,
                        padding: 20, // Espaçamento entre itens da legenda
                        font: {
                            size: 14
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    const ctxBarras = document.getElementById('barraOrc').getContext('2d');
    const grafico7 = new Chart(ctxBarras, {
        type: 'bar',
        data: {
            labels: ['mercado', 'contas', 'lazer', 'transporte'], // Nomes das categorias
            datasets: [
                {
                    label: 'orçamento',
                    data: [3000, 1500, 2000, 2500], // Valores do orçamento
                    backgroundColor: '#8060F6', // Cor das barras do orçamento
                },
                {
                    label: 'despesas',
                    data: [2500, 1200, 1800, 3000], // Valores das despesas
                    backgroundColor: '#1B1239', // Cor das barras das despesas
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: {
                        display: false
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value; // Formatação dos valores no eixo Y
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // const despesasOutubro = [
    //     150.50, 300.20, 450.75, 1200.00, 50.30, 600.00, 800.00, 
    //     950.10, 250.00, 400.00, 3000.00, 100.50, 200.25, 
    //     80.75, 1500.00, 2000.00, 120.90, 750.40, 320.60, 
    //     1300.00, 190.80, 600.50, 700.10, 250.00, 50.00
    // ];

    // // Configurar os intervalos do histograma
    // const faixas = [0, 100, 200, 500, 1000, 2000, 5000, 10000];
    // const contagem = new Array(faixas.length - 1).fill(0);

    // // Contar quantas despesas estão em cada faixa
    // despesasOutubro.forEach(despesa => {
    //     for (let i = 0; i < faixas.length - 1; i++) {
    //         if (despesa >= faixas[i] && despesa < faixas[i + 1]) {
    //             contagem[i]++;
    //             break;
    //         }
    //     }
    // });

    // const ctx = document.getElementById('histograma').getContext('2d');
    // const histograma = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: faixas.slice(0, -1).map((valor, index) => {
    //             return valor + ' - ' + faixas[index + 1];
    //         }),
    //         datasets: [{
    //             label: 'Número de Despesas',
    //             data: contagem,
    //             backgroundColor: '#8060F6'
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         scales: {
    //             x: {
    //                 title: {
    //                     display: true,
    //                     text: 'Faixas de Valor (R$)'
    //                 },
    //                 grid: {
    //                     display: false
    //                 }
    //             },
    //             y: {
    //                 title: {
    //                     display: false
    //                 },
    //                 beginAtZero: true,
    //                 min: 0,
    //                 grid: {
    //                     display: false
    //                 }
    //             }
    //         },
    //         plugins: {
    //             legend: {
    //                 display: false
    //             }
    //         }
    //     }
    // });
    

}
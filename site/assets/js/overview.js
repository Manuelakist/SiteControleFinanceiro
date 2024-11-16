function atualizarInfos() {
    const boxSaldo = document.getElementById("overviewSaldo");
    const boxDisponivel = document.getElementById("overviewDisponivel");
    const boxGasto = document.getElementById("overviewGasto");
    const boxReceita = document.getElementById("overviewReceita");

    const { primeiroDia, ultimoDia } = obterMesAtual();

    fetch(`http://localhost:8080/conta/${idConta}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar conta");
            }
            return response.json();
        })
        .then(conta => {
            boxSaldo.textContent = `${"R$ " + conta.saldo}`;
        })
        .catch(error => {
            console.error("Erro: ", error);
        });

    fetch(`http://localhost:8080/despesa/soma/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar soma");
            }
            return response.json();
        })
        .then(soma => {
            boxGasto.textContent = "R$ " +  soma;
        })
        .catch(error => {
            console.error("Erro: ", error);
        });

    fetch(`http://localhost:8080/receita/soma/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar soma");
            }
            return response.json();
        })
        .then(soma => {
            boxReceita.textContent = "R$ " + soma;
        })
        .catch(error => {
            console.error("Erro: ", error);
        });
}

function listarResumoDespesas() {

    const containerTabela = document.getElementById("tabelaResumoDespesas");
    const filtroDespesas = document.getElementById("filtroResumoDespesas").value; 
    const filtroTipo = document.querySelector("input[name='filtroResumoDespesas']:checked").value; 

    let { primeiroDia, ultimoDia } = obterMesAtual();

    let urlResumoDespesas;

    if (filtroDespesas === "todas" || filtroDespesas === "") {
        urlResumoDespesas = `http://localhost:8080/despesa/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    } else {
        urlResumoDespesas = `http://localhost:8080/despesa/categoria/${filtroDespesas}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    }

    fetch(urlResumoDespesas)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar despesas");
            }
            return response.json();
        })
        .then(despesas => {
            containerTabela.innerHTML = '';

            const despesasFiltradasPorTipo = despesas.filter(despesa => {
                return filtroTipo === "todas" || despesa.tipo === filtroTipo;
            });

            despesasFiltradasPorTipo.forEach(despesa => {
                const linha = document.createElement("div");
                linha.classList.add("linha");

                let cor = "cor1";
                if (despesa.tipo === "fixa") {
                    cor = "cor2";
                } else if (despesa.tipo === "parcelada") {
                    cor = "cor3";
                }

                linha.innerHTML = `
                    <div class="cor ${cor}"></div>
                    <p class="titulo">${despesa.descricao}</p>
                    <p class="valor">R$ ${despesa.valor}</p>
                    <p class="categoria">${despesa.categoriaDespesaDTO.nome}</p>
                `;

                containerTabela.appendChild(linha);
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            containerTabela.innerHTML = "<p>Erro ao carregar despesas</p>";
        });

}

function listarResumoDespesasFiltroTipo() {
    document.querySelectorAll("input[name='filtroResumoDespesas']").forEach(input => {
        input.addEventListener('change', function () {
            listarResumoDespesas(); 
        });
    });
}

function configurarFiltrosResumoDespesas() {
    document.getElementById("filtroResumoDespesas").addEventListener('change', function () {
        listarResumoDespesas(); 
    });

    listarResumoDespesasFiltroTipo();
}

function listarResumoReceitas() {

    const containerTabela = document.getElementById("tabelaResumoReceitas");
    const filtroReceitas = document.getElementById("filtroResumoReceitas").value; 
    const filtroTipo = document.querySelector("input[name='filtroResumoReceitas']:checked").value; 

    let { primeiroDia, ultimoDia } = obterMesAtual();

    let urlResumoReceitas;

    if (filtroReceitas === "todas" || filtroReceitas === "") {
        urlResumoReceitas = `http://localhost:8080/receita/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    } else {
        urlResumoReceitas = `http://localhost:8080/receita/categoria/${filtroReceitas}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    }

    fetch(urlResumoReceitas)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar receitas");
            }
            return response.json();
        })
        .then(receitas => {
            containerTabela.innerHTML = '';
        
            const receitasFiltradasPorTipo = receitas.filter(receita => {
                return filtroTipo === "todas" || receita.tipo === filtroTipo;
            });

            receitasFiltradasPorTipo.forEach(receita => {
                const linha = document.createElement("div");
                linha.classList.add("linha");

                let cor = "cor1";
                if (receita.tipo === "fixa") {
                    cor = "cor2";
                } else if (receita.tipo === "parcelada") {
                    cor = "cor3";
                }

                linha.innerHTML = `
                    <div class="cor ${cor}"></div>
                    <p class="titulo">${receita.descricao}</p>
                    <p class="valor">R$ ${receita.valor}</p>
                    <p class="categoria">${receita.categoriaReceitaDTO.nome}</p>
                `;

                containerTabela.appendChild(linha);
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            containerTabela.innerHTML = "<p>Erro ao carregar receitas</p>";
        });

}

function listarResumoReceitasFiltroTipo() {
    document.querySelectorAll("input[name='filtroResumoReceitas']").forEach(input => {
        input.addEventListener('change', function () {
            listarResumoReceitas(); 
        });
    });
}

function configurarFiltrosResumoReceitas() {
    document.getElementById("filtroResumoReceitas").addEventListener('change', function () {
        listarResumoReceitas(); 
    });

    listarResumoReceitasFiltroTipo();
}
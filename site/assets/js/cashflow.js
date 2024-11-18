let urlDespesa;  // URL para buscar as despesas filtradas
let urlReceita;

function adicionarDespesa() {

    const mainContent = document.getElementById('main-content');
    const currentPage = mainContent.getAttribute('data-page');

    const descricao = document.getElementById("inputDescDespesa").value;
    const valor = document.getElementById("inputValorDespesa").value;
    const tipo = document.querySelector('input[name="tipo-des"]:checked').value;
    const categoria = document.getElementById("categoriaDes").value;
    let tempo = 1;

    if (tipo === "parcelada") {
        tempo = document.getElementById("inputParcelasDespesa").value;
    } else if (tipo === "fixa") {
        tempo = 12;
    }

    const data = document.getElementById("inputDataDespesa").value;

    const despesa = {
        descricao: descricao,
        tipo: tipo,
        valor: valor,
        tempo: tempo,
        data: data,
        contaDTO: {
            id: idConta
        },
        categoriaDespesaDTO: {
            id: categoria
        }
    };

    let method = "POST";
    let url = "http://localhost:8080/despesa";
    let sucesso = "Despesa cadastrada com sucesso!";

    if (document.querySelector(".adc-despesa .btn-salvar").textContent === "atualizar") {
        method = "PUT";
        url = `http://localhost:8080/despesa/${document.getElementById("modal1").getAttribute("id-despesa")}`;
        sucesso = "Despesa atualizada com sucesso!";
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(despesa)
    })
        .then(response => {
            if (response.ok) {
                alert(sucesso);
                document.getElementById("form-despesa").reset();
                saldoTotal -= valor;
                alterarSaldo(saldoTotal);
                if (currentPage === "overview") {
                    atualizarInfos();
                } else if (currentPage === "cashflow") {
                    listarDespesas();
                }
                resetarAdcDespesa();
            } else {
                alert("Erro ao adicionar/atualizar despesa. Tente novamente");
                resetarAdcDespesa();
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro. Verifique a conexão com o servidor.")
            resetarAdcDespesa();
        })

    console.log(currentPage);

    if (currentPage === "budgets") {
        listarOrcamentos();
    }

}

function resetarAdcDespesa() {
    document.getElementById("modal1").style.display = 'none';
    document.getElementById("modal1").setAttribute("id-despesa", "");
    document.getElementById("form-despesa").reset()
    document.querySelector("#tituloAdcDespesa").innerHTML = "Nova despesa";
    document.querySelector(".adc-despesa .btn-salvar").textContent = "salvar";
    document.getElementById('inputParcelasDespesa').disabled = false;
    document.getElementsByName("tipo-des").forEach(radio => { radio.disabled = false; });
}

function listarDespesas() {
    const containerTabela = document.getElementById("tabelaDespesa");
    const filtroDespesas = document.getElementById("filtroDespesas").value; // Filtro de categoria
    const filtroTipo = document.querySelector("input[name='cashflow-des']:checked").value; // Filtro de tipo

    // Gerar a URL com base no filtro de categoria
    let mes = document.getElementById("textoMesDespesa").textContent;
    let ano = document.getElementById("textoAnoDespesa").textContent;
    let { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoMes(mes, ano);

    // Gerar a URL com base no filtro de categoria
    if (filtroDespesas === "todas" || filtroDespesas === "") {
        urlDespesa = `http://localhost:8080/despesa/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    } else {
        urlDespesa = `http://localhost:8080/despesa/categoria/${filtroDespesas}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    }

    // Buscar as despesas do backend
    fetch(urlDespesa)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar despesas");
            }
            return response.json();
        })
        .then(despesas => {
            containerTabela.innerHTML = ''; // Limpa a tabela antes de adicionar as despesas

            const despesasFiltradasPorTipo = despesas.filter(despesa => {
                return filtroTipo === "todas" || despesa.tipo === filtroTipo;
            });

            const somaValores = despesasFiltradasPorTipo.reduce((soma, despesa) => soma + parseFloat(despesa.valor), 0);
            document.getElementById("cashflowValorDespesas").textContent = `R$ ${somaValores}`;

            // Adiciona as despesas filtradas à tabela
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
                    <p class="data">${converterData(despesa.data)}</p>
                    <p class="categoria">${despesa.categoriaDespesaDTO.nome}</p>
                    <div class="acoes">
                        <button class="alt"><i class="material-symbols-outlined">edit_square</i></button>
                        <button class="delete"><i class="material-symbols-outlined">delete</i></button>
                    </div>
                `;

                containerTabela.appendChild(linha);

                linha.querySelector(".alt").addEventListener('click', function () {
                    alterarDespesa(despesa);
                });

                linha.querySelector(".delete").addEventListener('click', function () {
                    deletarDespesa(despesa.id);
                });
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            containerTabela.innerHTML = "<p>Erro ao carregar despesas</p>";
        });
}

// Função para adicionar o filtro de tipo
function listarDespesasFiltradasPorTipo() {
    // Escuta mudanças no filtro de tipo
    document.querySelectorAll("input[name='cashflow-des']").forEach(input => {
        input.addEventListener('change', function () {
            listarDespesas(); // Recarrega as despesas sempre que o filtro for alterado
        });
    });
}

// Função para inicializar os filtros
function configurarFiltrosDespesas() {
    // Escuta o evento de mudança no filtro de categoria
    document.getElementById("filtroDespesas").addEventListener('change', function () {
        listarDespesas(); // Recarrega as despesas sempre que o filtro de categoria for alterado
    });

    // Escuta os eventos de mudança no filtro de tipo
    listarDespesasFiltradasPorTipo();
}

// Função de navegação para os meses
function configurarNavegacaoMesesDespesas() {
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const dataAtual = new Date();
    let mesAtual = dataAtual.getMonth();
    let anoAtual = dataAtual.getFullYear();

    // Atualiza o mês e ano na tela
    function atualizarMesAno() {
        document.getElementById("textoMesDespesa").textContent = meses[mesAtual];
        document.getElementById("textoAnoDespesa").textContent = anoAtual;

        const { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoMes(meses[mesAtual], anoAtual);
        urlDespesa = `http://localhost:8080/despesa/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;

        listarDespesas(); // Carregar as despesas após atualizar a URL
    }

    // Configurar navegação de meses
    document.getElementById("btn-prev").addEventListener("click", () => {
        mesAtual = mesAtual === 0 ? 11 : mesAtual - 1;
        if (mesAtual === 11) anoAtual--;
        atualizarMesAno();
    });

    document.getElementById("btn-next").addEventListener("click", () => {
        mesAtual = mesAtual === 11 ? 0 : mesAtual + 1;
        if (mesAtual === 0) anoAtual++;
        atualizarMesAno();
    });

    atualizarMesAno(); // Inicializa com o mês e ano atual
}

function alterarDespesa(despesa) {

    document.getElementById("modal1").style.display = 'flex';
    document.getElementById("modal1").setAttribute("id-despesa", despesa.id);
    document.querySelector("#tituloAdcDespesa").innerHTML = "Atualizar despesa";
    document.querySelector(".adc-despesa .btn-salvar").textContent = "atualizar";

    document.querySelector("#inputDescDespesa").value = despesa.descricao;
    document.querySelector("#inputValorDespesa").value = despesa.valor;
    document.getElementById("categoriaDes").value = despesa.categoriaDespesaDTO.id;
    document.getElementsByName("tipo-des").forEach(radio => {
        if (radio.value === despesa.tipo) {
            radio.checked = true;
        }
        radio.disabled = true;
    })
    if (despesa.tipo === "parcelada") {
        document.getElementById('inputParcelasDes').style.visibility = 'visible';
        document.getElementById('inputParcelasDespesa').value = despesa.tempo;
        document.getElementById('inputParcelasDespesa').disabled = true;
    }
    document.querySelector("#inputDataDespesa").value = despesa.data;

}

function deletarDespesa(id) {

    if (!confirm("Deseja realmente excluir essa despesa?")) {
        return;
    }
    fetch(`http://localhost:8080/despesa/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "aplication/JSON"
        }
    })
        .then(response => {
            if (response.ok) {
                alert("Despesa excluida com sucesso!");
                listarDespesas();
            } else {
                alert("Erro ao excluir despesa.");
            }
        })
        .catch(error => {
            console.error("Erro: ", error);
            alert("Erro ao excluir orçamento. Verifique a conexão com o servidor");
        });
}



function adicionarReceita() {

    const mainContent = document.getElementById('main-content');
    const currentPage = mainContent.getAttribute('data-page');

    const descricao = document.getElementById("inputDescReceita").value;
    const valor = document.getElementById("inputValorReceita").value;
    const tipo = document.querySelector('input[name="tipo-rec"]:checked').value;
    const categoria = document.getElementById("categoriaRec").value;
    let tempo = 1;

    if (tipo === "parcelada") {
        tempo = document.getElementById("inputParcelasReceita").value;
    } else if (tipo === "fixa") {
        tempo = 12;
    }

    const data = document.getElementById("inputDataReceita").value;

    const receita = {
        descricao: descricao,
        tipo: tipo,
        valor: valor,
        tempo: tempo,
        data: data,
        contaDTO: {
            id: idConta
        },
        categoriaReceitaDTO: {
            id: categoria
        }
    };

    let method = "POST";
    let url = "http://localhost:8080/receita"; // URL para as receitas
    sucesso = "Receita adicionada com sucesso!";

    if (document.querySelector(".adc-receita .btn-salvar").textContent === "atualizar") {
        method = "PUT";
        url = `http://localhost:8080/receita/${document.getElementById("modal2").getAttribute("id-receita")}`;
        sucesso = "Receita atualizada com sucesso!";
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(receita)
    })
        .then(response => {
            if (response.ok) {
                alert(sucesso);
                document.getElementById("form-receita").reset();
                if (currentPage === "cashflow") {
                    listarReceitas();
                }
                resetarAdcReceita();
            } else {
                alert("Erro ao adicionar receita. Tente novamente");
                resetarAdcReceita();
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao adicionar receita. Verifique a conexão com o servidor.")
            resetarAdcReceita();
        })

    if (currentPage === "budgets") {
        listarOrcamentos();
    }
}

function resetarAdcReceita() {
    document.getElementById("modal2").style.display = 'none';
    document.getElementById("modal2").setAttribute("id-receita", "");
    document.querySelector("#tituloAdcReceita").innerHTML = "Nova receita";
    document.querySelector(".adc-receita .btn-salvar").textContent = "salvar";
    document.getElementById('inputParcelasReceita').disabled = false;
    document.getElementsByName("tipo-rec").forEach(radio => { radio.disabled = false; });
}


function listarReceitas() {
    const containerTabela = document.getElementById("tabelaReceita");
    const filtroReceitas = document.getElementById("filtroReceitas").value; // Filtro de categoria
    const filtroTipo = document.querySelector("input[name='cashflow-rec']:checked").value; // Filtro de tipo

    // Gerar a URL com base no filtro de categoria
    let mes = document.getElementById("textoMesReceita").textContent;
    let ano = document.getElementById("textoAnoReceita").textContent;
    let { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoMes(mes, ano);

    // Gerar a URL com base no filtro de categoria
    if (filtroReceitas === "todas" || filtroReceitas === "") {
        urlReceita = `http://localhost:8080/receita/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    } else {
        urlReceita = `http://localhost:8080/receita/categoria/${filtroReceitas}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;
    }

    // Buscar as receitas do backend
    fetch(urlReceita)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar receitas");
            }
            return response.json();
        })
        .then(receitas => {
            containerTabela.innerHTML = ''; // Limpa a tabela antes de adicionar as receitas

            const receitasFiltradasPorTipo = receitas.filter(receita => {
                return filtroTipo === "todas" || receita.tipo === filtroTipo;
            });

            const somaValores = receitasFiltradasPorTipo.reduce((soma, receita) => soma + parseFloat(receita.valor), 0);
            document.getElementById("cashflowValorReceitas").textContent = `R$ ${somaValores}`;

            // Adiciona as receitas filtradas à tabela
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
                    <p class="data">${converterData(receita.data)}</p>
                    <p class="categoria">${receita.categoriaReceitaDTO.nome}</p>
                    <div class="acoes">
                        <button class="alt"><i class="material-symbols-outlined">edit_square</i></button>
                        <button class="delete"><i class="material-symbols-outlined">delete</i></button>
                    </div>
                `;

                containerTabela.appendChild(linha);

                linha.querySelector(".alt").addEventListener('click', function () {
                    alterarReceita(receita);
                });

                linha.querySelector(".delete").addEventListener('click', function () {
                    deletarReceita(receita.id);
                });
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            containerTabela.innerHTML = "<p>Erro ao carregar receitas</p>";
        });
}

// Função para adicionar o filtro de tipo
function listarReceitasFiltradasPorTipo() {
    // Escuta mudanças no filtro de tipo
    document.querySelectorAll("input[name='cashflow-rec']").forEach(input => {
        input.addEventListener('change', function () {
            listarReceitas(); // Recarrega as receitas sempre que o filtro for alterado
        });
    });
}

// Função para inicializar os filtros
function configurarFiltrosReceitas() {
    // Escuta o evento de mudança no filtro de categoria
    document.getElementById("filtroReceitas").addEventListener('change', function () {
        listarReceitas(); // Recarrega as receitas sempre que o filtro de categoria for alterado
    });

    // Escuta os eventos de mudança no filtro de tipo
    listarReceitasFiltradasPorTipo();
}

// Função de navegação para os meses (igual para despesas e receitas)
function configurarNavegacaoMesesReceitas() {
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const dataAtual = new Date();
    let mesAtual = dataAtual.getMonth();
    let anoAtual = dataAtual.getFullYear();

    // Atualiza o mês e ano na tela
    function atualizarMesAno() {
        document.getElementById("textoMesReceita").textContent = meses[mesAtual];
        document.getElementById("textoAnoReceita").textContent = anoAtual;

        const { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoMes(meses[mesAtual], anoAtual);
        urlReceita = `http://localhost:8080/receita/conta/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`;

        listarReceitas(); // Carregar as receitas após atualizar a URL
    }

    // Configurar navegação de meses
    document.getElementById("btn-prev-rec").addEventListener("click", () => {
        mesAtual = mesAtual === 0 ? 11 : mesAtual - 1;
        if (mesAtual === 11) anoAtual--;
        atualizarMesAno();
    });

    document.getElementById("btn-next-rec").addEventListener("click", () => {
        mesAtual = mesAtual === 11 ? 0 : mesAtual + 1;
        if (mesAtual === 0) anoAtual++;
        atualizarMesAno();
    });

    atualizarMesAno(); // Inicializa com o mês e ano atual
}

function alterarReceita(receita) {
    document.getElementById("modal2").style.display = 'flex';
    document.getElementById("modal2").setAttribute("id-receita", receita.id);
    document.querySelector("#tituloAdcReceita").innerHTML = "Atualizar receita";
    document.querySelector(".adc-receita .btn-salvar").textContent = "atualizar";

    document.querySelector("#inputDescReceita").value = receita.descricao;
    document.querySelector("#inputValorReceita").value = receita.valor;
    document.getElementById("categoriaRec").value = receita.categoriaReceitaDTO.id;
    document.getElementsByName("tipo-rec").forEach(radio => {
        if (radio.value === receita.tipo) {
            radio.checked = true;
        }
        radio.disabled = true;
    })
    if (receita.tipo === "parcelada") {
        document.getElementById('inputParcelasRec').style.visibility = 'visible';
        document.getElementById('inputParcelasReceita').value = receita.tempo;
        document.getElementById('inputParcelasReceita').disabled = true;
    }
    document.querySelector("#inputDataReceita").value = receita.data;

}

function deletarReceita(id) {

    if (!confirm("Deseja realmente excluir essa receita?")) {
        return;
    }
    fetch(`http://localhost:8080/receita/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "aplication/JSON"
        }
    })
        .then(response => {
            if (response.ok) {
                alert("Receita excluida com sucesso!");
                listarReceitas();
            } else {
                alert("Erro ao excluir receita.");
            }
        })
        .catch(error => {
            console.error("Erro: ", error);
            alert("Erro ao excluir receita. Verifique a conexão com o servidor");
        });
}
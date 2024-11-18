let metaSelecionada;
let somaMetas;
let somaTotal;

function listarMetas() {

    const containerTabela = document.getElementById("grid-metas");

    // let { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoMes(mes, ano);
    urlMetas = `http://localhost:8080/meta?idConta=${idConta}`;

    fetch(urlMetas)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar metas");
            }
            return response.json();
        })
        .then(metas => {

            containerTabela.innerHTML = `<div class="box adc adicionar" data-modal="modal4">+</div>`;
            initializeAddButton();

            metas.forEach(meta => {
                const box = document.createElement("div");
                box.classList.add("box");
                box.classList.add("meta");
                box.setAttribute("data-modal", "modal5");
                box.setAttribute("id-meta", `${meta.id}`);

                metaSelecionada = meta;

                fetch(`http://localhost:8080/deposito/soma/${meta.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Erro ao buscar soma");
                        }
                        return response.text();
                    })
                    .then(soma => {

                        somaMetas = soma;
                        let porcentagem = (soma / meta.valor) * 100;
                        let comprimento = Math.min(porcentagem, 100);

                        box.innerHTML = `
                            <div class="linha1">
                                <div class="cor"></div>
                                <p class="titulo">${meta.objetivo}</p>
                            </div>
                            <div class="espaco"></div>
                            <div class="linha2">
                                <div class="valor">R$ ${soma} / R$ ${meta.valor}</div>
                                <div class="espaco"></div>
                                <p class="porcentagem">${porcentagem.toFixed(1)}%</p>
                            </div>
                            <div class="barra-container">
                                <div class="barra-progresso" id="barra-progresso" style="width: ${comprimento}%;">
                                </div>
                            </div>
                            `;

                        containerTabela.appendChild(box);

                        box.addEventListener('click', () => {
                            carregarMeta(meta, soma);
                            document.getElementById("modal5").style.display = 'flex';
                            window.addEventListener('click', (event) => {
                                if (event.target.classList.contains('modal5')) {
                                    event.target.style.display = 'none';
                                }
                            });
                        });

                    })
                    .catch(error => {
                        console.error("Erro: ", error);
                    });

            });
        })
        .catch(error => {
            console.error("Erro:", error);
            containerTabela.innerHTML = "<p>Erro ao carregar orçamentos</p>";
        });

    const buttonSalvar = document.getElementById("btnAdcDeposito");
    buttonSalvar.addEventListener("click", function (event) {
        event.preventDefault();
        adicionarDeposito(metaSelecionada, somaMetas);
    });

}

function carregarMeta(meta, soma) {

    document.getElementById("tituloMeta").textContent = meta.objetivo;
    document.getElementById("dataMeta").textContent = "Data final: " + converterData(meta.dataFim);
    document.getElementById("valorReservado").textContent = "R$ " + soma;
    document.getElementById("valorRestante").textContent = "R$ " + meta.valor;
    const acoes = document.getElementById("acoesMeta");

    metaSelecionada = meta;
    somaMetas = soma;

    if (soma < meta.valor) {
        let meses = contarMesesAte(meta.dataFim);
        let valorMensal = (meta.valor - soma) / meses;
        document.getElementById("fraseMeta").innerHTML = "você precisa guardar mensalmente:";
        document.getElementById("valorMensal").textContent = "R$ " + valorMensal.toFixed(2);
    } else {
        document.getElementById("fraseMeta").innerHTML = "<b>Parabéns, você alcançou a sua meta!</b>";
        document.getElementById("valorMensal").textContent = "";
    }

    createChartsGoals(soma, meta.valor);

    listarDepositos(meta);

    const button = document.getElementById("btnDeposito");

    button.addEventListener('click', () => {
        document.getElementById("modal6").style.display = 'flex';
    });

    acoes.querySelector(".alt").addEventListener('click', function () {
        alterarMeta(meta);
    });

    acoes.querySelector(".delete").addEventListener('click', function () {
        deletarMeta(meta.id);
    });

}

function listarDepositos(meta) {

    const listaDepositos = document.getElementById("listaDepositos");

    fetch(`http://localhost:8080/deposito/${meta.id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar depósito");
            }
            return response.json();
        })
        .then(depositos => {
            listaDepositos.innerHTML = '';

            depositos.forEach(deposito => {
                const linha = document.createElement("div");
                linha.classList.add("linha-dep");

                let cor = "positivo";
                let textoDeposito = "+ R$ " + deposito.valor;
                if (deposito.valor < 0) {
                    cor = "negativo";
                    textoDeposito = "- R$ " + Math.abs(deposito.valor);
                }

                linha.innerHTML = `
                    <div class="data-dep">${formatarDataExtenso(deposito.data)}</div>
                    <div class="espaco"></div>
                    <div class="valor-dep ${cor}">${textoDeposito}</div>
                `;

                listaDepositos.appendChild(linha);
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            listaDepositos.innerHTML = "<p>Erro ao carregar depósitos</p>";
        });

}

function adicionarMeta() {

    const objetivo = document.getElementById("inputObjetivoMeta").value;
    const valor = document.getElementById("inputValorMeta").value;
    const dataInicial = obterDataAtual();
    const dataFinal = document.getElementById("inputDataMeta").value;

    const meta = {
        objetivo: objetivo,
        valor: valor,
        dataInicio: dataInicial,
        dataFim: dataFinal,
        contaDTO: {
            id: idConta
        }
    };

    let method = "POST";
    let url = "http://localhost:8080/meta";
    let sucesso = "Meta cadastrado com sucesso!";

    if (document.querySelector(".adc-meta .btn-salvar").textContent === "atualizar") {
        method = "PUT";
        url = `http://localhost:8080/meta/${document.getElementById("modal4").getAttribute("id-meta")}`;
        sucesso = "Meta atualizado com sucesso!";
    }

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(meta)
    })
        .then(response => {
            if (response.ok) {
                alert(sucesso);
                document.getElementById("form-meta").reset();
                listarMetas();
                resetarAdcMeta();
            } else {
                alert("Erro ao adicionar/atualizar meta. Tente novamente");
                resetarAdcMeta();
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro. Verifique a conexão com o servidor.")
            resetarAdcMeta();
        })

}

function alterarMeta(meta) {

    document.getElementById("modal4").style.display = 'flex';
    document.getElementById("modal4").setAttribute("id-meta", meta.id);
    document.querySelector("#tituloAdcMeta").innerHTML = "Atualizar meta";
    document.querySelector(".adc-meta .btn-salvar").textContent = "atualizar";

    document.querySelector("#inputObjetivoMeta").value = meta.objetivo;
    document.getElementById("inputValorMeta").value = meta.valor;
    document.getElementById("inputDataMeta").value = meta.dataFim;
    document.getElementById("modal5").style.display = 'none';

}

function deletarMeta(id) {

    if (!confirm("Deseja realmente excluir essa meta?")) {
        return;
    }
    fetch(`http://localhost:8080/meta/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "aplication/JSON"
        }
    })
        .then(response => {
            if (response.ok) {
                alert("Meta excluida com sucesso!");
                document.getElementById("modal5").style.display = 'none';
                listarMetas();
            } else {
                alert("Erro ao excluir meta.");
            }
        })
        .catch(error => {
            console.error("Erro: ", error);
            alert("Erro ao excluir meta. Verifique a conexão com o servidor");
        });
}

function resetarAdcMeta() {
    document.getElementById("modal4").style.display = 'none';
    document.getElementById("modal4").setAttribute("id-meta", "");
    document.querySelector("#tituloAdcMeta").innerHTML = "Nova meta";
    document.querySelector(".adc-meta .btn-salvar").textContent = "salvar";
    document.getElementById("form-meta").reset();
}

function adicionarDeposito(meta, soma) {

    let valor = document.getElementById("inputValorDeposito").value;
    const data = obterDataAtual();
    const tipo = document.querySelector('input[name="radioDep"]:checked').value;

    if (tipo == "negativo") {
        valor *= -1;
    }

    soma = Number(soma) + Number(valor);
    somaMetas = soma.toFixed(2);

    const deposito = {
        valor: valor,
        data: data,
        metaDTO: {
            id: meta.id
        }
    };

    let method = "POST";
    let url = "http://localhost:8080/deposito";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(deposito)
    })
        .then(response => {
            if (response.ok) {
                document.getElementById("form-deposito").reset();
                carregarMeta(metaSelecionada, somaMetas);
                resetarAdcDeposito();
            } else {
                alert("Erro ao adicionar/atualizar depósito. Tente novamente");
                resetarAdcDeposito();
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro. Verifique a conexão com o servidor.")
            resetarAdcDeposito();
        })

}

function resetarAdcDeposito() {
    document.getElementById("modal6").style.display = 'none';
    document.getElementById("form-deposito").reset();
}


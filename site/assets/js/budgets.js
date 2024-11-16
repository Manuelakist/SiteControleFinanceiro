function listarOrcamentos() {
    const containerTabela = document.getElementById("tabela-orc");
    const urlOrcamento = `http://localhost:8080/orcamento?idConta=${idConta}`;
    const { primeiroDia, ultimoDia } = obterMesAtual();

    fetch(urlOrcamento)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar orcamentos");
            }
            return response.json();
        })
        .then(orcamentos => {
            containerTabela.innerHTML = '';

            const somaOrcamentos = orcamentos.reduce((total, orcamento) => {
                return total + orcamento.valor;
            }, 0);

            atualizarInfosOrcamentos(somaOrcamentos);

            orcamentos.forEach(orcamento => {
                const linha = document.createElement("div");
                linha.classList.add("linha");

                let valorGasto = 0;

                fetch(`http://localhost:8080/despesa/soma/categoria/${orcamento.categoriaDespesaDTO.id}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Erro ao buscar soma");
                        }
                        return response.json();
                    })
                    .then(soma => {
                        valorGasto = soma;

                        let porcentagem = (valorGasto / orcamento.valor) * 100;
                        let comprimento = Math.min(porcentagem, 100);

                        let barraClass = comprimento < 15 ? 'pequena' : '';

                        linha.innerHTML = `
                            <p class="nome">${orcamento.categoriaDespesaDTO.nome}</p>
                            <p class="valor">R$ ${valorGasto}</p>
                            <p class="valor">R$ ${orcamento.valor}</p>
                            <div class="barra-container ${barraClass}">
                                <div class="barra-progresso" id="barra-progresso" style="width: ${comprimento}%;">
                                    <span class="porcentagem-texto">${porcentagem.toFixed(1)}%</span>
                                </div>
                            </div>
                            <div class="acoes">
                                <button class="alt"><i class="material-symbols-outlined">edit_square</i></button>
                                <button class="delete"><i class="material-symbols-outlined">delete</i></button>
                            </div>
                        `;

                        containerTabela.appendChild(linha);

                        linha.querySelector(".alt").addEventListener('click', function () {
                            alterarOrcamento(orcamento);
                        });

                        linha.querySelector(".delete").addEventListener('click', function () {
                            deletarOrcamento(orcamento.id);
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
}

function atualizarInfosOrcamentos(somaOrcamentos) {

    const containerReceita = document.getElementById("boxReceitaOrc");
    const containerMaximo = document.getElementById("boxMaximoOrc");
    const containerAtual = document.getElementById("boxAtualOrc");
    const containerBalanco = document.getElementById("boxBalancoOrc");

    let receitaMensal = 0;

    const { primeiroDia, ultimoDia } = obterMesAtual(); 

    fetch(`http://localhost:8080/receita/soma/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao buscar resposta");
        }
        return response.json();
    })
    .then(soma => {
        containerReceita.textContent = `${"R$ " + soma}`;
        receitaMensal = soma;
        const balancoEsperado = receitaMensal - somaOrcamentos;
        containerBalanco.textContent = `${"R$ " + balancoEsperado}`;
    })
    .catch(error => {
        console.error("Erro: ", error);
    });

    fetch(`http://localhost:8080/despesa/soma/${idConta}?dataInicial=${primeiroDia}&dataFinal=${ultimoDia}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao buscar resposta");
        }
        return response.json();
    })
    .then(soma => {
        containerAtual.textContent = `${"R$ " + soma}`;
    })
    .catch(error => {
        console.error("Erro: ", error);
    });

    containerMaximo.textContent = `${"R$ " + somaOrcamentos}`;


}

function adicionarOrcamento() {

    const valor = document.getElementById("inputValorOrcamento").value;
    const categoria = document.getElementById("categoriaOrc").value;

    const orcamento = {
        valor: valor,
        contaDTO: {
            id: idConta
        },
        categoriaDespesaDTO: {
            id: categoria
        }
    };

    let method = "POST";
    let url = "http://localhost:8080/orcamento";
    let sucesso = "Orçamento cadastrado com sucesso!";

    if (document.querySelector(".adc-orcamento .btn-salvar").textContent === "atualizar") {
        method = "PUT";
        url = `http://localhost:8080/orcamento/${document.getElementById("modal3").getAttribute("id-orcamento")}`;
        sucesso = "Orçamento atualizado com sucesso!";
    } 

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orcamento)
    })
        .then(response => {
            if (response.ok) {
                alert(sucesso);
                document.getElementById("form-orcamento").reset();
                listarOrcamentos();
                resetarAdcOrcamento();
            } else {
                alert("Erro ao adicionar/atualizar orçamento. Tente novamente");
                resetarAdcOrcamento();
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro. Verifique a conexão com o servidor.")
            resetarAdcOrcamento();
        })

}

function alterarOrcamento(orcamento) {

    document.getElementById("modal3").style.display = 'flex';
    document.getElementById("modal3").setAttribute("id-orcamento", orcamento.id);
    document.querySelector("#tituloAdcOrcamento").innerHTML = "Atualizar orçamento";
    document.querySelector(".adc-orcamento .btn-salvar").textContent = "atualizar";
    
    console.log(orcamento);

    document.querySelector("#inputValorOrcamento").value = orcamento.valor;
    document.getElementById("categoriaOrc").value = orcamento.categoriaDespesaDTO.id;
    document.getElementById("categoriaOrc").disabled = true;

}

function deletarOrcamento(id) {

    if (!confirm("Deseja realmente excluir esse orçamento?")) {
        return;
    }
    fetch(`http://localhost:8080/orcamento/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "aplication/JSON"
        }
    })
        .then(response => {
            if (response.ok) {
                alert("Orçamento excluido com sucesso!");
                listarOrcamentos();
            } else {
                alert("Erro ao excluir orçamento.");
            }
        })
        .catch(error => {
            console.error("Erro: ", error);
            alert("Erro ao excluir orçamento. Verifique a conexão com o servidor");
        });
}

function resetarAdcOrcamento() {
    document.getElementById("modal3").style.display = 'none';
    document.getElementById("modal3").setAttribute("id-orcamento", "");
    document.querySelector("#tituloAdcOrcamento").innerHTML = "Novo orçamento";
    document.querySelector(".adc-orcamento .btn-salvar").textContent = "salvar";
    document.getElementById("categoriaOrc").disabled = false;
    document.getElementById("form-orcamento").reset();
}


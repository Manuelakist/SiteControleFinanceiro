const idConta = document.querySelector(".main-content").getAttribute('idConta');

document.addEventListener('DOMContentLoaded', () => {
    // Carrega a sidebar
    fetch('../components/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('.sidebar').innerHTML = html; // Adiciona o HTML da sidebar
            initializeSidebar(); // Inicializa a sidebar após carregá-la
        })
        .catch(error => console.error('Erro ao carregar a sidebar:', error));

    // Carrega o header
    fetch('../components/header.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('.header').innerHTML = html; // Adiciona o HTML do header
            initializeOptionsButton();
            initializeRadioButtonsDes();
            initializeRadioButtonsRec();
            initializeCategorySelect();
            carregarCategorias("despesa", "categoriaDes");
            carregarCategorias("receita", "categoriaRec");
            carregarCategorias("despesa", "categoriaOrc");
            document.getElementById("form-despesa").addEventListener("submit", (event) => {
                event.preventDefault(); // Impede o recarregamento da página
                adicionarDespesa(); // Chama a função para adicionar a despesa
            });
            document.getElementById("form-receita").addEventListener("submit", (event) => {
                event.preventDefault(); // Impede o recarregamento da página
                adicionarReceita(); // Chama a função para adicionar a despesa
            });
            document.getElementById("form-orcamento").addEventListener("submit", (event) => {
                event.preventDefault(); // Impede o recarregamento da página
                adicionarOrcamento(); // Chama a função para adicionar a despesa
            });
            document.getElementById("form-meta").addEventListener("submit", (event) => {
                event.preventDefault(); // Impede o recarregamento da página
                adicionarMeta(); // Chama a função para adicionar a despesa
            });
        })
        .catch(error => console.error('Erro ao carregar o header:', error));

    const mainContent = document.getElementById('main-content');
    const currentPage = mainContent.getAttribute('data-page');

    // Carrega 'overview' apenas se nenhuma página estiver ativa
    if (currentPage === "") {
        loadPage('overview');
        mainContent.setAttribute('data-page', 'overview');
    }
});

function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();

            // Remove a classe 'ativo' de todos os links
            sidebarLinks.forEach(link => link.classList.remove('ativo'));

            // Adiciona a classe 'ativo' ao link clicado
            link.classList.add('ativo');

            // Carrega a página correspondente
            const page = link.getAttribute('data-page');
            console.log(`Carregando a página: ${page}`);
            loadPage(page);
        });
    });
}

function loadPage(page) {
    const url = `../pages/${page}.html`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar a página');
            }
            return response.text();
        })
        .then(html => {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = html;
            mainContent.setAttribute('data-page', page); // Define a página atual

            // Funções específicas para cada página
            if (page === 'overview') {
                createChartsOverview();
                addPageLinkListeners();
                atualizarInfos();
                carregarCategorias("despesa", "filtroResumoDespesas");
                carregarCategorias("receita", "filtroResumoReceitas");
                listarResumoDespesas();
                listarResumoReceitas();
                configurarFiltrosResumoDespesas();
                configurarFiltrosResumoReceitas();
            } else if (page === 'cashflow') {
                carregarCategorias("despesa", "filtroDespesas");
                carregarCategorias("receita", "filtroReceitas");
                // Inicializa todos os filtros e a navegação de meses
                configurarFiltrosDespesas();
                configurarFiltrosReceitas();
                configurarNavegacaoMesesDespesas();
                configurarNavegacaoMesesReceitas();
            } else if (page === 'budgets') {
                listarOrcamentos();
                atualizarInfosOrcamentos();
            } else if (page === 'goals') {
                initializeAddButton();
                listarMetas();
            } else if (page === 'reports') {
                createChartsReports();
                loadReportsCharts();
            }
        })
        .catch(error => {
            console.error('Erro ao carregar a página:', error);
        });
}

function addPageLinkListeners() {
    const pageLinks = document.querySelectorAll('.link');

    pageLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Previne o comportamento padrão do link
            const page = this.getAttribute('data-page'); // Pega o valor do atributo data-page
            console.log(`Carregando a página: ${page}`);
            loadPage(page); // Chama loadPage para carregar a nova página
        });
    });
}


function initializeRadioButtonsDes() {
    const radioButtons = document.querySelectorAll('input[name="tipo-des"]');
    const conditionalInput = document.getElementById('inputParcelasDes');

    // Adiciona um evento de mudança aos radio buttons
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.getElementById('parcelada-des').checked) {
                conditionalInput.style.visibility = 'visible'; // Mostra o input
            } else {
                conditionalInput.style.visibility = 'hidden'; // Esconde o input
            }
        });
    });

    if (document.getElementById('parcelada-des').checked) {
        conditionalInput.style.visibility = 'visible'; // Caso o terceiro esteja selecionado, exibe o input
    }
}

function initializeRadioButtonsRec() {
    const radioButtons = document.querySelectorAll('input[name="tipo-rec"]');
    const conditionalInput = document.getElementById('inputParcelasRec');

    // Adiciona um evento de mudança aos radio buttons
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.getElementById('parcelada-rec').checked) {
                conditionalInput.style.visibility = 'visible'; // Mostra o input
            } else {
                conditionalInput.style.visibility = 'hidden'; // Esconde o input
            }
        });
    });

    if (document.getElementById('parcelada-rec').checked) {
        conditionalInput.style.visibility = 'visible'; // Caso o terceiro esteja selecionado, exibe o input
    }
}

function initializeOptionsButton() {
    const optionsButton = document.getElementById('optionsButton'); // ID do botão
    const optionsMenu = document.getElementById('optionsMenu'); // ID do menu de opções

    // Abre/fecha o menu de opções
    optionsButton.addEventListener('click', () => {
        optionsMenu.style.display = optionsMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    window.addEventListener('click', (event) => {
        if (!optionsMenu.contains(event.target) && event.target !== optionsButton) {
            optionsMenu.style.display = 'none'; // Fecha o menu
        }
    });

    // Adiciona eventos de clique nas opções
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            const modalId = option.getAttribute('data-modal'); // ID do modal
            resetarAdcDespesa();
            resetarAdcReceita();
            document.getElementById(modalId).style.display = 'flex'; // Abre o modal correspondente
            optionsMenu.style.display = 'none'; // Fecha o menu de opções
        });
    });

    // Fecha os modais ao clicar no botão de fechar
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'none'; // Fecha o modal
        });
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

function initializeAddButton() {
    const addButtons = document.querySelectorAll('.adicionar');

    addButtons.forEach(addButton => {
        addButton.addEventListener('click', () => {
            const modalId = addButton.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'flex';            
        });
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

function initializeCategorySelect() {
    const categorySelect = document.getElementById('categoriaOrc'); // ID do select
    const categoryText = document.getElementById('categoriaSelecionada'); // ID do span que contém o texto dinâmico

    // Verifica se os elementos existem na página
    if (categorySelect && categoryText) {

        const selectedCategoria = categorySelect.value; // Pega o valor da categoria selecionada
        categoryText.textContent = selectedCategoria;

        // Adiciona um event listener para quando o select mudar
        categorySelect.addEventListener('change', function () {
            const selectedCategory = this.value; // Pega o valor da categoria selecionada
            categoryText.textContent = selectedCategory; // Atualiza o texto do span
        });
    }
}

function carregarCategorias(tipo, idSelect) {
    const categoriaSelect = document.getElementById(idSelect);

    let url;

    if (tipo === "despesa") {
        url = `http://localhost:8080/categoriaDespesa?idConta=${idConta}`;
    } else {
        url = `http://localhost:8080/categoriaReceita?idConta=${idConta}`
    }

    fetch(url)
        .then(response => response.json())
        .then(categorias => {
            categoriaSelect.innerHTML = "";

            if (idSelect === "filtroDespesas" || idSelect === "filtroReceitas" || idSelect === "filtroResumoDespesas" || idSelect === "filtroResumoReceitas") {
                // Adicionar a opção default
                const optionDefault = document.createElement('option');
                optionDefault.value = 'todas';
                optionDefault.textContent = 'Todas';
                categoriaSelect.appendChild(optionDefault);
                categoriaSelect.value = "todas";
            }

            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;  // O valor será o id da categoria
                option.textContent = categoria.nome;  // O texto será o nome da categoria
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar categorias:', error);
            alert('Erro ao carregar categorias.');
        });
}
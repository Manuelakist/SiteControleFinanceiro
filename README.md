# Sistema de Controle Financeiro Pessoal

<div align="left">
  <img src="https://img.shields.io/badge/Status-Em_Refatoração-orange?style=for-the-badge" alt="Status de Refatoração">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite">
  <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</div>

<br>

## Aviso de Refatoração
Este projeto está em processo de refatoração estrutural. A interface original, desenvolvida em HTML/CSS/JS (disponível no diretório `/site`), está sendo migrada para uma Single Page Application (SPA) utilizando React e Vite (diretório `/financeiro-react`). O objetivo é otimizar a componentização, escalabilidade e performance do sistema.

## Sobre o Projeto
O Sistema de Controle Financeiro é uma aplicação web desenvolvida para facilitar a gestão de finanças pessoais. Através de um painel interativo, o usuário pode registrar receitas e despesas, gerenciar orçamentos, estabelecer metas financeiras e analisar relatórios de fluxo de caixa. A interface foi construída com CSS puro, garantindo um design responsivo e customizado.

## Funcionalidades
- **Autenticação:** Login seguro e controle de acesso via rotas protegidas.
- **Visão Geral (Dashboard):** Resumo do saldo atual, valor disponível, total de gastos e receitas mensais.
- **Fluxo de Caixa:** Tabela de registros financeiros com filtros por tipo (fixa, parcelada, pontual) e categoria.
- **Metas Financeiras:** Monitoramento de objetivos de economia através de barras de progresso.
- **Orçamentos:** Configuração de limites de gastos por categoria, com indicadores visuais de consumo.
- **Relatórios:** Representação analítica do balanço entre receitas e despesas.

## Tecnologias Utilizadas

### Front-end
* React
* Vite
* React Router Dom
* CSS3 (Estilização baseada em variáveis e Flexbox/Grid)

### Back-end
* Java 17+
* Spring Boot
* Spring Data JPA / Hibernate
* Maven

### Banco de Dados
* MySQL (Modelos e esquemas disponíveis no diretório `/banco de dados`)

## Como executar o projeto localmente

### Pré-requisitos
* Node.js (v16 ou superior)
* Java JDK (v17 ou superior)
* Maven
* MySQL Server

### 1. Clonar o repositório
```bash
git clone [https://github.com/Manuelakist/SiteControleFinanceiro.git](https://github.com/Manuelakist/SiteControleFinanceiro.git)
cd SiteControleFinanceiro
```

### 2. Configurar o Back-end
1. Navegue até o diretório da API:
   ```bash
   cd financeiro
   ```
2. Configure as credenciais de acesso ao banco de dados no arquivo `src/main/resources/application.properties`.
3. Inicie o servidor:
   ```bash
   mvn spring-boot:run
   ```
   A API estará disponível em `http://localhost:8080`.

### 3. Configurar o Front-end
1. Em um novo terminal, navegue até o diretório do React:
   ```bash
   cd financeiro-react
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

## Autoria

Desenvolvido por Manuela Skrsypcsak Kist.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](www.linkedin.com/in/manuela-skrsypcsak-kist-a586792b2)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Manuelakist)

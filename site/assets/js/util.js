function converterData(data) {
    const partes = data.split('-');  // Divide a data em partes: [ano, mês, dia]
    return `${partes[2]}/${partes[1]}/${partes[0]}`;  // Formata como dd/mm/yyyy
}

function converterDataSql(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam em 0, então somamos 1
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function obterPrimeiroUltimoDiaDoMes(mes, ano) {

    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    // Encontrar o número do mês a partir do nome
    const mesIndex = meses.indexOf(mes.toLowerCase());
    if (mesIndex === -1) {
        throw new Error("Mês inválido.");
    }

    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mesIndex, 1);  // O mês é 0-indexed, então usamos o mesIndex
    const primeiroDiaFormatado = primeiroDia.toISOString().split('T')[0]; // Formato SQL: yyyy-mm-dd

    // Último dia do mês
    const ultimoDia = new Date(ano, mesIndex + 1, 0);  // O dia 0 do próximo mês nos dá o último dia do mês
    const ultimoDiaFormatado = ultimoDia.toISOString().split('T')[0]; // Formato SQL: yyyy-mm-dd

    // Retorna as datas formatadas no formato SQL
    return {
        primeiroDia: primeiroDiaFormatado,  // Data do primeiro dia
        ultimoDia: ultimoDiaFormatado  // Data do último dia
    };
}

function obterMesAtual() {

    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const dataAtual = new Date();
    let mesAtual = meses[dataAtual.getMonth()];
    let anoAtual = dataAtual.getFullYear();

    const { primeiroDia, ultimoDia } = obterPrimeiroUltimoDiaDoMes(mesAtual, anoAtual);

    return { primeiroDia, ultimoDia };
}

function contarMesesAte(dataFutura) {
    const dataAtual = new Date();
    const dataFinal = new Date(dataFutura);

    if (dataFinal < dataAtual) {
        return 0; // Retorna 0 se a data final já passou
    }

    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth(); // Mês começa em 0

    const anoFinal = dataFinal.getFullYear();
    const mesFinal = dataFinal.getMonth(); // Mês começa em 0

    const diferencaMeses = (anoFinal - anoAtual) * 12 + (mesFinal - mesAtual);

    return diferencaMeses;
}

function formatarDataExtenso(dataSQL) {
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];

    const [ano, mes, dia] = dataSQL.split("-");

    const nomeMes = meses[parseInt(mes, 10) - 1];

    return `${dia} de ${nomeMes}, ${ano}`;
}

function obterDataAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mes começa do 0, então somamos 1
    const dia = String(hoje.getDate()).padStart(2, '0'); // Garante que o dia tenha dois dígitos
    return `${ano}-${mes}-${dia}`;
}

function obterPrimeiroUltimoDiaDoAno() {
    const hoje = new Date();

    // Primeiro dia do ano
    const primeiroDia = new Date(hoje.getFullYear(), 0, 1); // Janeiro (0) e o dia 1

    // Último dia do ano
    const ultimoDia = new Date(hoje.getFullYear(), 11, 31); // Dezembro (11) e o dia 31

    return {
        primeiroDia: converterDataSql(primeiroDia),
        ultimoDia: converterDataSql(ultimoDia)
    };
}

function obterNomeMes(index) {
    const meses = [
        "janeiro", "fevereiro", "março", "abril", "maio", "junho",
        "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
    return meses[index];
}

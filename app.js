
class Despesa {
    constructor(ano, dia, mes, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //Percorre cada um dos elementos do objeto
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {

        //Array de despesas
        let despesas = Array();

        let id = localStorage.getItem('id');

        //Recuperar todas as despesas cadastradas
        for (let i = 1; i <= id; i++) {

            //RECUPERAR DESPESAS
            let despesa = JSON.parse(localStorage.getItem(i));

            if (despesa == null) {
                continue
            }

            despesa.id = i;
            despesas.push(despesa)
        }

        return despesas;

    }

    pesquisar(despesa) {

        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)//Retorna true ou false(Se o valor deve ou não ser retornado)
        }

        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd();

function cadastrarDespesa() {

    //Interessante recuperar somente a referencia inicialmente
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);

    if (despesa.validarDados()) {
        bd.gravar(despesa);
        atualizaModal('sucesso');
        limparCampos(ano, mes, dia, dia, tipo, descricao, valor);
    } else {
        atualizaModal('erro');
    }

}

function atualizaModal(tipo) {

    if (tipo == 'sucesso') {

        document.getElementById('tituloModal').innerText = 'Registro inserido com sucesso!';
        document.getElementById('conteudoModal').innerText = 'Despesa cadastrada com sucesso!';
        document.getElementById('botaoModal').classList.remove('btn-danger');
        document.getElementById('botaoModal').classList.add('btn-success');
        document.getElementById('botaoModal').innerText = 'Voltar';
        document.getElementById('divTituloModal').classList.remove('text-danger');
        document.getElementById('divTituloModal').classList.add('text-success');

    } else if (tipo == 'erro') {

        document.getElementById('tituloModal').innerText = 'Erro na gravação';
        document.getElementById('conteudoModal').innerText = 'Existem campos obrigatórios que não foram preenchidos!';
        document.getElementById('botaoModal').classList.remove('btn-success');
        document.getElementById('botaoModal').classList.add('btn-danger');
        document.getElementById('botaoModal').innerText = 'Voltar e Corrigir';
        document.getElementById('divTituloModal').classList.remove('text-success');
        document.getElementById('divTituloModal').classList.add('text-danger');

    }

    $('#statusModal').modal('show');
}

function limparCampos(...campos) {

    campos.forEach(function (c) {
        c.value = "";
    });

}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }

    //Selecionando o elemento <tbody>
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = "";

    //Percorrer o Array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function (d) {

        //Criando a linha (tr)
        let linha = listaDespesas.insertRow();

        //Criar as colunas
        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano;

        //Ajustar o tipo
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação'
                break
            case '2':
                d.tipo = 'Educação'
                break
            case '3':
                d.tipo = 'Lazer'
                break
            case '4':
                d.tipo = 'Saúde'
                break
            case '5':
                d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        //Criar o botão d eexclusão
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = 'id_despesa_'+d.id;
        btn.onclick = function(){

            let id = this.id.replace('id_despesa_', '')
            bd.remover(id);
            window.location.reload();

        }

        linha.insertCell(4).append(btn);

    });
}

function pesquisarDespesa() {

    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa);

    this.carregaListaDespesas(despesas, true)
}




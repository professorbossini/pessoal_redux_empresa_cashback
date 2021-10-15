const Redux = require ('redux')
//essa função é criadora de um tipo de ação
const criarContrato = (nome, taxa) => {
  //esse JSON que ela devolve é uma ação
  return {
    type: "CRIAR_CONTRATO",
    dados: {
      nome, taxa
    }
  }
}

//esta função é criadora de um tipo de ação
const cancelarContrato = (nome) => {
  //esse JSON que ela devolve é uma ação
  return {
    type: "CANCELAR_CONTRATO",
    dados: {
      nome
    }
  }
}

//esta função é criadora de um tipo de ação
const solicitarCashback = (nome, valor) => {
  //esse JSON que ela devolve é uma ação
  return {
    type: "CASHBACK",
    dados: {
      nome, valor
    }
  }
}

//esta função é um reducer
//quando chamada pela primeira vez, seu primeiro parâmetro será undefined
//já que não existirá histórico algum
//por isso, configuramos uma lista vazia como seu valor padrão
const historicoDePedidosDeCashback = (historicoDePedidosDeCashbackAtual = [], acao) => {
  //se a ação for CASHBACK, adicionamos o novo pedido à coleção existente
  if (acao.type === 'CASHBACK'){
    //uma cópia. Contém todos os existentes + o novo
    //não faça push
    return [
      ...historicoDePedidosDeCashbackAtual,
      acao.dados
    ]
  }
  //caso contrário, apenas ignoramos e devolvemos a coleção inalterada
  return historicoDePedidosDeCashbackAtual
}

//caixa começa zerado
const caixa = (dinheiroEmCaixa = 0, acao) => {
  if (acao.type === "CASHBACK"){
    dinheiroEmCaixa -= acao.dados.valor
  }
  else if (acao.type === "CRIAR_CONTRATO"){
    dinheiroEmCaixa += acao.dados.taxa
  }
  return dinheiroEmCaixa
}

//lista começa vazia
const contratos = (listaDeContratosAtual = [], acao) => {
  if (acao.type === "CRIAR_CONTRATO")
    return [...listaDeContratosAtual, acao.dados]
  if (acao.type === "CANCELAR_CONTRATO")
    return listaDeContratosAtual.filter(c => c.nome !== acao.dados.nome)
  return listaDeContratosAtual
}

//depois da definição de todas as funções
const { createStore, combineReducers } = Redux

const todosOsReducers = combineReducers({
  historicoDePedidosDeCashback,
  caixa,
  contratos
})

const store = createStore(todosOsReducers)

const transacao = (store) => {
  const nomes = ['Maria', 'João', 'Pedro', 'Cristina']
  const funcoes = {
    //Novo contrato
    0: (nome) => {
      const acao = criarContrato(nome, 50)
      store.dispatch(acao)
    },
    //Cancelar contrato
    1: (nome) => {
      const acao = cancelarContrato(nome)
      store.dispatch(acao)

    },
    //pedir cashback
    2: (nome) => {
      const valor = Math.random() * 20 + 10
      const acao = solicitarCashback(nome, valor)
      store.dispatch(acao)
    }
  }
  const op = Math.floor(Math.random() * 3)
  const indiceNome = Math.floor(Math.random() * nomes.length)
  funcoes[op](nomes[indiceNome])
  console.log(store.getState())
}

setInterval (() => transacao (store), 5000)


// const acaoContratoJose = criarContrato('José', 50)
// store.dispatch(acaoContratoJose)
// console.log(store.getState())
// const acaoContratoMaria = criarContrato ('Maria', 50)
// store.dispatch(acaoContratoMaria)
// console.log(store.getState())
// const acaoCashbackMaria = solicitarCashback('Maria', 10)
// store.dispatch(acaoCashbackMaria)
// console.log(store.getState())
// const acaoCashbackJose = solicitarCashback('José', 20)
// store.dispatch(acaoCashbackJose)
// console.log(store.getState())
// const acaoCancelaContratoMaria = cancelarContrato ('Maria')
// store.dispatch(acaoCancelaContratoMaria)
// console.log(store.getState())

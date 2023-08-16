import { Itens } from "./Itens.js";

class CaixaDaLanchonete {
  constructor() {
    this.cardapio = new Map();
    this.criaCardapio();
  }

  criaCardapio() {
    //criacao de um mapa tendo o "codigo" como chave e "descricao" e "valor" como valor
    this.cardapio.set("cafe", new Itens("Café", 3.0));
    this.cardapio.set("chantily", new Itens("Chantily", 1.5)); //extra
    this.cardapio.set("suco", new Itens("Suco Natural", 3.0));
    this.cardapio.set("sanduiche", new Itens("Sanduíche", 6.5));
    this.cardapio.set("queijo", new Itens("Queijo", 2.0)); //extra
    this.cardapio.set("salgado", new Itens("Salgado", 7.25));
    this.cardapio.set("combo1", new Itens("1 Suco e 1 Sanduíche", 9.5));
    this.cardapio.set("combo2", new Itens("1 Café e 1 Sanduíche", 7.5));
  }

  //metodo responsavel por calcular o valor da compra
  calcularValorDaCompra(metodoDePagamento, itens) {
    let valorCheio = 0;
    let pedido = [];
    let valorComAlteracao = 0;
    const descontoDinheiro = 0.05;
    const acrescimoCredito = 0.03;

    //bloco responsavel por percorrer o array de itens, separar "codigo" da "quantidade" (split), verificar se a qtd nao e igual 0 e procurar item no cardapio
    for (let i = 0; i < itens.length; i++) {
      let separadorItens = itens[i].split(",");
      let codigoItem = separadorItens[0];
      let quantidade = parseInt(separadorItens[1]);

      if (quantidade === 0) {
        return "Quantidade inválida!";
        break;
      }

      try {
        let itemEncontrado = this.encontrarItemNoCardapio(codigoItem);
        valorCheio += itemEncontrado.valor * quantidade;
        pedido.push(codigoItem);
      } catch (erro) {
        return erro.message;
      }
    }

    //lida com as diferentes formas de pagamento, calcula os valores com as devidas alterações e trata exceções caso elas ocorram.
    try {
      this.verificaIrregularidade(pedido);
      switch (metodoDePagamento) {
        case "dinheiro":
          valorComAlteracao = valorCheio - valorCheio * descontoDinheiro;
          break;
        case "credito":
          valorComAlteracao = valorCheio + valorCheio * acrescimoCredito;
          break;
        case "debito":
          valorComAlteracao = valorCheio;
          break;
        default:
          return "Forma de pagamento inválida!";
      }
    } catch (erro) {
      return erro.message;
    }

    //formatando o valor para o padrão desejado
    const valorSemArredondamento = valorComAlteracao.toFixed(2);
    const valorFormatado = `R$ ${valorSemArredondamento.replace(".", ",")}`;

    return valorFormatado;
  }

  //funcao responsavel por encontrar item no cardapio, caso nao encontre, lanca uma exception
  encontrarItemNoCardapio(codigoItem) {
    let itemEncontrado = this.cardapio.get(codigoItem);
    if (itemEncontrado) {
      return itemEncontrado;
    } else {
      throw new Error("Item inválido!");
    }
  }

  //funcao responsavel por verificar se o pedido fere algumas das regras de negocio
  verificaIrregularidade(pedido) {
    const temQueijo = pedido.includes("queijo");
    const temChantily = pedido.includes("chantily");
    const temCafe = pedido.includes("cafe");
    const temSanduiche = pedido.includes("sanduiche");

    if ((temChantily && !temCafe) || (temQueijo && !temSanduiche)) {
      throw new Error("Item extra não pode ser pedido sem o principal");
    }

    if (pedido.length === 0) {
      throw new Error("Não há itens no carrinho de compra!");
    }
  }
}

export { CaixaDaLanchonete };

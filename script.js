const linhas = document.querySelectorAll(".linha");
const placar = document.getElementById("placar");

// ======================================
// 125 PALAVRAS
// ======================================

const palavras = [
"CASAL","LIVRO","VENTO","PRAIA","SONHO",
"TREVO","MORRO","BRISA","MAGIA","FELIZ",
"PAPEL","NOITE","TEMPO","AMIGO","FORTE",
"ROUPA","DENTE","PEDRA","MUNDO","BOLSA",
"FONTE","TRIGO","PRATO","CLARO","FRUTA",
"GRITO","LIMPO","NINHO","PEIXE","PILHA",
"CORPO","FAIXA","TINTA","MANGA","REINO",
"AREIA","METAL","MOTOR","NAVIO","PODER",
"QUEDA","RAIOS","SELVA","TORRE","VALOR",
"ZEBRA","BEIJO","CALOR","DEDOS","FAROL",
"GIRAR","HOTEL","IDEIA","JANTA","LUTAR",
"MENTE","NUVEM","OUVIR","PARTE","QUASE",
"REZAR","SORTE","TIGRE","VIGOR","ZERAR",
"BANDO","CESTA","DANCA","ETAPA","FESTA",
"GANHO","HOMEM","JOVEM","LAPIS","MOEDA",
"NATAL","POMAR","RUMOR","SABER","TARDE",
"VIAJE","ZONAS","ABRIR","BAILE","CANTO",
"DIZER","ENTRA","FALAR","GOSTO","HABIT",
"IMPAR","JEITO","KARMA","LINDO","MEXER",
"NOBRE","ONTEM","PERTO","QUEIM","RISCO",
"SALTO","TENRO","UNIAO","VASTO","XAMAS",
"YACHT","ZANGA","ARDOR","BRAVO","CEDRO",
"DIVAS","ESTRE","FIBRA","GLIFO","HONRA",
"ISCAS","JOGAR","LABIR","MACIO","NUVIA"
];

// ======================================
// PONTUAÇÃO
// ======================================

let pontos =
Number(localStorage.getItem("pontos")) || 0;

placar.innerText =
`Pontuação: ${pontos}`;

// ======================================
// PALAVRAS USADAS
// ======================================

let palavrasUsadas =
JSON.parse(
localStorage.getItem("palavrasUsadas")
) || [];

// ======================================
// FINAL
// ======================================

if(palavrasUsadas.length >= 125){

  setTimeout(()=>{

    alert(
      "Parabéns, foram 125 palavras, 100 porque quero viver 100 vidas ao seu lado e 25 porque é o melhor numero ❤️"
    );

  },300);

}

// ======================================
// PALAVRA ATUAL
// ======================================

let palavraSecreta =
localStorage.getItem("palavraAtual");

if(!palavraSecreta){

  const disponiveis =
  palavras.filter(
    p => !palavrasUsadas.includes(p)
  );

  palavraSecreta =
  disponiveis[
    Math.floor(Math.random()*disponiveis.length)
  ];

  palavrasUsadas.push(palavraSecreta);

  localStorage.setItem(
    "palavrasUsadas",
    JSON.stringify(palavrasUsadas)
  );

  localStorage.setItem(
    "palavraAtual",
    palavraSecreta
  );

}

// ======================================
// ESTADO
// ======================================

let linhaAtual =
Number(localStorage.getItem("linhaAtual")) || 0;

let colunaAtual =
Number(localStorage.getItem("colunaAtual")) || 0;

let palavraAtual =
localStorage.getItem("palavraAtualDigitada") || "";

// ======================================
// RESTAURAR TABULEIRO
// ======================================

const tabuleiro =
JSON.parse(localStorage.getItem("tabuleiro"));

if(tabuleiro){

  for(let l=0; l<6; l++){

    for(let c=0; c<5; c++){

      const dado = tabuleiro[l][c];

      const botao =
      linhas[l].children[c];

      botao.innerText = dado.letra;
      botao.className = dado.classe;

    }

  }

}

// ======================================
// TECLADO PC
// ======================================

document.addEventListener("keydown",(evento)=>{

  const tecla =
  evento.key.toUpperCase();

  if(/^[A-ZÀ-Ú]$/.test(tecla)){
    inserirLetra(tecla);
  }

  if(evento.key === "Backspace"){
    apagarLetra();
  }

  if(evento.key === "Enter"){
    enviarPalavra();
  }

});

// ======================================
// TECLADO CELULAR
// ======================================

const teclas =
document.querySelectorAll(".tecla");

teclas.forEach((tecla)=>{

  tecla.addEventListener("click",()=>{

    const valor = tecla.innerText;

    if(valor === "⌫"){
      apagarLetra();
      return;
    }

    if(valor === "ENTER"){
      enviarPalavra();
      return;
    }

    inserirLetra(valor);

  });

});

// ======================================
// INSERIR
// ======================================

function inserirLetra(letra){

  if(colunaAtual >= 5) return;

  const botao =
  linhas[linhaAtual].children[colunaAtual];

  botao.innerText = letra;

  palavraAtual += removerAcento(letra);

  colunaAtual++;

  salvarJogo();
}

// ======================================
// APAGAR
// ======================================

function apagarLetra(){

  if(colunaAtual <= 0) return;

  colunaAtual--;

  palavraAtual =
  palavraAtual.slice(0,-1);

  linhas[linhaAtual]
  .children[colunaAtual]
  .innerText = "";

  salvarJogo();
}

// ======================================
// ENVIAR
// ======================================

function enviarPalavra(){

  if(palavraAtual.length < 5) return;

  verificarPalavra();
}

// ======================================
// VERIFICAR
// ======================================

function verificarPalavra(){

  const letrasSecretas =
  palavraSecreta.split("");

  const letrasJogador =
  palavraAtual.split("");

  // VERDE

  for(let i=0; i<5; i++){

    const botao =
    linhas[linhaAtual].children[i];

    if(
      letrasJogador[i] === letrasSecretas[i]
    ){

      botao.classList.add("correta");

      letrasSecretas[i] = null;
      letrasJogador[i] = null;

    }

  }

  // AMARELO / PRETO

  for(let i=0; i<5; i++){

    const botao =
    linhas[linhaAtual].children[i];

    if(letrasJogador[i] != null){

      if(
        letrasSecretas.includes(
          letrasJogador[i]
        )
      ){

        botao.classList.add("existe");

        letrasSecretas[
          letrasSecretas.indexOf(
            letrasJogador[i]
          )
        ] = null;

      }else{

        botao.classList.add("errada");

      }

    }

  }

  salvarJogo();

  // VITÓRIA

  if(palavraAtual === palavraSecreta){

    pontos++;

    localStorage.setItem(
      "pontos",
      pontos
    );

    setTimeout(()=>{

      alert("Parabéns!");

      limparRodada();

      location.reload();

    },300);

    return;
  }

  linhaAtual++;
  colunaAtual = 0;
  palavraAtual = "";

  salvarJogo();

  // DERROTA

  if(linhaAtual > 5){

    setTimeout(()=>{

      alert(
        `Fim de jogo! Palavra: ${palavraSecreta}`
      );

      limparRodada();

      location.reload();

    },300);

  }

}

// ======================================
// SALVAR
// ======================================

function salvarJogo(){

  localStorage.setItem(
    "linhaAtual",
    linhaAtual
  );

  localStorage.setItem(
    "colunaAtual",
    colunaAtual
  );

  localStorage.setItem(
    "palavraAtualDigitada",
    palavraAtual
  );

  const tabuleiro = [];

  linhas.forEach((linha)=>{

    const linhaDados = [];

    linha.querySelectorAll("button")
    .forEach((botao)=>{

      linhaDados.push({
        letra:botao.innerText,
        classe:botao.className
      });

    });

    tabuleiro.push(linhaDados);

  });

  localStorage.setItem(
    "tabuleiro",
    JSON.stringify(tabuleiro)
  );

}

// ======================================
// LIMPAR RODADA
// ======================================

function limparRodada(){

  localStorage.removeItem("linhaAtual");
  localStorage.removeItem("colunaAtual");
  localStorage.removeItem("palavraAtualDigitada");
  localStorage.removeItem("tabuleiro");
  localStorage.removeItem("palavraAtual");

}

// ======================================
// ACENTOS
// ======================================

function removerAcento(texto){

  return texto.normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"");

}
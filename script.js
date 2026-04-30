const linhas = document.querySelectorAll(".linha");

// =======================================
// 125 PALAVRAS
// =======================================

const palavras = [
  "CASAL","LIVRO","VENTO","PRAIA","MORRO",
  "SONHO","MOUSE","TREVO","FLORE","PAPEL",
  "NOITE","CHUVA","FELIZ","TEMPO","AMIGO",
  "RISOS","DOCES","SALTO","PONTE","CAMPO",
  "FORTE","ROUPA","DENTE","FOLHA","PEDRA",
  "MUNDO","NOBRE","BOLSA","FONTE","TRIGO",
  "PRATO","BRISA","CLARO","FRUTA","GRITO",
  "MAGIA","LIMPO","NINHO","PEIXE","CINTO",
  "PILHA","CORPO","FAIXA","TINTA","MANGA",
  "REINO","AREIA","METAL","MOTOR","NAVIO",
  "OSSOS","PODER","QUEDA","RAIOS","SELVA",
  "TORRE","UNIDO","VALOR","ZEBRA","JOGAR",
  "BEIJO","CALOR","DEDOS","ESTRE","FAROL",
  "GIRAR","HOTEL","IDEIA","JANTA","LUTAR",
  "MENTE","NUVEM","OUVIR","PARTE","QUASE",
  "REZAR","SORTE","TIGRE","URUBU","VIAJE",
  "XAMPU","ZERAR","BANDO","CESTA","DANÇA",
  "ETAPA","FESTA","GANHO","HOMEM","JOVEM",
  "LAPIS","MOEDA","NATAL","ÓPERA","POMAR",
  "QUEIJO","RUMOR","SABER","TARDE","ÚTILX",
  "VIGOR","WAFER","XAMÃS","YACHT","ZONAS",
  "ABRIR","BAILE","CANTO","DIZER","ENTRA",
  "FALAR","GOSTO","HABIT","IMPAR","JEITO",
  "KARMA","LINDO","MEXER","NOBEL","ONTEM"
];

// =======================================
// PONTUAÇÃO
// =======================================

let pontos = Number(localStorage.getItem("pontos")) || 0;

const placar = document.createElement("h2");

placar.innerText = `Pontuação: ${pontos}`;

document.body.insertBefore(
  placar,
  document.querySelector("main")
);

// =======================================
// PALAVRAS USADAS
// =======================================

let palavrasUsadas =
  JSON.parse(
    localStorage.getItem("palavrasUsadas")
  ) || [];

// =======================================
// FINAL DO JOGO
// =======================================

if (palavrasUsadas.length >= 125) {

  setTimeout(() => {

    alert(
      "Parabéns, foram 125 palavras, 100 porque quero viver 100 vidas ao seu lado e 25 porque é o melhor número ❤️"
    );

  }, 500);

  throw new Error("Fim do jogo");
}

// =======================================
// ESCOLHER PALAVRA
// =======================================

let palavraSecreta =
  localStorage.getItem("palavraAtual");

if (!palavraSecreta) {

  const palavrasDisponiveis =
    palavras.filter(
      palavra =>
        !palavrasUsadas.includes(palavra)
    );

  palavraSecreta =
    palavrasDisponiveis[
      Math.floor(
        Math.random() *
        palavrasDisponiveis.length
      )
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

// =======================================
// ESTADO DO JOGO
// =======================================

let linhaAtual =
  Number(localStorage.getItem("linhaAtual")) || 0;

let colunaAtual =
  Number(localStorage.getItem("colunaAtual")) || 0;

let palavraAtual =
  localStorage.getItem(
    "palavraAtualDigitada"
  ) || "";

// =======================================
// RESTAURAR TABULEIRO
// =======================================

const tabuleiroSalvo =
  JSON.parse(localStorage.getItem("tabuleiro"));

if (tabuleiroSalvo) {

  for (let linha = 0; linha < 6; linha++) {

    for (let coluna = 0; coluna < 5; coluna++) {

      const dado =
        tabuleiroSalvo[linha][coluna];

      const botao =
        linhas[linha].children[coluna];

      botao.innerText = dado.letra;
      botao.className = dado.classe;
    }
  }
}

// =======================================

document.addEventListener("keydown", (evento) => {

  const tecla = evento.key.toUpperCase();

  // LETRAS
  if (
    /^[A-ZÀ-Ú]$/.test(tecla) &&
    colunaAtual < 5
  ) {

    const botao =
      linhas[linhaAtual].children[colunaAtual];

    botao.innerText = tecla;

    palavraAtual += removerAcento(tecla);

    colunaAtual++;

    salvarJogo();
  }

  // BACKSPACE
  if (
    evento.key === "Backspace" &&
    colunaAtual > 0
  ) {

    colunaAtual--;

    palavraAtual =
      palavraAtual.slice(0, -1);

    linhas[linhaAtual]
      .children[colunaAtual]
      .innerText = "";

    salvarJogo();
  }

  // ENTER
  if (
    evento.key === "Enter" &&
    palavraAtual.length === 5
  ) {

    verificarPalavra();
  }

});

// =======================================

function verificarPalavra() {

  const letrasSecretas =
    palavraSecreta.split("");

  const letrasJogador =
    palavraAtual.split("");

  // VERDE
  for (let i = 0; i < 5; i++) {

    const botao =
      linhas[linhaAtual].children[i];

    if (
      letrasJogador[i] === letrasSecretas[i]
    ) {

      botao.classList.add("correta");

      letrasSecretas[i] = null;
      letrasJogador[i] = null;
    }
  }

  // AMARELO / PRETO
  for (let i = 0; i < 5; i++) {

    const botao =
      linhas[linhaAtual].children[i];

    if (letrasJogador[i] != null) {

      if (
        letrasSecretas.includes(
          letrasJogador[i]
        )
      ) {

        botao.classList.add("existe");

        letrasSecretas[
          letrasSecretas.indexOf(
            letrasJogador[i]
          )
        ] = null;

      } else {

        botao.classList.add("errada");
      }
    }
  }

  salvarJogo();

  // =======================================
  // VITÓRIA
  // =======================================

  if (palavraAtual === palavraSecreta) {

    pontos++;

    localStorage.setItem("pontos", pontos);

    setTimeout(() => {

      alert("Parabéns! Você acertou!");

      limparProgresso();

      location.reload();

    }, 300);

    return;
  }

  linhaAtual++;
  colunaAtual = 0;
  palavraAtual = "";

  salvarJogo();

  // =======================================
  // DERROTA
  // =======================================

  if (linhaAtual > 5) {

    setTimeout(() => {

      alert(
        `Fim de jogo! A palavra era ${palavraSecreta}`
      );

      limparProgresso();

      location.reload();

    }, 300);
  }
}

// =======================================
// SALVAR JOGO
// =======================================

function salvarJogo() {

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

  linhas.forEach((linha) => {

    const linhaDados = [];

    linha.querySelectorAll("button")
      .forEach((botao) => {

        linhaDados.push({
          letra: botao.innerText,
          classe: botao.className
        });

      });

    tabuleiro.push(linhaDados);

  });

  localStorage.setItem(
    "tabuleiro",
    JSON.stringify(tabuleiro)
  );
}

// =======================================
// LIMPAR PROGRESSO
// =======================================

function limparProgresso() {

  localStorage.removeItem("linhaAtual");
  localStorage.removeItem("colunaAtual");
  localStorage.removeItem("palavraAtualDigitada");
  localStorage.removeItem("tabuleiro");
  localStorage.removeItem("palavraAtual");
}

// =======================================
// REMOVER ACENTO
// =======================================

function removerAcento(texto) {

  return texto.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
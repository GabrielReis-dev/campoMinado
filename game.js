"use strict";
let _a;//Variável


let boardSize = 10; // Tamanho do tabuleiro (10x10)
let numMines = 10; // Número de minas

//Essa classe contem toda a lógica do jogo (tabuleiro, colocação de minas, verificação e revelação de células)
class Minesweeper { 
    constructor() {  //O constructor inicializa o tabuleiro e chama a função para inicializa-lo
        this.board = [];        //Propriedade "board" é a matriz 2D (Vetor de matriz), representa o tabuleiro
        this.gameOver = false;  //Enquanto gameOver for falso o jogo continua rodando 
        this.initializeBoard();
    }
    

     //(1) Função que Inicializa o tabuleiro com 3 propriedades
    initializeBoard() { 
        this.board = Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => ({//Cria uma matriz do tamanho até boardsize com as 3 propriedades
            isMine: false, //P1 Se a célula contem uma mina
            isRevealed: false, //P2 Se a célula foi revelada
            adjacentMines: 0 //P3 O numero de minas adjacentes
        })));
        
        
        //RESPONSÁVEL POR COLOCAR AS MINAS ALEATÓRIAMENTE, VAI FIACAR RODANDO ATÉ QUE SEJA COLOCADAS 10 MINAS ALEATÓRIAS
        let minesPlaced = 0; //Inicializa a partir de zero
        /*Laço=>*/while (minesPlaced < numMines) { //enquanto o número de minas colocadas for menor que 10 a função tenta colocar minas no tabuleiro
            let row = Math.floor(Math.random() * boardSize);//Gera uma linha aleatória 
            let col = Math.floor(Math.random() * boardSize);//Gera uma coluna aleatória
        if (!this.board[row][col].isMine) {//Se a célula não tiver uma mina colocada
                this.board[row][col].isMine = true;//Coloca  uma mina
                this.updateAdjacentCells(row, col);//Atualiza as células vizinhas para contar minasadjacentes
                minesPlaced++;//Conta um em um as minas colocadas até 10
            }
        }
    }
    //(2) A função vai "olhar" ao redor e atualizar o número de minas adjacentes para as células vizinhas.
    updateAdjacentCells(row, col) {//Função com 2 parametros
        for (let i = row - 1; i <= row + 1; i++) {//O laço vai percorrer "row que é a linha, na posiçao i" a partir do -1, 1, +1, ou seja três linhas.
            for (let j = col - 1; j <= col + 1; j++) {//Esse laço percorre as colunas, inicía á esquerda -1, 1, +1 e vai até a coluna á direita percorrendo tres colunas.
                if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {//Se i for igual 0 e i for até 10 e o J a partir ou igual de  0 até 10
                    this.board[i][j].adjacentMines++;//Vai incrementar de 1 em 1 as célilas adjacentes
                }
            }
        }
    }
    //(3) Revela uma célula
    revealCell(row, col) {
        if (this.gameOver || this.board[row][col].isRevealed)//Verificação, se o gameOver for verdadeiro o jogo acaba, e a fução impede que outro celula seja revelada
            return false;
        let cell = this.board[row][col];//Verifica se a celula ja foi revelada, se a celula ja foi revelada não é possíverl revelar ela outra vez, retorna falso
        cell.isRevealed = true;
        if (cell.isMine) {//Se a celula tiver uma mina o jogo acaba, gameOver é Verdadeiro
            this.gameOver = true;
            return false; // Acabou o jogo, o jogador clicou em uma mina
        }
        if (cell.adjacentMines === 0) { // Se células adjacentes for igual a zero,  
            for (let i = row - 1; i <= row + 1; i++) { //Vai percorrer a o laço de -1, 1, +1 Linhas e 
                for (let j = col - 1; j <= col + 1; j++) {//Vai percorrer as colunas de -1, 1, +1 
                    if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && !this.board[i][j].isRevealed) {//Se i for maior que zero, e menor que 10, e J também, e se a celula ao redor não foi revelada
                        this.revealCell(i, j);// Essa função é chamada recursivamente para revelar a célula
                    }
                }
            }
        }
        return true;//True para revelar que a célula foi revelada com sucesso
    }
    
    //(4) Função Reinicia o jogo
    resetGame() { 
        this.gameOver = false; //Se fim de jogo for falso 
        this.initializeBoard();// Chama a função que inicializa o tabuleiro
    }
}

//(5) Função para 'renderizar' o tabuleiro na interface do usuário (Navegador), recebe um objeto (game) que contem informaçoes como células e minas
function renderBoard(game) {   let boardElement = document.getElementById("board");//Seleciona o HTML como ID board
    boardElement.innerHTML = "";
    for (let i = 0; i < boardSize; i++) {//Loop para percorrer todas as células do tabuleiro (Linhas)
        for (let j = 0; j < boardSize; j++) { //Loop para percorrer colunas
            let cell = game.board[i][j];//Inicializa uma variável cell como bidimencional
            let cellElement = document.createElement("div");//Cria elemento html para representar a celula visualmetnte
            cellElement.classList.add("cell");
            if (cell.isRevealed) {//verifica se acelula foi revelada
                if (cell.isMine) {
                    cellElement.classList.add("mine");// Se tiver mina adiciona um ícone de bomba
                    cellElement.innerText = "💣";//Exibe o ícone
                }
                else {
                    cellElement.classList.add("revealed");//Se nao tiver mina, adiciona a classe SCC revealed para aplicar estilo visual
                    cellElement.innerText = cell.adjacentMines > 0 ? cell.adjacentMines.toString() : "";// Se as minas adjacentes for zero não há texto a ser exibido
                }
            }
            //(6) Adiciona o evento de clique na célula ()
            cellElement.addEventListener("click", () => {
                if (!game.revealCell(i, j)) {//Verifica se é uma mina
                    alert("Você clicou em uma mina! Jogo encerrado.");
                    renderBoard(game); // Re-renderiza o tabuleiro
                }
                else {
                    renderBoard(game);//Retorna True, chama a função renderboaed
                }
            });
            boardElement.appendChild(cellElement);
        }
    }
}
//(7) Função de reinicialização do jogo
(_a = document.getElementById("resetButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    let game = new Minesweeper();
    renderBoard(game);
});
// Inicializa o jogo
let game = new Minesweeper();
renderBoard(game);

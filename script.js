const board = [
    null,
    ' ',' ',' ',
    ' ',' ',' ',
    ' ',' ',' '
];

let computer, player;
let turn = 'X';
let running = false;

const draw_board = () => {
    for(let i = 1;i < 8;i=i+3){
        console.log(board[i],board[i+1],board[i+2]);
    }
};

const check_draw = () => {
    if(board.indexOf(' ') == -1) return true;
    return false;
};

const check_win = (player) => {
    const winning_combinations = [
        [1,2,3],[4,5,6],[7,8,9],
        [1,4,7],[2,5,8],[3,6,9],
        [1,5,9],[3,5,7]
    ];
    for(let i = 0;i < 8;i++){
        combination = winning_combinations[i];
        if(
            board[combination[0]] == player &&
            board[combination[1]] == player &&
            board[combination[2]] == player
        ){
            return true;
        } 
    }
    return false;
};

const is_available = (index) => {
    if(board[index]==' ') return true;
    else return false;
};

const minimax = (is_maximizing) => {
    if(check_win(computer)) return 10;
    if(check_win(player)) return -10;
    if(check_draw()) return 0;

    if(is_maximizing){
        let best_score = -Infinity;
        for(let move = 1;move < 10;move++){
            if(is_available(move)){
                board[move] = computer;
                let score = minimax(false);
                board[move] = ' ';
                best_score = Math.max(score,best_score);
            }
        }
        return best_score;
    }else{
        let best_score = Infinity;
        for(let move = 1;move < 10;move++){
            if(is_available(move)){
                board[move] = player;
                let score = minimax(true);
                board[move] = ' ';
                best_score = Math.min(score,best_score);
            }
        }
        return best_score;
    }
}

const human_move = (index) =>{
    if(is_available(index)){
        board[index] = player;
        return true;
    }else{
        console.log('Position unavailable')
        return false;
    }
};

const computer_move = () => {
    let best_score = -Infinity;
    let best_move = 0;
    for(let move = 1;move < 10;move++){
        if(is_available(move)){
            board[move] = computer;
            let score = minimax(false);
            board[move] = ' ';
            if(score > best_score){
                best_score = score;
                best_move = move;
            }
        }
    }
    board[best_move] = computer;
    return best_move;
};


const setPlayers = (p,c) => {
    player = p;
    computer = c;
    return {
        'Player':player,
        'Computer':computer
    };
};

const play = (p) => {

    if(computer == turn){
        computer_move();
        if(check_win(computer)) {
            turn = null;
            console.log('computer win');
            return 2;
        }
        turn = player;
    }else{
        if(!human_move(p)){
            return -1;
        }
        if(check_win(player)) {
            turn = null;
            console.log('Player win');
            return 1;
        }
        turn = computer;
    }
    if(check_draw()){
        turn = null;
        console.log('draw');
        return 0;
    }
    draw_board();
}
const chooseXBtn = document.getElementById('chooseX');
const chooseOBtn = document.getElementById('chooseO');
const playBtn = document.getElementById('playBtn');
const chosenSymbolText = document.getElementById('chosenSymbol');
const tictactoeBoard = document.getElementById('tictactoeBoard');
const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');

chooseXBtn.addEventListener('click', () => {
    player = 'X';
    chosenSymbolText.textContent = `You chose: ${player}`;
    chosenSymbolText.classList.remove('hidden');
    playBtn.classList.remove('hidden');
    computer = 'O';
});

chooseOBtn.addEventListener('click', () => {
    player = 'O';
    chosenSymbolText.textContent = `You chose: ${player}`;
    chosenSymbolText.classList.remove('hidden');
    playBtn.classList.remove('hidden');
    computer = 'X';
});

playBtn.addEventListener('click', () => {
    tictactoeBoard.classList.remove('hidden');
    chooseOBtn.classList.add('hidden');
    chooseXBtn.classList.add('hidden');
    running = true;
});

tictactoeBoard.addEventListener('click', (event) => {
   if(running){
        if (event.target.classList.contains('cell')) {
            const index = Array.from(cells).indexOf(event.target);
            console.log(`You clicked cell number: ${index}`);        
            if (event.target.textContent === '') {
                if(turn == player){
                    board[index+1] = player;
                    event.target.textContent = player;
                    turn = computer;
                }
            }
        }
   }
});

setInterval(()=>{
    if(check_draw()){
        result.textContent = "draw";
        running = false;
        result.classList.remove('hidden');
        return;
    }else if(check_win(computer)){
        result.textContent = "Computer wins";
        running = false;
        result.classList.remove('hidden');
        return;
    }else if(check_win(player)){
        result.textContent = "player wins";
        running = false;
        result.classList.remove('hidden');
        return;
    }
    if(turn == computer && running){
        const move = computer_move();
        const cell = cells[move-1]
        cell.textContent = computer;
        turn = player;
    }
}, 10)
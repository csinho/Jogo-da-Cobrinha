
class Game{
    constructor(){
        document.addEventListener("keydown",this.keyEvents.bind(this)) // ativar quando a tecla for pressionada
        this.a_dead = new Audio("https://www.dropbox.com/s/r7o9las1ki6tr0u/fail.wav?dl=1");
        this.a_eat = new Audio("https://www.dropbox.com/s/qukhjmxog6h3we8/crunch.wav?dl=1");
        this.a_start = new Audio("https://www.dropbox.com/s/xff36yvnh2zsxzh/start.wav?dl=1");
    }

    // tamanho da tela
    gameWindow(){ 
        this.winWidth = 400; 
        this.winHeight = 400;
        createCanvas(this.winWidth,this.winHeight).parent("gameBox");
    }


    // desenhar na tela
    draw(){
        background("rgb(255, 255, 0.8)"); // tela do jogo
        stroke("rgba(255, 255, 255,.5)") // cor da borda da tela do jogo
        // pontos em forma de coluna

        this.snake(); // desenhe a cobra
        this.apple(); //desenhe a maçã
        this.scoreBoard();
        this.bestScore();
    }
    
    update(){
        this.frame = false;
        this.draw(); // desenhar na tela
    }

    start(){
        this.positionX = 15; // ponto de partida da cobra X
        this.positionY = 10; // ponto de partida da cobra Y
        this.appleX = this.appleY = 10; // Localização inicial da Apple
        this.trail = []; // Série em que as coordenadas da serpente são mantidas
        this.tailSize = 5; // tamanho da cobra
        this.speedX = this.speedY = 0; // primeira velocidade da cobra
        this.gridSize = this.tileCount = 20; // o número de quadros da tela
        this.fps = 1000/18; // número de instantâneos
        this.timer = setInterval(this.update.bind(this),this.fps);
        this.score = 0;

    }

    reset(){
        clearInterval(this.timer); // redefine o tempo
        this.a_dead.play();
        this.start(); // reinicia o jogo
        
    }

    keyEvents(e){
        // vai para a esquerda
        if(e.keyCode === 37 && this.speedX !== 1){
            this.a_start.play();
            this.speedX = -1;
            this.speedY = 0;
            this.frame = true;
        }
        //dá certo
        if(e.keyCode === 39 && this.speedX !== -1){
            this.a_start.play();
            this.speedX = 1;
            this.speedY = 0;
            this.frame = true;
        }
        // desce
        if(e.keyCode === 40 && this.speedY !== -1){
            this.a_start.play();
            this.speedX = 0;
            this.speedY = 1;
            this.frame = true;
        }
        // sobe
        if(e.keyCode === 38 && this.speedY !== 1){
            this.a_start.play();
            this.speedX = 0;
            this.speedY = -1;
            this.frame = true;
        }
    }

    // elementos no jogo
    // serpente
    snake(){
        fill("rgb(130, 56, 172)");
        this.trail.forEach( a => {
            rect(a.positionX*20,a.positionY*20,this.gridSize-5,this.gridSize-5,20,20);
        })
        this.positionX += this.speedX;
        this.positionY += this.speedY;

        if (this.positionX < 0) {
        this.positionX = this.tileCount - 1;
        } else if (this.positionY < 0) {
        this.positionY = this.tileCount - 1;
        } else if (this.positionX > this.tileCount - 1) {
        this.positionX = 0;
        } else if (this.positionY > this.tileCount - 1) {
        this.positionY = 0;
        }
        
        // se vier sobre si
        this.trail.forEach( t=> {
            if(this.positionX === t.positionX && this.positionY === t.positionY){
            this.reset();
            }
        })

        // posição da cobra
        this.trail.push({positionX: this.positionX,positionY: this.positionY})


        //limita o tamanho da cobra
        while(this.trail.length > this.tailSize){
            this.trail.shift();
        }

        while(this.trail.length > this.tailSize){
            this.trail.shift();
        }
    }
    apple(){
        

        // desenhe a maçã
        fill("red");
        
        rect(this.appleX * this.tileCount, this.appleY *this.tileCount, this.gridSize -5, this.gridSize - 5,5,5);

        
        if(this.appleX === this.positionX && this.appleY === this.positionY){

            this.tailSize ++;
            this.score ++ ;
            this.appleX =  Math.floor(Math.random()*this.tileCount);
            this.appleY = Math.floor(Math.random()*this.tileCount);
            this.trail.forEach(t => {
                if(this.appleX === t.positionX && this.appleY == t.positionY) {
                  this.apple();
                }
            });
            this.a_eat.play();
        }
    }
    scoreBoard(){
        textSize(15);
        noStroke();
        fill(26);
        text("Pontos",10,20);
        textSize(20)
        text(this.score,32.5,45)
    }
    bestScore(){
        textSize(15);
        text("Recorde",340,20);
        if(!localStorage.getItem("best")){
            localStorage.setItem("best",0);
        }
        textSize(20)
        text(localStorage.getItem("best"),357,45);

        if(this.score > localStorage.getItem("best")){
            this.best =  this.score;
            localStorage.setItem("best",this.best);
        }
        
    }
}

const game = new Game();
window.onload = () => game.start();

function setup(){
    game.gameWindow();
}

function draw(){
    game.update();
}
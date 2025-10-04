const Motor = Matter.Engine,
      Mundo = Matter.World,
      Corpos = Matter.Bodies,
      SAT = Matter.SAT;


let motor;
let jogador;
let imagemfundo, imagemCOME, fonte;
let porta;
let chave;
let moeda;
let estadoJogo = "inicio";
let pegouChave = false;
let pegouMoeda = false;
let pontuacao = 0;


let plataformas = [];
let nivelAtual = 1;


function preload(){
  imagemfundo = loadImage('imagens/Sample.png');
  imagemCOME = loadImage('imagens/COME.jpg');
  
  fonte = loadFont('FONTE.ttf');

  imagemPorta_ComChave = loadImage('imagens/Porta_ComChave.png');
  imagemPortaFechada = loadImage('imagens/Porta_fechada.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);


  motor = Motor.create();
  mundo = motor.world;




  botaoreiniciar = createButton('Começar');
  botaoreiniciar.position(width-120, height-125);
  botaoreiniciar.size(100,100);
  botaoreiniciar.style('font-size', '20px');
  botaoreiniciar.style('background-color', 'violet');
  botaoreiniciar.style('border', '2px solid purple');
  botaoreiniciar.style('border-radius', '300px');
  botaoreiniciar.style('cursor', 'pointer');
  botaoreiniciar.mousePressed(reiniciar);




  botaoesquerda = createButton('←');
  botaoesquerda.position(width/18, height-125);
  botaoesquerda.size(100,100);
  botaoesquerda.style('font-size', '40px');
  botaoesquerda.style('background-color', 'violet');
  botaoesquerda.style('border', '2px solid purple');
  botaoesquerda.style('cursor', 'pointer');
  botaoesquerda.mousePressed(() => jogador.mover(-0.08));


  botaodireita = createButton('→');
  botaodireita.position(width/4, height-125);
  botaodireita.size(100,100);
  botaodireita.style('font-size', '40px');
  botaodireita.style('background-color', 'violet');
  botaodireita.style('border', '2px solid purple');
  botaodireita.style('cursor', 'pointer');
  botaodireita.mousePressed(() => jogador.mover(0.08));


  botaopular = createButton('⤒');
  botaopular.position(width-120, height-125);
  botaopular.size(100,100);
  botaopular.style('font-size', '40px');
  botaopular.style('background-color', 'violet');
  botaopular.style('border', '2px solid purple');
  botaopular.style('border-radius', '300px');
  botaopular.style('cursor', 'pointer');
  botaopular.mousePressed(() => jogador.pular());


  // Fundo
  fundo = createSprite(windowWidth/4+610, windowHeight/4-300);
  fundo.addImage(imagemfundo);
  fundo.scale = 3.5;


  iniciarNivel(nivelAtual);
}


function draw() {
  background(imagemfundo);


  Motor.update(motor);


 
  if (jogador && jogador.corpo.position.y > height - 100) {
    estadoJogo = "perdeu";
  }


  if (estadoJogo === "comemoração") {
    botaopular.hide()
    botaoesquerda.hide()
    botaodireita.hide()
    background("black");
    drawSprites();
    fill("DeepPink");
    textFont(fonte);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("Pegue um mimo pela sua vitória!", width/2, height/2);
    return;

  }


  if (estadoJogo === "perdeu") {
    botaodireita.hide();
    botaoesquerda.hide();
    botaopular.hide();
    botaoreiniciar.show();
    background("Forestgreen");
    textFont(fonte);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Você perdeu! Tente novamente.", width/2, height/2);
    textSize(38);
    text("Aperte espaço para reiniciar.", width/2, height-100);
    return;
  }


  if (estadoJogo === "inicio") {
    pontuacao = 0;
    botaodireita.hide();
    botaoesquerda.hide();
    botaopular.hide();
    textFont(fonte);
    fill("DeepPink");
    textAlign(CENTER, CENTER);
    textSize(64);
    text("Bunny Math", width/2, height-400);
    fill("black");
    textSize(38);
    text("Aperte espaço para começar.", width/2, height-330);
    return;
  }


  if (estadoJogo === "jogando") {
    botaoreiniciar.hide();
    botaopular.show();
    botaodireita.show();
    botaoesquerda.show();


    push();
    translate(-jogador.corpo.position.x + width/2, -jogador.corpo.position.y + height/2);


    drawSprites();
    if (jogador) jogador.mostrar();
    if (porta) porta.mostrar();
    if (!pegouChave) chave.mostrar();
    if (!pegouMoeda) moeda.mostrar();


    for (let plataforma of plataformas) {
      plataforma.mostrar();
      if (jogadorTocandoPlataforma(jogador, plataforma)) jogador.resetarPulos();
    }


    verificarColisaoPorta(jogador, porta);
    verificarColisaoChave(jogador, chave);
    verificarColisaoMoeda(jogador, moeda);
    pop();


    fill("DeepPink");
    textSize(28);
    text("Nível Atual: " + nivelAtual, width-300, height-150);
  }


  if (estadoJogo === "errouQuiz") {
    background("purple");
    textFont(fonte);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Você errou a equação! Volte para o começo.", width/2, height/2);
    textSize(38);
    text("Aperte o botão para reiniciar.", width/2, height-100);
  }


  fill("Black");
  textSize(28);
  text("Pontuação: " + pontuacao, width-300, height-100);
}




function keyPressed() {
  if (keyCode === RIGHT_ARROW) jogador.mover(0.08);
  else if (keyCode === LEFT_ARROW) jogador.mover(-0.08);
  else if (keyCode === UP_ARROW) jogador.pular();
  else if (estadoJogo === "perdeu" || estadoJogo === "errouQuiz" || estadoJogo === "inicio") {
    if (key === ' ') reiniciar();
  }
}


function jogadorTocandoPlataforma(jogador, plataforma) {
  const posJogador = jogador.corpo.position;
  const posPlataforma = plataforma.corpo.position;
  const margem = 5;


  return posJogador.y + jogador.altura / 2 >= posPlataforma.y - plataforma.altura / 2 - margem &&
         posJogador.y + jogador.altura / 2 <= posPlataforma.y - plataforma.altura / 2 + margem &&
         posJogador.x + jogador.largura / 2 >= posPlataforma.x - plataforma.largura / 2 &&
         posJogador.x - jogador.largura / 2 <= posPlataforma.x + plataforma.largura / 2;
}


function verificarColisaoPorta(jogador, porta) {
  const colisao = SAT.collides(jogador.corpo, porta.corpo);
  if (colisao.collided && pegouChave) mostrarQuiz();
}


function mostrarQuiz() {
  let resposta;
  if (nivelAtual == 1) resposta = prompt("3x-5=16\n a)7\n b)11\n c)21\n d)9");
  else if (nivelAtual == 2) resposta = prompt("2(x+4)=3x-2\n a)-10\n b)8\n c)10\n d)4");
  else if (nivelAtual == 3) resposta = prompt("2(3x+1)-3(6-2x)=20\n a)18\n b)6\n c)3\n d)9");
  else if (nivelAtual == 4) resposta = prompt("9x - 4x + 10 = 7x - 30\n a)18\n b)20\n c)7\n d)9");
  else if (nivelAtual == 5) resposta = prompt("(3x - 5)/2 + 4 = (2x + 7)/3 + 5\n a)5\n b)7\n c)12\n d)6");


  const respostasCorretas = ["a", "c", "c", "b", "d"];
  if (resposta && resposta.toLowerCase() === respostasCorretas[nivelAtual-1]) {
    alert(nivelAtual === 5 ? "Parabéns! Você é o mestre da matemática!" : "Resposta correta! Indo para o próximo nível...");
    pontuacao += 25;
    nivelAtual++;
    iniciarNivel(nivelAtual);
  } else {
    estadoJogo = "errouQuiz";
  }
}




function reiniciar() {
  pegouChave = false;
  pegouMoeda = false;


  if (jogador && jogador.corpo) {
    Matter.Body.setPosition(jogador.corpo, {x:150, y:height -250});
  }

  if (porta) porta.imagem = imagemPorta_ComChave;

  if (nivelAtual === 6) estadoJogo = "comemoração";
  else estadoJogo = "jogando";
}


function verificarColisaoChave(jogador, chave) {
  const distancia = dist(jogador.corpo.position.x, jogador.corpo.position.y,
                         chave.corpo.position.x, chave.corpo.position.y);
  if (distancia < 80 && !pegouChave) {
    pegouChave = true;
    pontuacao += 5;
    Mundo.remove(mundo, chave.corpo);
    if (porta){
      porta.image = imagemPortaFechada; // ← só troca quando PEGAR a chave
    }
  }
}


function verificarColisaoMoeda(jogador, moeda) {
  const distancia = dist(jogador.corpo.position.x, jogador.corpo.position.y,
                         moeda.corpo.position.x, moeda.corpo.position.y);
  if (distancia < 80 && !pegouMoeda) {
    pegouMoeda = true;
    pontuacao += 10;
    Mundo.remove(mundo, moeda.corpo);
  }
}


// --- Níveis ---
function nivel1() {
  jogador = new Jogador(150, height - 250, 50, 50);
  porta = new Porta(1600, height - 1250, 100, 100, imagemPorta_ComChave);
  chave = new Chave(1400, height - 1050, 70, 70);
  moeda = new Moeda(500, height - 700, 50, 50);


  plataformas.push(new Plataformas(1600, height-1200, 200,20));
  plataformas.push(new Plataformas(500, height-600, 200,20));
  plataformas.push(new Plataformas(100, height-200, 200,20));
  plataformas.push(new Plataformas(1200, height-900, 200,20));
  plataformas.push(new Plataformas(900, height-400, 200,20));
}


function nivel2() {
  estadoJogo = "jogando";
  jogador = new Jogador(150, height - 250, 50, 50);
  porta = new Porta(1800, height -1300, 100, 100, imagemPorta_ComChave);
  chave = new Chave(1400, height -1050,70,70);
  moeda = new Moeda(500, height -700, 50, 50);


  plataformas.push(new Plataformas(1800, height - 1250, 200, 20));  
  plataformas.push(new Plataformas(1300, height - 650, 150, 20));  
  plataformas.push(new Plataformas(850, height - 950, 180, 20));
  plataformas.push(new Plataformas(600, height - 600, 150, 20));        
  plataformas.push(new Plataformas(100, height - 200, 250, 20));  
}




function nivel3(){
    pegouChave=false
  estadoJogo="jogando";
   
   jogador = new Jogador (150, height - 250, 50, 50);
    porta = new Porta(2100, height -1150, 100, 100, imagemPorta_ComChave);
    chave = new Chave(1400, height -1050,70,70 )
    moeda = new Moeda(800, height -600, 50, 50);

 plataformas.push(new Plataformas(100, height - 150, 200, 20));       // inicial
  plataformas.push(new Plataformas(500, height - 300, 150, 20));       // salto horizontal médio
  plataformas.push(new Plataformas(900, height - 750, 120, 20));       // precisa de precisão
  plataformas.push(new Plataformas(1250, height - 950, 150, 20));      // boa para recuperar impulso
  plataformas.push(new Plataformas(1700, height - 700, 150, 20));      // mais difícil
  plataformas.push(new Plataformas(2100, height - 1100, 150, 20)); }

function nivel4(){
    pegouChave=false
  estadoJogo="jogando";
   
 jogador = new Jogador(150, height - 250, 50, 50);
porta = new Porta(2400, height - 1200, 100, 100, imagemPorta_ComChave);
chave = new Chave(1850, height - 800, 70, 70);
moeda = new Moeda(1100, height - 500, 50, 50);

plataformas.push(new Plataformas(100, height - 150, 200, 20));        // inicial
plataformas.push(new Plataformas(500, height - 300, 150, 20));        // salto 1
plataformas.push(new Plataformas(850, height - 500, 120, 20));        // moeda
plataformas.push(new Plataformas(1250, height - 700, 150, 20));       // impulso
plataformas.push(new Plataformas(1700, height - 800, 150, 20));       // chave
plataformas.push(new Plataformas(2100, height - 1000, 150, 20));      // final
plataformas.push(new Plataformas(2400, height - 1150, 150, 20));    
 }

function nivel5(){
    pegouChave=false
  estadoJogo="jogando";
   
 jogador = new Jogador(150, height - 250, 50, 50);
  porta = new Porta(2800, height - 1200, 100, 100, imagemPorta_ComChave);
  chave = new Chave(2200, height - 950, 70, 70);
  moeda = new Moeda(1400, height - 700, 50, 50);

  plataformas.push(new Plataformas(100, height - 150, 180, 20));
  plataformas.push(new Plataformas(500, height - 400, 150, 20));
  plataformas.push(new Plataformas(900, height - 650, 120, 20));
  plataformas.push(new Plataformas(1300, height - 750, 150, 20));
  plataformas.push(new Plataformas(1700, height - 600, 100, 20));
  plataformas.push(new Plataformas(2100, height - 850, 130, 20));
  plataformas.push(new Plataformas(2500, height - 1000, 150, 20));
  plataformas.push(new Plataformas(2800, height - 1150, 200, 20)); }


function nivel6(){
  estadoJogo = "comemoração";
  sprite = createSprite(width/2, height/2);
  sprite.addImage(imagemCOME);
  sprite.scale=3
}




function iniciarNivel(nivel){
  removerTudo();
  if(nivel===1) nivel1();
  else if(nivel===2) nivel2();
  else if(nivel===3) nivel3();
  else if(nivel===4) nivel4();
  else if(nivel===5) nivel5();
  else if(nivel===6) nivel6();
}




function removerTudo(){
  for (let plataforma of plataformas){
    if(plataforma.corpo) Mundo.remove(mundo, plataforma.corpo);
  }
  plataformas = [];


  if(chave && chave.corpo){ Mundo.remove(mundo, chave.corpo); chave=null; }
  if(porta && porta.corpo){ Mundo.remove(mundo, porta.corpo); porta=null; }
  if(moeda && moeda.corpo){ Mundo.remove(mundo, moeda.corpo); moeda=null; }
}




function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}




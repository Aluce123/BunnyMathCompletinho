class Moeda {
  constructor(x, y, largura, altura) {
    this.corpo = Matter.Bodies.rectangle(x, y, largura, altura, { isStatic: true });
    this.largura = largura;
    this.altura = altura;
    this.image = loadImage('imagens/coin_gold.png');
    Matter.World.add(mundo, this.corpo);
  }

  mostrar() {
    const posicao = this.corpo.position;
    push();
    imageMode(CENTER);
    image(this.image, posicao.x, posicao.y, this.largura, this.altura);
    pop();
  }
}
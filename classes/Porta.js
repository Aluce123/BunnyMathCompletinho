class Porta {
  constructor(x, y, largura, altura, img) {
    this.corpo = Matter.Bodies.rectangle(x, y, largura, altura, { isStatic: true });
    this.largura = largura;
    this.altura = altura;
    this.image = img;
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
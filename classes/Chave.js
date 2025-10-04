//Aumentar pontos se acertar, se errar diminuir pontuação e quando tiver encaixando a chave na porta, 
// aparecer a equação, se errar tela de derrota e menos pontos.
// Obs: Se ele nao pegar a chave e for pra porta ou ele perde a pontuação da chave e/ou nao aparece a equação.
// ou colocar moeda para a pontuação e chave perto da porta(na frente ou tendo q fazer um desafio tipo pular bem alto) e COM a chave passar para a proxima fase tocando na porta.

class Chave{
   constructor(x,y, largura, altura){
    this.corpo=Matter.Bodies.rectangle(x,y, largura, altura, {isStatic:true});
    this.largura=largura;
    this.altura=altura;
    this.image = loadImage('imagens/key_yellow.png')
    Matter.World.add(mundo,this.corpo);
   }


   mostrar(){
    const posicao=this.corpo.position;
    push();
    imageMode(CENTER);
    image(this.image, posicao.x, posicao.y, this.largura, this.altura);
    pop();
   }
}
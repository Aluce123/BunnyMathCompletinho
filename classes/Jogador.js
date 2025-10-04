class Jogador{
    constructor(x,y, largura, altura){
        this.corpo= Matter.Bodies.rectangle(x,y, largura, altura);
        this.largura= largura
        this.altura=altura
        this.pulosDisponiveis = 3;


        Matter.World.add(mundo, this.corpo);

        this.animacao = loadAnimation(
            'imagens/bunny2_stand.png ',
            'imagens/bunny2_ready.png',
            'imagens/bunny2_walk1.png',
            'imagens/bunny2_walk2.png'
        )

    }

    mostrar(){
const posicao = this.corpo.position;

push();
//quando eu for executar algo desta classe, ele vai empurrar isto aqui.
translate(posicao.x, posicao.y)
scale(0.4);
fill("red");
imageMode(CENTER);
animation(this.animacao, 0, 0)
pop();
//retira essas informações(pop)
    }


    mover(direcao){
        Matter.Body.applyForce(this.corpo, this.corpo.position, {x:direcao, y:0});
    }
pular(){
    if(this.pulosDisponiveis>0){
        Matter.Body.applyForce(this.corpo, this.corpo.position, {x:0, y:-0.08})
        this.pulosDisponiveis--;
    }
}

resetarPulos(){
    this.pulosDisponiveis= 3;
}

}

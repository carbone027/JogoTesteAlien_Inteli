/* definindo as variáveis que armazenam a altura e largura do jogo, para que essas medidas sejam usadas
mais facilmente em outros momentos */
var alturaJogo = 560;
var larguraJogo = 525;

var config = {
    type: Phaser.AUTO,
    //aqui, utiliza-se as variáveis criadas ao invés de adicionar manualmente as medidas da página
    width: larguraJogo,
    height: alturaJogo,
    //adicionando física ao jogo
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 300},
            debug: false,
        }
    },
    //adicionando os métodos de pré-carregamento, criação e atualização de elementos da cena
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
}

var game = new Phaser.Game(config);
//criando uma variável para melhorar a flexibilidade do jogo na adição de teclas
var key;
//criando variáveis para adicionar elementos na cena futuramente
var turbo;
var plataforma;
var moeda;
var pontuacao = 0;
var placar;
//aqui será utilizada essa variável plataforma2 para criar mais uma plataforma e adicioná-la ao cenário
var plataforma2;

//pré-carregando as informações das imagens na página
function preload () {
    this.load.image("bg", "assets/bg.png");
    this.load.image("player", "assets/alienigena.png");
    this.load.image("turbo", "assets/turbo.png");
    this.load.image("plat", "assets/tijolos.png");
    this.load.image("moeda", "assets/moeda.png");
};
//criando os elementos da página
function create () {
    /* aqui, as coordenadas também são adicionadas na criação da imagem por meio das variáveis e não
    adicionando as medidas manualmente */
    this.add.image(larguraJogo/2, alturaJogo/2, "bg").setScale(0.7);

    //adicionando o modo turbo como um sprite (podem ser adicionadas funções específicas a ele)
    turbo = this.add.sprite(0, 0, "turbo").setScale(0.7);
    //naturalmente, deixa-se o fogo como invisível
    turbo.setVisible(false);

    //adiciona-se o alien como um sprite sujeito à física do jogo
    alien = this.physics.add.sprite(larguraJogo/2, 0, "player").setScale(0.7);
    //adiciona-se limites ao mundo do jogo, para que o alien não caia para fora da página
    alien.setCollideWorldBounds(true);
    /* o setBounce é muito mais estético do que funcional em si, ele apenas faz com que o alien quique
    quando cai */
    alien.setBounce(0.2);

    /* adicionando a plataforma por meio da variável antes criada. a ela é adicionada física, mas não do
    mesmo modo como foi feito com o alien, e sim como uma imagem estática */
    plataforma = this.physics.add.staticImage(larguraJogo/2, alturaJogo/2, "plat");
    //adicionando colisão entre a plataforma e o player
    this.physics.add.collider(alien, plataforma);
    plataforma2 = this.physics.add.staticImage(larguraJogo/4, alturaJogo*3/4, "plat");
    this.physics.add.collider(alien, plataforma2);

    /* utilizam-se os mesmos métodos que foram usados para tornar o alien um elemento físico na cena, 
    fazer ele quicar, não cair para fora do mundo e colidir com a plataforma, só que para a moeda */
    moeda = this.physics.add.sprite(larguraJogo/2, 0, "moeda");
    moeda.setCollideWorldBounds(true);
    moeda.setBounce(0.7);
    this.physics.add.collider(moeda, plataforma);
    this.physics.add.collider(moeda, plataforma2);

    /* preferi utilizar a função addKeys aqui porque ela permite uma variedade muito maior de teclas
    adicionadas ao jogo */
    this.key = this.input.keyboard.addKeys("W, A, S, D, Up, Left, Down, Right");

    //adicionando um texto que exibe o placar do jogador à tela
    placar = this.add.text(50, 50, "Moedas: " + pontuacao, {fontSize: "45px", fill: "#495613"})
    //adicionando uma sequência de eventos que ocorrerá quando o player tocar as moedas
    this.physics.add.overlap(alien, moeda, /* alien, moeda diz que algo acontecerá quando esses
    elementos em específicos estiverem sobrepostos (função overlap) */ function() /* a função é o que
    ocorrerá quando a condição de os elementos estiverem sobrepostos for verdadeira */ {
        //primeiro, a moeda fica invisível
        moeda.setVisible(false);
        /* depois, é sorteado um número entre 50 e 475 (50 pixels antes e depois da largura máxima e 
            mínima da tela, respectivamente) e armazena-se esse valor em uma variável */
        var novaPosicaoMoeda = Phaser.Math.RND.between(50, 475);
        //define a posicao da moeda novamente baseado no número sorteado
        //até agora, a moeda desapareceu da tela e mudou de posição
        moeda.setPosition(novaPosicaoMoeda, 100);
        //após isso, aumenta pontuação em 1
        pontuacao++;
        //mostra o placar de novo, com a pontuação atualizada
        placar.setText("Moedas: " + pontuacao);
        //a moeda se torna visível de novo
        moeda.setVisible(true);
        })
}
//adicionando elementos que poderão ser utilizados após a página já ter sido carregada e executada
function update () {
    /* implementação dos controles do personagem por meio de estrutura if/else (se a tecla x estiver
        pressionada, então o personagem fará uma ação y) */
    if(this.key.W.isDown || this.key.Up.isDown){
        /* nesse caso, é utilizada a função setVelocity para que o personagem se desloque em uma certa
        direção (note que o eixo Y decresce conforme a altura da tela, no sentido convencional, aumenta) */
        alien.setVelocityY(-150);
        //quando o player pressiona para subir, o fogo aparece
        comTurbo();
    } else {
        //quando o player não pressiona para subir, o fogo desaparece
        semTurbo();
    };
    if(this.key.A.isDown || this.key.Left.isDown) {
        alien.setVelocityX (-150);
    } else if (this.key.D.isDown || this.key.Right.isDown) {
        alien.setVelocityX (150);
    }

    /* aqui, designa-se a posição do fogo na função update, já que assim essa posição será atualizada
    constantemente */
    turbo.setPosition(alien.x, alien.y + alien.height/2.5)
};

//essas são as funções que serão utilizadas para fazer com que o fogo apareça ou desapareça, apenas isso
function comTurbo () {
    turbo.setVisible(true);
};
function semTurbo () {
    turbo.setVisible(false);
};
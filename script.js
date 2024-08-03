window.onload = function() {

    // coisas gerais ------------------------------------------------------------------
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Ajusta o canvas para preencher o espaço disponível
    lc = 0; // largura canvas
    ac = 0; // altura canvas
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    // Redimensiona o canvas quando a janela é redimensionada
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    
    
    window.fps = 30; // frames per second
    window.interval = 1000/fps; // 1000 milisegundos (1s) divididos em fps (30) partes
    window.lastTime = 0; // último tempo decorrido
    // --------------------------------------------------------------------------------

    // Esfera -------------------------------------------------------------------------
    m = 100;
    r = (m**(1/2))*(1.5);
    dist_parede = r;
    x = canvas.width/2;
    y = dist_parede;
    g = 9.78;
    v = 0;
    colidiu = false;
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function desenhar_esfera(){
        // esfera 1 
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        //ctx.stroke();
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function atualizar_posicao(){
        v += g; 
        if (y + r + v >= canvas.height) {
            y = canvas.height - r;
            colidiu = true;
        }
        if (colidiu == false) {
            y += v;
        }
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function limpar_tela(){
        // limpa toda a tela para redesenhar por cima tudo atualizado
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // --------------------------------------------------------------------------------
    
    // --------------------------------------------------------------------------------
    function rodar_simulacao(timestamp){
        // se já passou mais tempo do que o tamanho de um dos 30 pedacinhos de tempo definidos acima
        if (timestamp - window.lastTime >= window.interval) {
            window.lastTime = timestamp;
            // atualiza esse tempo como o tempo atual e depois espera passar de novo
            limpar_tela();
            atualizar_posicao();
            desenhar_esfera();
        }
        requestAnimationFrame(rodar_simulacao);
    }
    // --------------------------------------------------------------------------------

    requestAnimationFrame(rodar_simulacao);

};

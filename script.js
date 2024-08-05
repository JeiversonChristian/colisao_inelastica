window.onload = function() {

    // coisas gerais ------------------------------------------------------------------
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Ajusta o canvas para preencher o espaço disponível
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
    m = 100; // massa
    r = (m**(1/2))*(1.5); // raio
    dist_teto = r; // distância inicial até o "teto"
    x = canvas.width/2;
    y = dist_teto;
    g = 9.78;
    v = 0;
    dir_v = 1; // direção da velocidade: 1 -> pra baixo; -1 -> pra cima
    colidiu = false;
    coef_rest = 0.9; // coeficiente de restituição
    parou = false;
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function desenhar_esfera(){
        // esfera 1 
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function atualizar_posicao(){
        if (parou == false) {
            // atualiza velocidade de acordo com a gravidade e a direção
            v += g * dir_v; 
            // se chegou no chão (caindo)
            if (y + r + v >= canvas.height && dir_v == 1) {
                // gruda na parede
                y = canvas.height - r;
                // acusa colisão
                colidiu = true;
                // muda direção de movimento (pra subir)
                dir_v = -1;
                // calcula nova velocidade
                v = v * coef_rest;
                // velocidade máxima para não bugar o movimento
                if (v < r/2) {
                    parou = true;
                }
            }
            // so mexe se não colidiu, porque se colidir, tem que grudar na parede primeiro
            if (colidiu == false) {
                y += v * dir_v;
            }
            // se chegou na altura máxima (quando v == 0)
            if (v <= 0) {
                // tem que cair
                dir_v = 1;
            }
            // se mudar de direção quando caiu, então tem que desgrudar do chão
            // ou seja, a colisão já aconteceu e tem que ser desconsiderada
            if (dir_v == -1){
                colidiu = false;
            }
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

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

    play = false;
    pause = false;
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

    // Imagens ------------------------------------------------------------------------
    // play
    const img_play = new Image();
    img_play.src = 'imagens/play-button.png';
    const ximg_play = canvas.width - 60;
    const yimg_play = canvas.height - 60;
    const larg_play = canvas.width/11;
    const alt_play = canvas.width/11;
    // pause
    const img_pause = new Image();
    img_pause.src = 'imagens/pause-button.png';
    const ximg_pause = canvas.width - 105;
    const yimg_pause = canvas.height - 60;
    const larg_pause = canvas.width/11;
    const alt_pause = canvas.width/11;
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function checar_clique(event){
        // Obtém as coordenadas do clique ou toque em relação ao canvas
        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;
        
        //play
        // Verifica se o clique ou toque ocorreu dentro da área da imagem
        if (clickX >= ximg_play && clickX <= ximg_play + larg_play && clickY >= yimg_play && clickY <= yimg_play + alt_play) {
            play = true;
            pause = false;
        }
        //pause
        if (clickX >= ximg_pause && clickX <= ximg_pause + larg_pause && clickY >= yimg_pause && clickY <= yimg_pause + alt_pause) {
            pause = true;
        }
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function verificar_botoes(){
        // Adiciona ouvintes de eventos de clique e toque ao canvas
        canvas.addEventListener('click', checar_clique);
        canvas.addEventListener('touchstart', checar_clique);
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function desenhar_esfera(){
        // esfera
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function desenhar_botoes(){
        // play 
        xfundo_play = ximg_play + larg_play/2;
        yfundo_play = yimg_play + alt_play/2;
        rfundo_play = larg_play/2;
        ctx.beginPath();
        ctx.arc(xfundo_play, yfundo_play, rfundo_play, 0, Math.PI*2, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.drawImage(img_play, ximg_play, yimg_play, larg_play, alt_play);
        //pause
        xfundo_pause = ximg_pause + larg_pause/2;
        yfundo_pause = yimg_pause + alt_pause/2;
        rfundo_pause = larg_pause/2;
        ctx.beginPath();
        ctx.arc(xfundo_pause, yfundo_pause, rfundo_pause, 0, Math.PI*2, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.drawImage(img_pause, ximg_pause, yimg_pause, larg_pause, alt_pause);
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function atualizar_posicao(){
        if (parou == false && play == true && pause == false) {
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
            verificar_botoes();
            limpar_tela();
            atualizar_posicao();
            desenhar_esfera();
            desenhar_botoes();
        }
        requestAnimationFrame(rodar_simulacao);
    }
    // --------------------------------------------------------------------------------

    requestAnimationFrame(rodar_simulacao);

};

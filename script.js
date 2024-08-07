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
    pause = true;
    parou = false;
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
    // --------------------------------------------------------------------------------

    // Imagens ------------------------------------------------------------------------
    // play
    const img_play = new Image();
    img_play.src = 'imagens/play-button.png';
    // pause
    const img_pause = new Image();
    img_pause.src = 'imagens/pause-button.png';
    // restart
    const img_restart = new Image();
    img_restart.src = 'imagens/restart-button.png';
    // coordenadas dos botões de play, pause e restart:
    const ximg_p = canvas.width - 60;
    const yimg_p = canvas.height - 60;
    const larg_p = canvas.width/11;
    const alt_p = canvas.width/11;
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function checar_clique(event){
        // Obtém as coordenadas do clique ou toque em relação ao canvas
        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX //|| event.touches[0].clientX; --> não precisou dessa parte, mas a deixei pra consultar depois
        const clientY = event.clientY //|| event.touches[0].clientY;
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;
        
        if (clickX >= ximg_p && clickX <= ximg_p + larg_p && clickY >= yimg_p && clickY <= yimg_p + alt_p) {
            // play
            if (pause == true){
                play = true;
                pause = false;
            }
            // pause
            else if (play == true){
                pause = true;
                play =  false;
            }
            // restart
            if (parou == true){
                play = false;
                pause = true;
                parou = false;
                m = 100; // massa
                r = (m**(1/2))*(1.5); // raio
                dist_teto = r; // distância inicial até o "teto"
                y = dist_teto;
                v = 0;
                dir_v = 1; // direção da velocidade: 1 -> pra baixo; -1 -> pra cima
                colidiu = false;
                coef_rest = 0.9; // coeficiente de restituição
            }
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
        xfundo_p = ximg_p + larg_p/2;
        yfundo_p = yimg_p + alt_p/2;
        rfundo_p = larg_p/2;
        // play
        if (play == false && parou == false){ 
            ctx.beginPath();
            ctx.arc(xfundo_p, yfundo_p, rfundo_p, 0, Math.PI*2, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(img_play, ximg_p, yimg_p, larg_p, alt_p);
        }
        // pause
        if (pause == false && parou == false){
            ctx.beginPath();
            ctx.arc(xfundo_p, yfundo_p, rfundo_p, 0, Math.PI*2, false);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(img_pause, ximg_p, yimg_p, larg_p, alt_p);
        }
        // restart
        if (parou == true){
            ctx.beginPath();
            ctx.arc(xfundo_p, yfundo_p, rfundo_p, 0, Math.PI*2, false);
            ctx.fillStyle = 'orange';
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(img_restart, ximg_p, yimg_p, larg_p, alt_p);
        }
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

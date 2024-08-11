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

    // Sons ---------------------------------------------------------------------------
    const som_colisao = new Audio('sons/colisao.mp3');
    som_colisao.volume = 1;
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function checar_clique(event){
        // Obtém as coordenadas do clique ou toque em relação ao canvas
        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX //|| event.touches[0].clientX; --> não precisou dessa parte, mas a deixei pra consultar depois
        const clientY = event.clientY //|| event.touches[0].clientY;
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;
        
        // play / pause / restart
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
                som_colisao.volume = 1;
            }
        }
        // coef_rest
        // +
        if (clickX >= x_cr && clickX <= x_cr + larg_cr && clickY >= y_cr && clickY <= y_cr + alt_cr) {
            coef_rest += 0.10;
        }
        // -
        if (clickX >= x_cr2 && clickX <= x_cr2 + larg_cr && clickY >= y_cr && clickY <= y_cr + alt_cr) {
            coef_rest -= 0.10;
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
        // coeficiente de restituíção
        //+
        x_cr = 0.98*ximg_p;
        y_cr = canvas.height/5;
        larg_cr = 1.3*larg_p/2;
        alt_cr = larg_p/2;
        ctx.fillStyle = 'blue';
        ctx.fillRect(x_cr, y_cr, larg_cr, alt_cr);
        let tamanho_texto = (alt_cr*1.5).toString();
        ctx.font = tamanho_texto + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`+`,x_cr+(1/2)*larg_cr,y_cr+alt_cr);
        //-
        x_cr2 = ximg_p + larg_cr;
        ctx.fillStyle = 'blue';
        ctx.fillRect(x_cr2, y_cr, larg_cr, alt_cr);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`-`,x_cr2+(1/2)*larg_cr,y_cr+0.80*alt_cr);
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function desenhar_informacoes(){
        // coeficiente de restituíção
        const x_cr_info = ximg_p;
        const y_cr_info = canvas.height/5 + larg_p/2;
        const larg_cr_info = larg_p;
        const alt_cr_info = larg_p/2;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x_cr_info, y_cr_info, larg_cr_info, alt_cr_info);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.strokeRect(x_cr_info, y_cr_info, larg_cr_info, alt_cr_info);
        ctx.restore();
        let tamanho_texto = (alt_cr_info).toString();
        ctx.font = tamanho_texto + "px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(coef_rest.toFixed(2),x_cr_info+(1/2)*larg_cr_info,y_cr_info+0.9*alt_cr_info);
        tamanho_texto = (1.5*(alt_cr_info/2)).toString();
        ctx.font = tamanho_texto + "px Arial";
        ctx.fillText('coef_rest',x_cr_info+(1/2)*larg_cr_info,y_cr_info-1.1*alt_cr_info);
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
                // solta o som e o diminui para a próxima colisao
                som_colisao.currentTime = 0;
                som_colisao.play();
                som_colisao.volume = 0.7*som_colisao.volume;
                // velocidade máxima para não bugar o movimento
                if (coef_rest >= 0.5 && coef_rest <= 1){
                    limite = 2;
                }
                else if (coef_rest >= 0.3 && coef_rest <= 0.4){
                    limite = 3;
                }
                else if (coef_rest >= 0.0 && coef_rest <= 0.2){
                    limite = 5;
                }
                if (v < r/limite) {
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
            desenhar_informacoes();
        }
        requestAnimationFrame(rodar_simulacao);
    }
    // --------------------------------------------------------------------------------

    requestAnimationFrame(rodar_simulacao);

};

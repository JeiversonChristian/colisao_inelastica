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
    let recuperar_pos = false;
    let pos_memoria = 0;

    play_music = true;
    pause_music = false;
    num_music = 1;
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
    coef_rest = 1; // coeficiente de restituição
    cor = 'Blue'; // mostrada na informação
    cor_verdade = 'blue'; // altera a cor mesmo
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
    const larg_p = canvas.width/9;
    const alt_p = canvas.width/9;
    // --------------------------------------------------------------------------------

    // Sons ---------------------------------------------------------------------------
    const som_colisao = new Audio('sons/colisao.mp3');
    som_colisao.volume = 1;
    const som_botao = new Audio('sons/botao.mp3');
    som_botao.volume = 0.3;
    const som_erro = new Audio('sons/erro.mp3');
    som_erro.volume = 0.15;
    // --------------------------------------------------------------------------------

    // Músicas ---------------------------------------------------------------------------
    const musica1 = new Audio('musicas/Blind Memories - Cheel.mp3');
    const musica2 = new Audio('musicas/Blue Dream - Cheel.mp3');
    const musica3 = new Audio('musicas/Caballero - Ofshane.mp3');
    const musica4 = new Audio('musicas/Papov - Yung Logos.mp3');
    const musica5 = new Audio('musicas/Soft Feeling - Cheel.mp3');
    const musica6 = new Audio('musicas/TrueArtRealAffectionPart4 - Noir Et Blanc Vie.mp3');
    musica1.volume = 0.1;
    musica2.volume = 0.1;
    musica3.volume = 0.1;
    musica4.volume = 0.1;
    musica5.volume = 0.1;
    musica6.volume = 0.1;
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
            som_botao.currentTime = 0;
            som_botao.play();
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
                //m = 100; // massa
                r = (m**(1/2))*(1.5); // raio
                dist_teto = r; // distância inicial até o "teto"
                y = dist_teto;
                v = 0;
                dir_v = 1; // direção da velocidade: 1 -> pra baixo; -1 -> pra cima
                colidiu = false;
                //coef_rest = 0.7; // coeficiente de restituição
                som_colisao.volume = 1;
                recuperar_pos = false;
                pos_memoria = 0;
            }
        }
        // coef_rest
        // +
        if (clickX >= x_cr && clickX <= x_cr + larg_cr && clickY >= y_cr && clickY <= y_cr + alt_cr) {
            if ( pause == false){
                // não é pra altear parâmetros com jogo em movimento
                som_erro.currentTime = 0;
                som_erro.play();
            }
            else {
                if (coef_rest <= 0.90){
                    coef_rest += 0.10;
                    som_botao.currentTime = 0;
                    som_botao.play();
                }
                else {
                    som_erro.currentTime = 0;
                    som_erro.play();
                }
            }
        }
        // -
        if (clickX >= x_cr2 && clickX <= x_cr2 + larg_cr && clickY >= y_cr && clickY <= y_cr + alt_cr) {
            if ( pause == false){
                // não é pra altear parâmetros com jogo em movimento
                som_erro.currentTime = 0;
                som_erro.play();
            }
            else {
                if (coef_rest >= 0.10){
                    coef_rest -= 0.10;
                    som_botao.currentTime = 0;
                    som_botao.play();
                }
                else {
                    som_erro.currentTime = 0;
                    som_erro.play();
                }
            }
        }

        // cor
        // azul
        if (clickX >= x_cor_a && clickX <= x_cor_a + larg_cor && clickY >= y_cor_a && clickY <= y_cor_a + alt_cor) {
            som_botao.currentTime = 0;
            som_botao.play();
            cor = 'Blue';
            cor_verdade = 'blue';
        }

        // vermelho
        if (clickX >= x_cor_r && clickX <= x_cor_r + larg_cor && clickY >= y_cor_r && clickY <= y_cor_r + alt_cor) {
            som_botao.currentTime = 0;
            som_botao.play();
            cor = 'Red';
            cor_verdade = 'red';
        }

        // massa
        // +
        if (clickX >= x_m && clickX <= x_m + larg_m && clickY >= y_m && clickY <= y_m + alt_m) {
            if ( pause == false){
                // não é pra altear parâmetros com jogo em movimento
                som_erro.currentTime = 0;
                som_erro.play();
            }
            else {
                if (m <= 980){
                    m += 10;
                    r = (m**(1/2))*(1.5); // raio
                    dist_teto = r; // distância inicial até o "teto"
                    y = dist_teto;
                    som_botao.currentTime = 0;
                    som_botao.play();
                }
                else {
                    som_erro.currentTime = 0;
                    som_erro.play();
                }
            }
        }
        // -
        if (clickX >= x_m2 && clickX <= x_m2 + larg_m && clickY >= y_m && clickY <= y_m + alt_m) {
            if ( pause == false){
                // não é pra altear parâmetros com jogo em movimento
                som_erro.currentTime = 0;
                som_erro.play();
            }
            else {
                if (m >= 20){
                    m -= 10;
                    r = (m**(1/2))*(1.5); // raio
                    dist_teto = r; // distância inicial até o "teto"
                    y = dist_teto;
                    som_botao.currentTime = 0;
                    som_botao.play();
                }
                else {
                    som_erro.currentTime = 0;
                    som_erro.play();
                }
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
        ctx.fillStyle = cor_verdade;
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
        x_cr = 0.95*ximg_p;
        y_cr = canvas.height/4 - larg_p/2;;
        larg_cr = 1.3*larg_p/2;
        alt_cr = larg_p/2;
        ctx.fillStyle = cor_verdade;
        ctx.fillRect(x_cr, y_cr, larg_cr, alt_cr);
        let tamanho_texto = (alt_cr*1.5).toString();
        ctx.font = tamanho_texto + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`+`,x_cr+(1/2)*larg_cr,y_cr+alt_cr);
        //-
        x_cr2 = 0.97*ximg_p + larg_cr;
        ctx.fillStyle = cor_verdade;
        ctx.fillRect(x_cr2, y_cr, larg_cr, alt_cr);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`-`,x_cr2+(1/2)*larg_cr,y_cr+0.80*alt_cr);

        // cor
        // azul
        x_cor_a = 0.95*ximg_p;
        y_cor_a = y_cr + 3*larg_cr//canvas.height/2.525;
        larg_cor = 1.3*larg_p/2;
        alt_cor = larg_p/2;
        ctx.fillStyle = 'blue';
        ctx.fillRect(x_cor_a, y_cor_a, larg_cor, alt_cor);
        // vermelho
        x_cor_r = 0.97*ximg_p + larg_cr;
        y_cor_r = y_cr + 3*larg_cr//canvas.height/2.525;
        larg_cor = 1.3*larg_p/2;
        alt_cor = larg_p/2;
        ctx.fillStyle = 'red';
        ctx.fillRect(x_cor_r, y_cor_r, larg_cor, alt_cor);

        // massa
        //+
        x_m = 0.95*ximg_p;
        y_m = y_cr + 6.1*larg_cr//canvas.height/1.6725;
        larg_m = 1.3*larg_p/2;
        alt_m = larg_p/2;
        ctx.fillStyle = cor_verdade;
        ctx.fillRect(x_m, y_m, larg_m, alt_m);
        let tamanho_texto_m = (alt_m*1.5).toString();
        ctx.font = tamanho_texto_m + "px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`+`,x_m+(1/2)*larg_m,y_m+alt_m);
        //-
        x_m2 = 0.97*ximg_p + larg_m;
        ctx.fillStyle = cor_verdade;
        ctx.fillRect(x_m2, y_m, larg_m, alt_m);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`-`,x_m2+(1/2)*larg_m,y_m+0.80*alt_m);
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function desenhar_informacoes(){
        // coeficiente de restituíção
        const x_cr_info = 0.975*ximg_p;
        const y_cr_info = canvas.height/4// + larg_p/2;
        const larg_cr_info = larg_p;
        const alt_cr_info = larg_p/2;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x_cr_info, y_cr_info, larg_cr_info, alt_cr_info);
        ctx.strokeStyle = cor_verdade;
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

        // cor
        const x_cor_info = 0.975*ximg_p;
        const y_cor_info = y_cr_info + 2*larg_cr_info//canvas.height/5 + 5*larg_p/2;
        const larg_cor_info = larg_p;
        const alt_cor_info = larg_p/2;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x_cor_info, y_cor_info, larg_cor_info, alt_cor_info);
        ctx.strokeStyle = cor_verdade;
        ctx.lineWidth = 1;
        ctx.strokeRect(x_cor_info, y_cor_info, larg_cor_info, alt_cor_info);
        ctx.restore();
        let tamanho_texto_cor = (alt_cor_info).toString();
        ctx.font = tamanho_texto_cor + "px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(cor,x_cor_info+(1/2)*larg_cor_info,y_cor_info+0.9*alt_cor_info);
        tamanho_texto_cor = (1.5*(alt_cor_info/2)).toString();
        ctx.font = tamanho_texto_cor + "px Arial";
        ctx.fillText('Cor',x_cor_info+(1/2)*larg_cor_info,y_cor_info-1.1*alt_cor_info);

        // massa
        const x_m_info = 0.975*ximg_p;
        const y_m_info = y_cr_info + 4*larg_cr_info//canvas.height/5 + 9*larg_p/2;
        const larg_m_info = larg_p;
        const alt_m_info = larg_p/2;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(x_m_info, y_m_info, larg_m_info, alt_m_info);
        ctx.strokeStyle = cor_verdade;
        ctx.lineWidth = 1;
        ctx.strokeRect(x_m_info, y_m_info, larg_m_info, alt_m_info);
        ctx.restore();
        let tamanho_texto_m = (0.75*alt_m_info).toString();
        ctx.font = tamanho_texto_m + "px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        texto_massa = m.toString() + 'kg'
        ctx.fillText(texto_massa,x_m_info+(1/2)*larg_m_info,y_m_info+0.9*alt_m_info);
        tamanho_texto_m = (1.5*(alt_m_info/2)).toString();
        ctx.font = tamanho_texto_m + "px Arial";
        ctx.fillText('Massa',x_m_info+(1/2)*larg_m_info,y_m_info-1.1*alt_m_info);
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function atualizar_posicao(){
        if (parou == false && play == true && pause == false) {
            // recupera a posição antes de colidir quando é necessário
            if (recuperar_pos == true){
                recuperar_pos = false;
                y = pos_memoria;
            }
            // atualiza velocidade de acordo com a gravidade e a direção
            v += g * dir_v; 
            // se chegou no chão (caindo)
            if (y + r + v >= canvas.height && dir_v == 1) {
                // guarda a posição antes de colidir, para recuperá-la depois
                pos_memoria = y;
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
                if (coef_rest < 1){
                    som_colisao.volume = 0.7*som_colisao.volume;
                }
                // velocidade máxima para não bugar o movimento
                if (coef_rest >= 0.5 && coef_rest <= 1.0){
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
                // se desgrudou e foi logo após colidir, avisa que é para recuperar a posição que tinha antes de colidir
                if (colidiu == true){
                    recuperar_pos = true;
                }
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
    function gerencia_musicas(){
        if (play_music == true){
            if (num_music == 1){
                musica1.play();
            }
        }
    }
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    function rodar_simulacao(timestamp){
        // se já passou mais tempo do que o tamanho de um dos 30 pedacinhos de tempo definidos acima
        gerencia_musicas();
        if (timestamp - window.lastTime >= window.interval) {
            window.lastTime = timestamp;
            // atualiza esse tempo como o tempo atual e depois espera passar de novo
            verificar_botoes();
            limpar_tela();
            atualizar_posicao();
            desenhar_esfera();
            desenhar_informacoes();
            desenhar_botoes();
        }
        requestAnimationFrame(rodar_simulacao);
    }
    // --------------------------------------------------------------------------------

    requestAnimationFrame(rodar_simulacao);

};

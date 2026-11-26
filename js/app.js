/* Lixo Invisível - JS pontual (menu mobile, formulário, leitor de resumo, calculadora) */
(function () {
    'use strict';

    // Menu mobile
    var btn = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu');
    if (btn && menu) {
        btn.addEventListener('click', function () {
            var aberto = menu.classList.toggle('aberto');
            btn.setAttribute('aria-expanded', String(aberto));
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('aberto')) {
                menu.classList.remove('aberto');
                btn.setAttribute('aria-expanded', 'false');
                btn.focus();
            }
        });
    }

    // Formulário de contato (simulação: valida e não envia nada)
    var form = document.getElementById('form-contato');
    if (form) {
        var data = form.querySelector('input[type="date"]');
        if (data) { data.max = new Date().toISOString().split('T')[0]; }
        var retorno = document.getElementById('retorno');
        form.addEventListener('invalid', function () {
            retorno.className = 'retorno erro';
            retorno.textContent = 'Confira os campos destacados antes de enviar.';
        }, true);
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                retorno.className = 'retorno erro';
                retorno.textContent = 'Confira os campos destacados antes de enviar.';
                return;
            }
            retorno.className = 'retorno ok';
            retorno.textContent = 'Tudo certo! Este formulário é uma simulação acadêmica: nenhum dado foi enviado ou guardado.';
            form.reset();
        });
    }

    // Leitor de resumo (Web Speech API, quando o navegador suporta)
    var ouvir = document.getElementById('ouvir');
    var resumo = document.getElementById('resumo');
    if (ouvir && resumo) {
        if (!('speechSynthesis' in window)) {
            ouvir.disabled = true;
            ouvir.textContent = 'Leitura em voz alta indisponível neste navegador';
        } else {
            ouvir.addEventListener('click', function () {
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    ouvir.textContent = 'Ouvir o resumo';
                    return;
                }
                var fala = new SpeechSynthesisUtterance(resumo.textContent);
                fala.lang = 'pt-BR';
                fala.onend = function () { ouvir.textContent = 'Ouvir o resumo'; };
                window.speechSynthesis.speak(fala);
                ouvir.textContent = 'Parar a leitura';
            });
        }
    }

    // Calculadora de custo (página de orçamento)
    var calc = document.getElementById('calc');
    if (calc) {
        var plano = document.getElementById('plano');
        var meses = document.getElementById('meses');
        var dominio = document.getElementById('dominio');
        var saida = document.getElementById('resultado');
        var atualizar = function () {
            var m = Math.min(Math.max(parseInt(meses.value, 10) || 1, 1), 60);
            var host = parseFloat(plano.value) * m;
            var dom = dominio.checked ? 40 * Math.ceil(m / 12) : 0;
            saida.textContent = 'Hospedagem: US$ ' + host.toFixed(2).replace('.', ',') +
                ' | Domínio .com.br: R$ ' + dom.toFixed(2).replace('.', ',') +
                ' (valores em moedas diferentes, sem conversão)';
        };
        [plano, meses, dominio].forEach(function (el) { el.addEventListener('input', atualizar); });
        atualizar();
    }
})();

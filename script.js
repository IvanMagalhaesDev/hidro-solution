document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formCalc");
    const historico = document.getElementById("historicoCalculos");
    const limparBtn = document.getElementById("limpar");

    // Carrega histórico salvo no localStorage
    carregarHistoricoSalvo();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let condDesejada = Number(document.getElementById("condDesejada").value);
        let condLida = Number(document.getElementById("condLida").value);
        let volume = Number(document.getElementById("volume").value);

        if (isNaN(condDesejada) || isNaN(condLida) || isNaN(volume)) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        let calcinit = ((condDesejada - condLida) / 1.24 * volume) * 0.54;
        let dripsol = ((condDesejada - condLida) / 1.24 * volume) * 0.46;

        const agora = new Date();
        const dataHora = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const resultado = {
            condAtual: condLida,
            condDesejada: condDesejada,
            volume: volume,
            calcinit: calcinit.toFixed(2),
            dripsol: dripsol.toFixed(2),
            dataHora: dataHora
        };

        adicionarAoHistorico(resultado);
        salvarNoLocalStorage(resultado);
        form.reset();
    });

    limparBtn.addEventListener("click", function () {
        form.reset();
    });

    function adicionarAoHistorico(itemData) {
        const item = document.createElement("li");
        item.className = "history-item";

        item.innerHTML = `
            <h4>Informações:</h4>
            <p>Cond. Atual: ${itemData.condAtual} mS/cm</p>
            <p>Cond. Desejada: ${itemData.condDesejada} mS/cm</p>
            <p>Volume: ${itemData.volume} L</p>
            <h4>Resultado:</h4>
            <p class="result">Calcinit: ${itemData.calcinit} g</p>
            <p class="result">Dripsol: ${itemData.dripsol} g</p>
            <p class="timestamp">(${itemData.dataHora})</p>
        `;

        historico.appendChild(item);
        // Opcional: Limita o número de itens no histórico
        if (historico.children.length > 10) {
            historico.removeChild(historico.firstChild);
        }
    }

    function salvarNoLocalStorage(dado) {
        let calculosSalvos = JSON.parse(localStorage.getItem("historicoCalculos")) || [];
        calculosSalvos.push(dado);
        if (calculosSalvos.length > 10) calculosSalvos.shift(); // Limita a 10 itens
        localStorage.setItem("historicoCalculos", JSON.stringify(calculosSalvos));
    }

    function carregarHistoricoSalvo() {
        let calculosSalvos = JSON.parse(localStorage.getItem("historicoCalculos")) || [];
        calculosSalvos.forEach(adicionarAoHistorico);
    }
});
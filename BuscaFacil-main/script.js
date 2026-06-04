// Login

const USUARIO_VALIDO = {
    email: "admin@buscafacil.com",
    senha: "admin123"
};

const form = document.getElementById("login-form");

if (form) {

    const inputEmail = document.getElementById("email");
    const inputSenha = document.getElementById("senha");
    const btnMostrar = document.getElementById("btnMostrar");
    const btnLimpar = document.getElementById("btnLimpar");
    const iconeOlho = document.getElementById("icone-olho");
    const errorMsg = document.getElementById("error-msg");
    const errorText = document.getElementById("error-text");
    const container = document.getElementById("login-container");
    const btnEntrar = document.getElementById("btn-entrar");
    const btnLabel = document.getElementById("btn-label");
    const btnIcon = document.getElementById("btn-icon");

    btnMostrar?.addEventListener("click", () => {

        const visivel = inputSenha.type === "text";

        inputSenha.type = visivel ? "password" : "text";

        iconeOlho.className = visivel
            ? "fa-solid fa-eye"
            : "fa-solid fa-eye-slash";
    });

    btnLimpar?.addEventListener("click", () => {
        inputSenha.value = "";
        inputSenha.focus();
        esconderErro();
    });

    inputEmail?.addEventListener("input", esconderErro);
    inputSenha?.addEventListener("input", esconderErro);

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = inputEmail.value.trim();
        const senha = inputSenha.value;

        setLoading(true);

        setTimeout(() => {

            if (
                email === USUARIO_VALIDO.email &&
                senha === USUARIO_VALIDO.senha
            ) {

                btnLabel.textContent = "Entrando...";
                btnIcon.className = "fa-solid fa-spinner fa-spin";

                setTimeout(() => {
                    window.location.href = "home.html";
                }, 800);

            } else {

                setLoading(false);

                mostrarErro("E-mail ou senha incorretos.");

                inputEmail.classList.add("input-error");
                inputSenha.classList.add("input-error");

                container.classList.remove("shake");

                void container.offsetWidth;

                container.classList.add("shake");
            }

        }, 600);
    });

    function setLoading(on) {

        btnEntrar.disabled = on;

        btnLabel.textContent = on
            ? "Verificando..."
            : "Entrar";

        btnIcon.className = on
            ? "fa-solid fa-spinner fa-spin"
            : "fa-solid fa-arrow-right-to-bracket";
    }

    function mostrarErro(msg) {

        errorText.textContent = msg;

        errorMsg.classList.add("visible");
    }

    function esconderErro() {

        errorMsg.classList.remove("visible");

        inputEmail.classList.remove("input-error");

        inputSenha.classList.remove("input-error");
    }
}


// Busca de veiculos

let veiculosData = null;
let carregando = true;

async function fetchVeiculos() {

    try {

        const response = await fetch("db.json");

        if (!response.ok) {
            throw new Error("Erro ao carregar JSON");
        }

        return await response.json();

    } catch (erro) {

        console.error("Erro:", erro);

        return null;

    } finally {

        carregando = false;
    }
}

fetchVeiculos().then(data => {
    veiculosData = data;
});

function BuscarVeiculo() {

    const searchInput =
        document.getElementById("search-input");

    if (!searchInput) return;

    const termoBusca =
        searchInput.value.trim().toLowerCase();

    if (!termoBusca) return;

    const resultsContainer =
        document.getElementById("results");

    const chassiCard =
        document.getElementById("chassi-card");

    const motorCard =
        document.getElementById("motor-card");

    const chassiImage =
        document.getElementById("chassi-image");

    const motorImage =
        document.getElementById("motor-image");

    const messageCard =
        document.getElementById("message-card");

    const messageIcon =
        document.getElementById("message-icon");

    const messageText =
        document.getElementById("message-text");

    resultsContainer.classList.remove("hidden");

    if (carregando || !veiculosData) {

        chassiCard?.classList.add("hidden");
        motorCard?.classList.add("hidden");

        messageCard?.classList.remove("hidden");

        if (messageIcon) {
            messageIcon.className =
                "fa-solid fa-spinner fa-spin";
            messageIcon.style.color = "#06b6d4";
        }

        if (messageText) {
            messageText.textContent =
                "Carregando dados...";
        }

        return;
    }

    const termos = termoBusca.split(/\s+/);

    const veiculoEncontrado = veiculosData.find(carro => {

        const chave =
            `${carro.nome.toLowerCase()} ${carro.ano}`;

        return termos.every(
            termo => chave.includes(termo)
        );
    });

    if (veiculoEncontrado) {

        chassiImage.src =
            veiculoEncontrado.imagem_chassi;

        motorImage.src =
            veiculoEncontrado.imagem_motor;

        chassiCard.classList.remove("hidden");
        motorCard.classList.remove("hidden");

        messageCard.classList.add("hidden");

    } else {

        chassiCard.classList.add("hidden");
        motorCard.classList.add("hidden");

        messageCard.classList.remove("hidden");

        messageIcon.className =
            "fa-solid fa-triangle-exclamation";

        messageIcon.style.color = "#ef4444";

        messageText.textContent =
            `Nenhum veículo encontrado para "${searchInput.value}".`;
    }
}


// enter na pesquisa

document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("search-input");

    if (input) {

        input.addEventListener("keydown", e => {

            if (e.key === "Enter") {

                BuscarVeiculo();
            }
        });
    }
});


// feedbacks

const feedbackForm =
    document.getElementById("feedback-form");

if (feedbackForm) {

    feedbackForm.addEventListener("submit", e => {

        e.preventDefault();

        const mensagem =
            document.getElementById("mensagem-sucesso");

        mensagem?.classList.remove("hidden");

        feedbackForm.reset();
    });
}

// Tema claro e escuro

const toggleTheme = document.getElementById("toggleTheme");

if (toggleTheme) {

    // Salvar o tema
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "light") {
        document.body.classList.add("light-mode");
        toggleTheme.innerHTML =
            '<i class="fa-solid fa-sun"></i> Light Mode';
    }

    toggleTheme.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {

            localStorage.setItem("tema", "light");

            toggleTheme.innerHTML =
                '<i class="fa-solid fa-sun"></i> Light Mode';

        } else {

            localStorage.setItem("tema", "dark");

            toggleTheme.innerHTML =
                '<i class="fa-solid fa-moon"></i> Dark Mode';
        }
    });
}
//DataTables

$(document).ready(function () {

    if ($("#tabelaVeiculos").length) {

        $("#tabelaVeiculos").DataTable({
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/pt-BR.json"
            }
        });

    }

});
const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ==========================
// INICIAR
// ==========================

window.onload = async () => {

    const logado = await verificarLogin();

    if (!logado) return;

    mostrarPagina("dashboard");

    await atualizarDashboard();
    await carregarSugestoes();

};

// ==========================
// VERIFICAR LOGIN
// ==========================

async function verificarLogin() {

    const {
        data: { session }
    } = await db.auth.getSession();

    if (!session) {

        window.location.replace("login.html");
        return false;

    }

    return true;

}

// ==========================
// MENU
// ==========================

window.mostrarPagina = function (pagina, elemento = null) {

    document.querySelectorAll(".pagina").forEach(secao => {
        secao.classList.remove("ativa");
    });

    document.getElementById(pagina).classList.add("ativa");


    document.querySelectorAll(".menu").forEach(botao => {
        botao.classList.remove("ativo");
    });


    if (elemento) {
        elemento.classList.add("ativo");
    }

};



// ==========================
// DASHBOARD
// ==========================

async function atualizarDashboard() {

    const { count: sugestoes } = await db
        .from("sugestoes")
        .select("*", { count: "exact", head: true });

    const { count: noticias } = await db
        .from("noticias")
        .select("*", { count: "exact", head: true });

    const { count: eventos } = await db
        .from("eventos")
        .select("*", { count: "exact", head: true });

    document.getElementById("totalSugestoes").textContent = sugestoes || 0;
    document.getElementById("totalNoticias").textContent = noticias || 0;
    document.getElementById("totalEventos").textContent = eventos || 0;

}

// ==========================
// SUGESTÕES
// ==========================

async function carregarSugestoes() {

    const { data, error } = await db
        .from("sugestoes")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    const tabela = document.getElementById("listaSugestoes");

    tabela.innerHTML = "";

    data.forEach(item => {

        tabela.innerHTML += `
            <tr>

                <td>${item.nome}</td>

                <td>${item.sugestao}</td>

                <td>${new Date(item.data).toLocaleDateString("pt-BR")}</td>

                <td>

                    <button onclick="excluirSugestao(${item.id})">

                        🗑️

                    </button>

                </td>

            </tr>
        `;

    });

}

// ==========================
// EXCLUIR SUGESTÃO
// ==========================

window.excluirSugestao = async function (id) {

    if (!confirm("Deseja excluir esta sugestão?")) return;

    const { error } = await db
        .from("sugestoes")
        .delete()
        .eq("id", id);

    if (error) {

        alert("Erro ao excluir.");

        console.error(error);

        return;

    }

    await atualizarDashboard();
    await carregarSugestoes();

};

// ==========================
// LOGOUT
// ==========================

window.logout = async function () {

    await db.auth.signOut();

    window.location.replace("login.html");

};


window.addEventListener("load", () => {

    const botaoLogout = document.getElementById("logout");

    if (botaoLogout) {

        botaoLogout.addEventListener("click", logout);

    }

});
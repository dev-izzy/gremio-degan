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
    await carregarNoticias();

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
        .order("data", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    const tabela = document.getElementById("listaSugestoes");

    tabela.innerHTML = "";

    if (data.length === 0) {

        tabela.innerHTML = `
        <tr>

            <td colspan="4">

                Nenhuma sugestão encontrada.

            </td>

        </tr>`;

        return;

    }

    data.forEach(item => {

        tabela.innerHTML += `

        <tr>

            <td>${item.nome}</td>

            <td>${item.sugestao}</td>

            <td>${new Date(item.data).toLocaleString("pt-BR")}</td>

            <td>

                <button onclick="excluirSugestao(${item.id})">

                    🗑 Excluir

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

     await carregarSugestoes();
     await atualizarDashboard();

};

// ==========================
// LOGOUT
// ==========================

window.logout = async function () {

    await db.auth.signOut();

    window.location.replace("login.html");

};

//============
// noticias 
//=============
window.salvarNoticia = async function () {

    const titulo = document.getElementById("tituloNoticia").value.trim();

    const texto = document.getElementById("textoNoticia").value.trim();

    if (titulo === "" || texto === "") {

        alert("Preencha todos os campos.");
        return;

    }

    const { error } = await db
        .from("noticias")
        .insert([{

            titulo: titulo,
            texto: texto,
            data: new Date()

        }]);

    if (error) {

        console.error(error);
        alert("Erro ao publicar notícia.");
        return;

    }

    alert("Notícia publicada com sucesso!");

    document.getElementById("tituloNoticia").value = "";
    document.getElementById("textoNoticia").value = "";

     await atualizarDashboard();
     await carregarNoticias();
}
async function carregarNoticias() {

    const { data, error } = await db
        .from("noticias")
        .select("*")
        .order("data", { ascending: false });

    if (error) {

        console.error(error);
        return;

    }

    const lista = document.getElementById("listaNoticias");

    lista.innerHTML = "";

    if (data.length === 0) {

        lista.innerHTML = "<p>Nenhuma notícia publicada.</p>";
        return;

    }

    data.forEach(noticia => {

        lista.innerHTML += `

        <div class="card">

            <h3>${noticia.titulo}</h3>

            <p>${noticia.texto}</p>

            <small>

                ${new Date(noticia.data).toLocaleDateString("pt-BR")}

            </small>

            <br><br>

            <button onclick="excluirNoticia(${noticia.id})">

                🗑 Excluir

            </button>

        </div>

        <br>

        `;

    });

}
//==========
// excluir noticias
//==========
window.excluirNoticia = async function(id){

    if(!confirm("Excluir esta notícia?"))
        return;

    const { error } = await db
        .from("noticias")
        .delete()
        .eq("id", id);

    if(error){

        console.error(error);
        alert("Erro ao excluir.");
        return;

    }

    await carregarNoticias();
    await atualizarDashboard();

}
 
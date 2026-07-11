const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ===============================
// INICIAR
// ===============================

window.onload = async () => {

    await verificarLogin();

    mostrarPagina("dashboard");

    await atualizarDashboard();
    await carregarSugestoes();

};

// ===============================
// LOGIN
// ===============================

async function verificarLogin(){

    const { data } = await db.auth.getSession();

    if(!data.session){

        window.location.href = "login.html";
        return;

    }

}

// ===============================
// MENU
// ===============================

window.mostrarPagina = function(nome, botao){

    document.querySelectorAll(".pagina").forEach(pagina=>{
        pagina.classList.add("escondido");
    });

    document.getElementById(nome).classList.remove("escondido");

    document.querySelectorAll(".menu").forEach(menu=>{
        menu.classList.remove("ativo");
    });

    if(botao){
        botao.classList.add("ativo");
    }

}

// ===============================
// DASHBOARD
// ===============================

async function atualizarDashboard(){

    const sugestoes = await db
        .from("sugestoes")
        .select("*",{count:"exact",head:true});

    const noticias = await db
        .from("noticias")
        .select("*",{count:"exact",head:true});

    const eventos = await db
        .from("eventos")
        .select("*",{count:"exact",head:true});

    document.getElementById("totalSugestoes").textContent =
        sugestoes.count ?? 0;

    document.getElementById("totalNoticias").textContent =
        noticias.count ?? 0;

    document.getElementById("totalEventos").textContent =
        eventos.count ?? 0;

}

// ===============================
// SUGESTÕES
// ===============================

async function carregarSugestoes(){

    const { data, error } = await db
        .from("sugestoes")
        .select("*")
        .order("id",{ascending:false});

    if(error){

        console.error(error);
        return;

    }

    const tabela = document.getElementById("listaSugestoes");

    tabela.innerHTML = "";

    data.forEach(item=>{

        tabela.innerHTML += `
        <tr>

            <td>${item.nome}</td>

            <td>${item.sugestao}</td>

            <td>${new Date(item.data).toLocaleDateString("pt-BR")}</td>

            <td>

                <button onclick="excluirSugestao(${item.id})">

                    🗑

                </button>

            </td>

        </tr>
        `;

    });

}

// ===============================
// EXCLUIR SUGESTÃO
// ===============================

window.excluirSugestao = async function(id){

    if(!confirm("Deseja excluir esta sugestão?"))
        return;

    const { error } = await db
        .from("sugestoes")
        .delete()
        .eq("id",id);

    if(error){

        alert("Erro ao excluir.");
        console.error(error);

        return;

    }

    await atualizarDashboard();
    await carregarSugestoes();

}

// ===============================
// NOTÍCIAS
// ===============================

window.salvarNoticia = function(){

    alert("Vamos implementar na próxima etapa.");

}

// ===============================
// EVENTOS
// ===============================

window.salvarEvento = function(){

    alert("Vamos implementar na próxima etapa.");

}

// ===============================
// DIRETORIA
// ===============================

window.salvarDiretoria = function(){

    alert("Vamos implementar na próxima etapa.");

}

// ===============================
// LOGOUT
// ===============================

window.logout = async function(){

    await db.auth.signOut();

    window.location.href = "login.html";

}
const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ===========================
// CARREGAR PAINEL
// ===========================

window.onload = () => {

    carregarSugestoes();

};

// ===========================
// SUGESTÕES
// ===========================

async function carregarSugestoes(){

    const { data, error } = await db
        .from("sugestoes")
        .select("*")
        .order("id", { ascending: false });

    if(error){

        console.error(error);
        return;

    }

    document.getElementById("totalSugestoes").textContent = data.length;

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
                        🗑 Excluir
                    </button>
                </td>
            </tr>
        `;

    });

}

// ===========================
// EXCLUIR
// ===========================

window.excluirSugestao = async function(id){

    if(!confirm("Deseja excluir esta sugestão?"))
        return;

    const { error } = await db
        .from("sugestoes")
        .delete()
        .eq("id", id);

    if(error){

        console.error(error);
        alert("Erro ao excluir.");

    }else{

        carregarSugestoes();

    }

}

// ===========================
// NOTÍCIAS
// ===========================

window.publicarNoticia = function(){

    alert("Em breve.");

}

// ===========================
// EVENTOS
// ===========================

window.salvarEvento = function(){

    alert("Em breve.");

}

// ===========================
// DIRETORIA
// ===========================

window.salvarDiretoria = function(){

    alert("Em breve.");

}

// ===========================
// LOGOUT
// ===========================

window.logout = async function(){

    await db.auth.signOut();

    window.location.href = "index.html";

}
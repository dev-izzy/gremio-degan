const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";


const clienteDB = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


window.enviarSugestao = async function(){

    const nome = document.getElementById("nome").value;
    const sugestao = document.getElementById("sugestao").value;


    if(nome.trim() === "" || sugestao.trim() === ""){
        alert("Preencha todos os campos!");
        return;
    }


    const { error } = await clienteDB
        .from("sugestoes")
        .insert([
            {
                nome: nome,
                sugestao: sugestao
            }
        ]);


    if(error){

            console.error(error);
           alert("Erro: " + error.message);

    } else {

        alert("Sugestão enviada com sucesso!");

        document.getElementById("nome").value = "";
        document.getElementById("sugestao").value = "";

    }

};
// ==========================
// CARREGAR NOTÍCIAS PÚBLICAS
// ==========================

async function carregarNoticias(){

    const { data, error } = await clienteDB
        .from("noticias")
        .select("*")
        .order("data", { ascending: false });


    if(error){

        console.error(error);
        return;

    }


    const lista = document.getElementById("listaNoticias");


    lista.innerHTML = "";


    if(data.length === 0){

        lista.innerHTML = "<p>Nenhuma notícia publicada.</p>";
        return;

    }


    data.forEach(noticia => {

    lista.innerHTML += `

        <div class="card">

            <h3>${noticia.titulo}</h3>

            <p>${noticia.texto}</p>

            <small>
                📅 ${new Date(noticia.data).toLocaleDateString("pt-BR")}
            </small>

        </div>

    `;

});
}


window.addEventListener("load", carregarNoticias);
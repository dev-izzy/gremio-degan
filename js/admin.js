const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";

const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";


const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


// ==========================
// INICIAR ADMIN
// ==========================

window.onload = async () => {

    const logado = await verificarLogin();

    if(!logado) return;


    mostrarPagina("dashboard");


    await atualizarDashboard();
    await carregarSugestoes();
    await carregarNoticias();
    await carregarEventos();

};



// ==========================
// VERIFICAR LOGIN
// ==========================

async function verificarLogin(){

    const {data, error} = await db.auth.getSession();


    console.log("Sessão:", data.session);


    if(error){

        console.error(error);
        return false;

    }


    if(!data.session){

        window.location.replace("login.html");

        return false;

    }


    return true;

}



// ==========================
// MENU
// ==========================

window.mostrarPagina = function(pagina, elemento=null){


    document.querySelectorAll(".pagina")
    .forEach(secao=>{

        secao.classList.remove("ativa");

    });



    const atual = document.getElementById(pagina);


    if(atual){

        atual.classList.add("ativa");

    }



    document.querySelectorAll(".menu")
    .forEach(botao=>{

        botao.classList.remove("ativo");

    });



    if(elemento){

        elemento.classList.add("ativo");

    }


}
// ==========================
// DASHBOARD
// ==========================

async function atualizarDashboard(){


    const {count:sugestoes} = await db
    .from("sugestoes")
    .select("*",{count:"exact",head:true});


    const {count:noticias} = await db
    .from("noticias")
    .select("*",{count:"exact",head:true});


    const {count:eventos} = await db
    .from("eventos")
    .select("*",{count:"exact",head:true});



    document.getElementById("totalSugestoes").textContent =
    sugestoes || 0;


    document.getElementById("totalNoticias").textContent =
    noticias || 0;


    document.getElementById("totalEventos").textContent =
    eventos || 0;

}




// ==========================
// CARREGAR SUGESTÕES
// ==========================

async function carregarSugestoes(){


    const {data,error}=await db
    .from("sugestoes")
    .select("*")
    .order("data",{ascending:false});



    if(error){

        console.error(error);
        return;

    }



    const tabela=document.getElementById("listaSugestoes");


    if(!tabela) return;



    tabela.innerHTML="";



    if(!data || data.length===0){

        tabela.innerHTML=`

        <tr>
            <td colspan="4">
            Nenhuma sugestão encontrada.
            </td>
        </tr>

        `;

        return;

    }



    data.forEach(item=>{


        tabela.innerHTML += `

        <tr>

        <td>${item.nome}</td>

        <td>${item.sugestao}</td>

        <td>
        ${new Date(item.data)
        .toLocaleString("pt-BR")}
        </td>


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

window.excluirSugestao = async function(id){


    if(!confirm("Excluir sugestão?"))
    return;



    const {error}=await db
    .from("sugestoes")
    .delete()
    .eq("id",id);



    if(error){

        console.error(error);
        alert(error.message);
        return;

    }



    await carregarSugestoes();

    await atualizarDashboard();


}
// ==========================
// NOTÍCIAS
// ==========================


window.salvarNoticia = async function(){


    const titulo = document
    .getElementById("tituloNoticia")
    .value
    .trim();



    const texto = document
    .getElementById("textoNoticia")
    .value
    .trim();



    if(titulo === "" || texto === ""){

        alert("Preencha todos os campos.");

        return;

    }




    const {error} = await db
    .from("noticias")
    .insert([{

        titulo: titulo,

        texto: texto,

        data: new Date()

    }]);




    if(error){

        console.error(error);

        alert(error.message);

        return;

    }




    alert("Notícia publicada com sucesso!");



    document.getElementById("tituloNoticia").value="";

    document.getElementById("textoNoticia").value="";



    await carregarNoticias();

    await atualizarDashboard();


};






// ==========================
// CARREGAR NOTÍCIAS
// ==========================


async function carregarNoticias(){



    const {data,error}=await db
    .from("noticias")
    .select("*")
    .order("data",{ascending:false});




    if(error){

        console.error(error);

        return;

    }




    const lista=document
    .getElementById("listaNoticias");



    if(!lista) return;




    lista.innerHTML="";




    if(!data || data.length===0){


        lista.innerHTML=
        "<p>Nenhuma notícia publicada.</p>";


        return;

    }




    data.forEach(noticia=>{


        lista.innerHTML += `


        <div class="card">


            <h3>${noticia.titulo}</h3>


            <p>${noticia.texto}</p>



            <small>

            ${new Date(noticia.data)
            .toLocaleDateString("pt-BR")}

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





// ==========================
// EXCLUIR NOTÍCIA
// ==========================


window.excluirNoticia = async function(id){



    if(!confirm("Excluir esta notícia?"))

    return;




    const {error}=await db
    .from("noticias")
    .delete()
    .eq("id",id);




    if(error){

        console.error(error);

        alert(error.message);

        return;

    }




    await carregarNoticias();

    await atualizarDashboard();


};






// ==========================
// BOTÃO PUBLICAR
// ==========================


const btnPublicar = document.getElementById("btnPublicar");


if(btnPublicar){


    btnPublicar.addEventListener(
        "click",
        salvarNoticia
    );


}
// ==========================
// EVENTOS
// ==========================


window.salvarEvento = async function(){


    const nome = document
    .getElementById("nomeEvento")
    .value
    .trim();



    const descricao = document
    .getElementById("descricaoEvento")
    .value
    .trim();



    const dataEvento = document
    .getElementById("dataEvento")
    .value;




    if(nome === "" || descricao === "" || dataEvento === ""){

        alert("Preencha todos os campos.");

        return;

    }



    const {error} = await db
    .from("eventos")
    .insert([{

        nome: nome,

        descricao: descricao,

        data: dataEvento

    }]);




    if(error){

        console.error(error);

        alert(error.message);

        return;

    }



    alert("Evento publicado com sucesso!");



    document.getElementById("nomeEvento").value = "";

    document.getElementById("descricaoEvento").value = "";

    document.getElementById("dataEvento").value = "";




    await carregarEventos();

    await atualizarDashboard();


};






// ==========================
// CARREGAR EVENTOS
// ==========================


async function carregarEventos(){


    const {data,error} = await db
    .from("eventos")
    .select("*")
    .order("data",{ascending:false});




    if(error){

        console.error(error);

        return;

    }



    const lista = document
    .getElementById("listaEventos");



    if(!lista) return;



    lista.innerHTML = "";




    if(!data || data.length === 0){


        lista.innerHTML = 
        "<p>Nenhum evento publicado.</p>";


        return;

    }





    data.forEach(evento => {


        lista.innerHTML += `


        <div class="card">


            <h3>${evento.nome}</h3>


            <p>${evento.descricao}</p>


            <small>

            📅 ${new Date(evento.data)
            .toLocaleDateString("pt-BR")}

            </small>


            <br><br>


            <button onclick="excluirEvento(${evento.id})">

            🗑 Excluir

            </button>


        </div>


        <br>


        `;


    });


}







// ==========================
// EXCLUIR EVENTO
// ==========================


window.excluirEvento = async function(id){



    if(!confirm("Excluir este evento?"))

    return;




    const {error} = await db
    .from("eventos")
    .delete()
    .eq("id",id);




    if(error){

        console.error(error);

        alert(error.message);

        return;

    }




    await carregarEventos();

    await atualizarDashboard();


};
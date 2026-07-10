const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

 //Se já estiver logado, vai direto para o painel
(async () => {

    const {
        data: { session }
    } = await db.auth.getSession();

    if (session) {

       window.location.href = "admin.html";

    }

})();

document
.getElementById("loginForm")
.addEventListener("submit", login);

async function login(event){

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("senha").value;

    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "";

    const { error } = await db.auth.signInWithPassword({

        email,
        password: senha

    });

if (error) {

    console.error(error);

    mensagem.textContent = error.message;

    alert(error.message);

    return;

}

    

    window.location.href = "admin.html";

}
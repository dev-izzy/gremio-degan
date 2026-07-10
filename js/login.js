const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// Se já estiver logado, vai direto para o painel
window.onload = async function () {

    const { data } = await db.auth.getSession();

    if (data.session) {
        window.location.href = "admin.html";
    }

};

window.login = async function () {

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (email === "" || senha === "") {
        alert("Preencha todos os campos.");
        return;
    }

const { data, error } = await db.auth.signInWithPassword({
    email,
    password: senha
});

if (error) {
    alert(error.message);
    return;
}

window.location.replace("admin.html");

};
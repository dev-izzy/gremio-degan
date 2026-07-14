const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

(async () => {

    const { data: { session } } = await db.auth.getSession();

    console.log("Sessão no login:", session);

    if (session) {
        window.location.replace("admin.html");
    }

})();

document
    .getElementById("loginForm")
    .addEventListener("submit", login);

async function login(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const { data, error } = await db.auth.signInWithPassword({
        email,
        password: senha
    });

    console.log("Resultado login:", data);
    console.log("Erro login:", error);

    if (error) {
        alert(error.message);
        return;
    }

    window.location.replace("admin.html");
}
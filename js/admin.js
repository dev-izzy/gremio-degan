const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "SUA_CHAVE_Pb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

window.onload = async () => {

    const {
        data: { session }
    } = await db.auth.getSession();

    if (!session) {

        window.location.href = "login.html";
        return;

    }

    document.getElementById("usuario").textContent =
        "Logado como: " + session.user.email;

};

document
.getElementById("btnLogout")
.addEventListener("click", logout);

async function logout(){

    await db.auth.signOut();

    window.location.href = "login.html";

}
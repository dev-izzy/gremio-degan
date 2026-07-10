const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";

const db = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// ===========================
// VERIFICAR LOGIN
// ===========================

async function verificarLogin() {

    const { data, error } = await db.auth.getSession();

    if (error) {
        console.error(error);
        window.location.replace("login.html");
        return false;
    }

    if (!data.session) {
        window.location.replace("login.html");
        return false;
    }

    return true;

}

// ===========================
// CARREGAR PAINEL
// ===========================

window.onload = async function () {

    const logado = await verificarLogin();

    if (!logado) return;

    await carregarSugestoes();

};
// ===========================
// LOGOUT
// ===========================

window.logout = async function () {

    await db.auth.signOut();

    window.location.replace("login.html");

}
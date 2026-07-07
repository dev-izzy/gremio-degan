const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "sb_publishable_-33tP63hIJ6kj9n0Jtw6jg_caEqBpXq";


const clienteSupabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


async function enviarSugestao(){

    const nome = document.getElementById("nome").value;
    const sugestao = document.getElementById("sugestao").value;


    if(nome.trim() === "" || sugestao.trim() === ""){
        alert("Preencha todos os campos!");
        return;
    }


    const { error } = await clienteSupabase
        .from("sugestoes")
        .insert([
            {
                nome: nome,
                sugestao: sugestao
            }
        ]);


    if(error){

        console.error("Erro Supabase:", error);
        alert("Erro ao enviar sugestão!");

    } else {

        alert("Sugestão enviada com sucesso!");


        document.getElementById("nome").value = "";
        document.getElementById("sugestao").value = "";

    }

}            
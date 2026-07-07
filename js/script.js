const supabaseUrl = "https://ywpjippxynugqgwhlvsw.supabase.co";
const supabaseKey = "SUA_CHAVE_PUBLICAVEL";


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
        alert("Erro ao enviar sugestão!");

    } else {

        alert("Sugestão enviada com sucesso!");

        document.getElementById("nome").value = "";
        document.getElementById("sugestao").value = "";

    }

};
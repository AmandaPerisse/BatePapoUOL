let body = document.querySelector(".body");
let header = document.querySelector(".header");
let footer = document.querySelector(".footer");
let telaLogin = document.querySelector(".telaLogin");
let telaContatos = document.querySelector(".telaContatos");
let telaPreta = document.querySelector(".telaPreta");
let nomeF = "";

let paraQuemNome = "Todos";
let visibilidadeNome = "Público";
function enviarMensagem(){
    let mensagem = document.querySelector(".inputMensagem").value;
    let visibility = ""
    if (visibilidadeNome == "Reservadamente"){
        visibility = "private_message";
    }
    else{
        visibility = "message";
    }
    let obj = {
        from: nomeF,
        to: paraQuemNome,
        text: mensagem,
        type: visibility
    };
    let promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', obj);
    document.querySelector(".inputMensagem").value = "";
}


function enviarNomeRepetidamente(){
    let nome = document.querySelector(".inputNome").value;
    nomeObj = {
        name: nome
    };
    let promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', nomeObj);
}

function enviarNome(){
    let nome = document.querySelector(".inputNome").value;
    nomeF = nome;
    nomeObj = {
        name: nome
    };
    let promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', nomeObj);
    promise.then(tratarSucesso);
    promise.catch(tratarErro);
}

function tratarErro(erro){
    if(erro.response.status == "400"){
        alert("Nome já usado. Digite outro nome.");
    }
}

function tratarSucesso(resposta){
    telaLogin.classList.add("escondido");
    body.classList.remove("escondido");
    header.classList.remove("escondido");
    footer.classList.remove("escondido");
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promise.then(pegarMensagens);
    setInterval(function(){let promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');promise.then(pegarMensagens);}, 3000);
    setInterval(function(){let promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');promise.then(pegarParticipantes);}, 10000);
    setInterval(enviarNomeRepetidamente, 5000);
}

function pegarMensagens(resposta){
    body.innerHTML = "";
    for(let i = 0; i < resposta.data.length; i++){
        if(resposta.data[i].type == "status"){
            body.innerHTML += `
                        <div class = "mensagem status">
                            <div class = "mensagemFlex">
                                <p>
                                    <span class = "pC">(${resposta.data[i].time})</span>
                                    <span class = "pN">${resposta.data[i].from}</span>
                                    ${resposta.data[i].text}
                                </p>
                            </div>
                        </div>
        `;
        }
        else if(resposta.data[i].type == "message"){
            body.innerHTML += `
                        <div class = "mensagem">
                            <div class = "mensagemFlex">
                                <p>
                                    <span class = "pC">(${resposta.data[i].time})</span>
                                    <span class = "pN">${resposta.data[i].from}</span>
                                    para 
                                    <span class = "pN"> ${resposta.data[i].to}</span>:
                                    ${resposta.data[i].text}
                                </p>
                            </div>
                        </div>
        `;
        }
        else{
            body.innerHTML += `
                        <div class = "mensagem private_message">
                            <div class = "mensagemFlex">
                                <p>
                                    <span class = "pC">(${resposta.data[i].time})</span>
                                    <span class = "pN">${resposta.data[i].from}</span>
                                    reservadamente para 
                                    <span class = "pN"> ${resposta.data[i].to}</span>:
                                    ${resposta.data[i].text}
                                </p>
                            </div>
                        </div>
        `;
        }
    }body.scrollIntoView({block: "end", behavior: "smooth"});
}

function pegarParticipantes(resposta){
    let elemento = document.querySelector(".telaContatosNomes");
    elemento.innerHTML = `
    <button onclick="paraQuem(this);">
        <div class = "telaContatosNome">
            <div class = "nomeIcone">
                <img id = "telaContatosNomeTodos" src = "img/vetor.svg">
                <p>Todos</p>
            </div>
            <div class = "check">
                <img src = "img/check.png">
            </div>
        </div>
    </button>
    `;
    for(let i = 0; i < resposta.data.length; i++){
        elemento.innerHTML += `
        <button onclick="paraQuem(this);">
            <div class = "telaContatosNome">
                <div class = "nomeIcone">
                    <img id = "telaContatosNomeTodos" src = "img/vetor.svg">
                    <p>${resposta.data[i].name}</p>
                </div>
                <div class = "check escondido">
                    <img src = "img/check.png">
                </div>
            </div>
        </button>
        `;
    }
}

function abrirContatos(){
    telaContatos.classList.remove("escondido");
    telaPreta.classList.remove("escondido");
}

function fecharContatos(){
    telaContatos.classList.add("escondido");
    telaPreta.classList.add("escondido");
}

function paraQuem(elemento){
    let check = document.querySelectorAll(".telaContatosNomes .check");
    for (let i = 0; i<check.length;i++){
        if(check[i].classList.contains("escondido")){
            continue;
        }
        else{
            check[i].classList.add("escondido");
        }
    }
    paraQuemNome = elemento.children[0].children[0].children[1].innerHTML;
    let escolhido = elemento.children[0].children[1]
    escolhido.classList.remove("escondido");
}
function visibilidade(elemento){
    let check = document.querySelectorAll(".telaContatosVisibilidade .check");
    for (let i = 0; i<check.length;i++){
        if(check[i].classList.contains("escondido")){
            continue;
        }
        else{
            check[i].classList.add("escondido");
        }
    }
    visibilidadeNome = elemento.children[0].children[0].children[1].innerHTML;
    let escolhido = elemento.children[0].children[1]
    escolhido.classList.remove("escondido");
}
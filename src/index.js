var cards = document.querySelector('#cards')

function createCard(repository) {
    //get owner img
    let owner = repository['owner'];
    let ownerAvatar = owner['avatar_url']

    //get repository name
    let repoName = repository['name'].replace(/-/g, " ")

    //get repository description
    let repoDescription = repository['description'];

    //create card template
    let div = document.createElement("div")
    div.classList.add("col")
    div.innerHTML =
        `<div class="card h-100">
        <img src="${ownerAvatar}" class="card-img-top " alt="...">
        <div class="card-body">
            <h5 class="card-title fw-bolder text-center">${repoName}</h5>
            <p class="card-text">${repoDescription}</p>
        </div>
    </div>`
    cards.appendChild(div)
}



function repositoryRequest(apiLink) {
    //campos a serem preenchidos
    let ajax = new XMLHttpRequest();
    ajax.open("get", apiLink)
    ajax.send(null)
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                //transformar os dados json para array
                repository = JSON.parse(ajax.responseText);
                createCard(repository)

            } else {
                alert("deu merda")

            }
        }
    }
}
repositoryRequest('https://api.github.com/repos/filipedeschamps/meu-primeiro-jogo-multiplayer')
repositoryRequest('https://api.github.com/repos/facebook/react-native')
repositoryRequest('https://api.github.com/repos/twbs/bootstrap')






var cards = document.querySelector('#cards')
var tableContributors = document.querySelector("#tbodyContributors");
var tableIssues = document.querySelector("#tbodyIssues");

function cleanTbody() {
    tableContributors.innerHTML = "";
    tableIssues.innerHTML = ";"
}

function getRepoName() {
    return repoName = repository['name'].replace(/-/g, " ")
}

//=========create contributors list

function createContributorsList(repository) {
    //console.log(repository);
    for (contributor of repository) {
        let tbody = document.createElement('tr')

        tbody.innerHTML = `
        <th scope="row"><img src="${contributor['avatar_url']}" alt="" width="32" height="32" " alt="..."></th>
       <td>${contributor['contributions']}</td>
       <td>${contributor['login']}</td>`;
        tableContributors.appendChild(tbody)
    }
}

function createIssuesList(repository) {
    console.log(repository);
    for (issue of repository) {

        console.log(issue);

        let tbody = document.createElement('tr')


        tbody.innerHTML = ` 
            <th scope="row">#</th>
         <td>${issue['title']}</td>
           <td>${issue['state']}</td>`;
        tableIssues.appendChild(tbody)
    }

}

//===============modal creation =============
function createModal(repository) {
    //console.log(repository);
    getRepoName()

    let repoUrl = repository["url"]
    let contributorsURL = repoUrl + '/contributors';
    //console.log("contributors ==" + contributorsURL);
    repositoryRequest(contributorsURL, createContributorsList);

    //

    let issuesUrl = repoUrl + '/issues?state=all';
    repositoryRequest(issuesUrl, createIssuesList)

    document.querySelector('.modal-title').textContent = repoName;

}

///=========card creation==============

function createCard(repository) {
    //get url
    let repoUrl = repository["url"]
    //get owner img
    let owner = repository['owner'];
    let ownerAvatar = owner['avatar_url']

    //get repository name
    getRepoName()

    //get repository description
    let repoDescription = repository['description'];

    //create card template
    let div = document.createElement("div")
    div.classList.add("col")
    div.innerHTML =
        `
        <div class="card fade-in-right h-100">
        <img src="${ownerAvatar}" class="card-img-top " alt="...">
        <div class="card-body">
            <h5 class="card-title fw-bolder text-center text-capitalize">${repoName}</h5>
            <p class="card-text">${repoDescription}</p>
            <a onclick="repositoryRequest(this.id, createModal)" id="${repoUrl}" href="" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#modal">Go somewhere</a>
        </div>
    </div></a>`
    cards.appendChild(div)

}

//=============================================================================
function repositoryRequest(apiLink, setFuntion) {  /// setFuntion options:  createCard  ||  createModal ///
    //requisição api github: https://developer.github.com/v3
    let ajax = new XMLHttpRequest();
    ajax.open("get", apiLink)
    ajax.send(null)
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                //transformar os dados json para array
                repository = JSON.parse(ajax.responseText);

                setFuntion(repository)
            } else {
                alert("Repository not found")
            }
        }
    }
}
repositoryRequest('https://api.github.com/repos/filipedeschamps/meu-primeiro-jogo-multiplayer', createCard)
repositoryRequest('https://api.github.com/repos/facebook/react-native', createCard)
repositoryRequest('https://api.github.com/repos/twbs/bootstrap', createCard)

//===========modal=============/




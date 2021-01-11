var cards = document.querySelector('#cards')
var tableContributors = document.querySelector("#tbodyContributors");
var tableIssues = document.querySelector("#tbodyIssues");

var modal_issue = document.querySelector("#modal-issue")


function cleanTbody() {
    tableContributors.innerHTML = "";
    tableIssues.innerHTML = ""
    document.querySelector("#selectButton").value = "selecione"
}
function cleanModal() {
    document.querySelector("#secondModalHeader").innerHTML = "";
    modal_issue.innerHTML = ""
}

function getRepoName() {
    return repoName = repository['name'].replace(/-/g, " ")
}


function contributorsTemplate(rank) {
    let tbody = document.createElement('tr')
    tbody.innerHTML = `<th scope="row"><img src="${contributor['avatar_url']}" alt="" width="32" height="32" " alt="..."></th>
       <td>${contributor['contributions'] + rank}</td>
       <td>${contributor['login']}</td>`;
    tableContributors.appendChild(tbody)
}
function createContributorsList(repository) {

    for (contributor of repository) {
        if (contributor['contributions'] >= 500) {
            contributorsTemplate(`<span style="color: chartreuse; font-size:0.9em; margin-left:10px" > 500+</span>`)
        }
    }
    for (contributor of repository) {
        if (contributor['contributions'] >= 200 && contributor['contributions'] < 500) {
            contributorsTemplate(`<span style="color: coral; font-size:0.9em; margin-left:10px" > 200+</span>`)
        }
    }
    for (contributor of repository) {
        if (contributor['contributions'] >= 100 && contributor['contributions'] < 200) {
            contributorsTemplate(`<span style="color: yellow; font-size:0.9em; margin-left:10px" > 100+</span>`)
        }
    }
}
function bodyList(issue) {

    let tbody = document.createElement('tr')
    tbody.setAttribute("class", "d-none")
    tbody.setAttribute("id", issue['state'])


    tbody.innerHTML = `<th  class="issueState ${issue['state']}" scope="row">#</th>
    <td onclick="repositoryRequest(id,createSecondModal)" data-bs-toggle="modal" data-bs-target="#secondModal" id="${issue['url']}">${issue['title']}</td>
    <td class="issueState${issue['state']}">${issue['state']}</td>`;
    tableIssues.appendChild(tbody)

    //<td onclick="repositoryRequest('${issue['url']},createSecondModal)" data-bs-toggle="modal" data-bs-target="#secondModal" id="${issue['url']}">${issue['title']}</td>
}

function openIssuesList(repository) {
    for (issue of repository) {
        bodyList(issue)
    }
}
function closedIssuesList(repository) {
    for (issue of repository) {
        bodyList(issue)
    }
}

function createModal(repository) {
    getRepoName()
    let repoUrl = repository["url"]

    let contributorsURL = repoUrl + '/contributors';
    repositoryRequest(contributorsURL, createContributorsList);

    let openIssuesUrl = repoUrl + '/issues?state=open';
    repositoryRequest(openIssuesUrl, openIssuesList)

    let closedIssuesUrl = repoUrl + '/issues?state=closed';
    repositoryRequest(closedIssuesUrl, closedIssuesList)

    document.querySelector('.modal-title').textContent = repoName;

}

function createCard(repository) {
    let repoUrl = repository["url"]

    let owner = repository['owner'];
    let ownerAvatar = owner['avatar_url']

    getRepoName()

    let repoDescription = repository['description'];

    let div = document.createElement("div")
    div.classList.add("col")
    div.innerHTML = `<div class="card col h-100">
        <img src="${ownerAvatar}" class="blinkShadow card-img-top " alt="repository avatar">
        <div class="card-body text-center">
            <h5 class="card-title ">${repoName}</h5>
            <p class="card-text ">${repoDescription}</p>
            <a onclick="repositoryRequest(this.id, createModal)" id="${repoUrl}" href="" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#modal">informaçoes</a>
        </div>
    </div></a>`

    cards.appendChild(div)
}

function repositoryRequest(apiLink, setFuntion) {  /// setFuntion options:createCard ||createModal ||createContributorsList ||openIssuesList || closedIssuesList ///

    let ajax = new XMLHttpRequest();
    ajax.open("get", apiLink)
    ajax.send(null)
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                repository = JSON.parse(ajax.responseText);
                setFuntion(repository)
            } else {
                alert("Repository not found")
            }
        }
    }
}

function hideTrs(id) {
    let hidetrs = document.querySelectorAll(id)
    for (tr of hidetrs) {
        tr.classList.add("d-none")
    }
}
function showTrs(id) {
    let showtrs = document.querySelectorAll(id)
    for (tr of showtrs) {
        tr.classList.remove("d-none")
    }
}
function issueVisibility() {
    var buttonValue = document.querySelector("#selectButton").value
    if (buttonValue == "open") {
        hideTrs("#closed")
        showTrs("#open")
    } if (buttonValue == "closed") {
        hideTrs("#open")
        showTrs("#closed")
    }
}

repositoryRequest('https://api.github.com/repos/electron/electron', createCard)
repositoryRequest('https://api.github.com/repos/facebook/react-native', createCard)
repositoryRequest('https://api.github.com/repos/twbs/bootstrap', createCard)


function createSecondModal(repository) {
   
    let issueTitle = repository["title"]
    let issueBody = repository["body"]
    let commentsUrl = repository["comments_url"]

   


    let div = document.createElement("div")
    div.classList.add("modal-body")
    div.setAttribute("id","shadowModal")

    div.innerHTML = `<div class="modal-header">
        <h5 class="modal-title text-center font-weight-bold" id="secondModalHeader">${issueTitle}</h5>
        <button onclick="cleanModal()" id="closeButton" type="button" class="btn btn-danger"
        data-bs-dismiss="modal"><span>Fechar</span></button>
        </div>
      </div><div class="">
     <div class="second-modal-body">
            <p class="text-justify">${issueBody}</p>
        </div>
    </div></a>`
    modal_issue.appendChild(div)
}

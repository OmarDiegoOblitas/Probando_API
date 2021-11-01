//obtener Formulario
const form = document.getElementById("form")
//Obtener la barra de busqueda
const search = document.getElementById("search")

//obtener el widget del usuario

const userCard= document.getElementById("usercard")

//Escuchar el evento Submit del form
form.addEventListener ("submit", evt=> {
    evt.preventDefault()
    const username = search.value
    getUserData(username)
    search.value = ""
})

//obtener la info.del usuario Github
async function getUserData(username){
    const API = "https://api.github.com/users/";

    try{
        const userRequest = await fetch (API + username);
        if (!userRequest.ok) {
            throw new Error(userRequest.status)
        }

        const userData = await userRequest.json();

        if (userData.public_repos) {
            const reposRequest = await fetch(API + username + "/repos");
            const reposData = await reposRequest.json();
            userData.repos = reposData;
        } 

        showUserData(userData);
    }
    catch(error){
        showError(error.message);
    }
}
//Funcion para componer e hidratar el HTML del widget
function showUserData(userData){
    let userContent = `
    <img src="${userData.avatar_url}" alt="avatar">
    <h1>${ userData.name}</h1>
    <p>${ userData.bio}</p>

    <section class="data">
        <ul>
            <li>Followers: ${userData.followers}</li>
            <li>Followings: ${userData.following}</li>
            <li>Repos: ${userData.public_repos}</li>
        </ul>
    </section>
    `;
    if (userData.repos) {
        userContent += `<section class="repos">`

        userData.repos.slice(0, 7).forEach(repo => {
            userContent += `<a href= "${repo.html_url}" target="_blank">${repo.name} </a>`
        })
        userContent += `</section>`;
    }
    userCard.innerHTML = userContent;
}
//funcion para gestionar los errores
function showError(error) {
    const errorContent = `<h1>Error ${error}</h1>`
    userCard.innerHTML = errorContent;
}

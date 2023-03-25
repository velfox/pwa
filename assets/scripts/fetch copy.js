async function f(url) {
  let data = []
  const response = await fetch(url);
  data = await response.json();
  return data
}


async function init() {
  let projects = await f('https://cmgt.hr.nl/api/projects')
  for (const item of projects.data) {
    // console.log(item.project);
    // addProject(item.project)
    addProjectIndexDB(item.project)
  }
  loadProjectsIndexDB()
}

init()

async function addProject(project) {
  var taggs = ``

  // add tagss to var
  for (let i = 0; i < project.tags['length']; i++) {
    var obj = project.tags[i];
    var name = (obj['name']);
    var taggs = taggs + `<span class="badge badge-pill badge-primary">${name}</span>`
  }

  //add project info to card, place card in prjojecten div
  document.querySelector('#projecten').insertAdjacentHTML(
    'afterbegin',
    `<div class="project">
      <div class="card">
      <img class="card-img-top" src="${project.header_image}" alt="Card image cap">
      
      <div class="card-body">

        <h5 class="card-title">${project.title}</h5>

        <div id="tags">
          ${taggs}
        </div>

        <p class="card-text">${project.tagline}</p>

      </div>

      <div class="card-body">
        <a href="/project.html?p=${project.slug}" class="btn btn-outline-secondary stretched-link">${project.title}</a>
      </div>

      <div class="card-footer text-muted">
        by ${project.author}
      </div>

      <div class="row text-center text-lg-start">
      
      </div>

    </div>
    </div>`
  )
}

function addProjectIndexDB(project){
  // console.log(project)
  localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
    ]).then(function() {

    var key = project.slug;
    var value = project;

    //create or load project instance
    var projects = localforage.createInstance({
      name: "projects",
      storeName: "projects"
      
    });
    //add project to projects
    projects.setItem(key, value);
  });  
}

function loadProjectsIndexDB(){

//create or load project instance
var projects = localforage.createInstance({
  name: "projects"
});

// An array of all the key names.
projects.keys().then(function(keys, projects) {

  //create or load project instance
  var projects = localforage.createInstance({
    name: "projects"
  });
    //loop trough all keynames.
    for (let i = 0; i < keys.length; i++) {
    //get projects from indexDB projects by key name  
    projects.getItem(keys[i]).then(function(value) {
      //add projects to the website
      addProject(value)
    }).catch(function(err) {
      // This code runs if there were any errors
      console.log(err);
    });
  }

}).catch(function(err) {
  // This code runs if there were any errors
  console.log(err);
});

}

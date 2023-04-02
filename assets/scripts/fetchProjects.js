async function getProjects() {
  let url = 'https://cmgt.hr.nl/api/projects/'
  let projects = [];
  
  try {
      let response = await fetch(url);
      if (response.status === 200) {
      console.log('test status code 200');
      projects = await response.json();
      for (const item of projects.data) {
        addProject(item.project)
        // addProjectIndexDB(item.project)
      }
    }
  } catch (err) {
    // loadProjectsIndexDB() 
  }
  // loadProjectsIndexDB() 
}

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

    localforage.config({
      name: "projects",
      storeName: "projects"
    });

    //add project to projects
    localforage.setItem(key, value);

    //create or load project instance
    // var projects = localforage.createInstance({
    //   name: "projects"
    // });
  });  
}

function loadProjectsIndexDB(){
// An array of all the key names.
localforage.keys().then(function(keys) {
    //loop trough all keynames.
    for (let i = 0; i < keys.length; i++) {
    //get projects from indexDB projects by key name  
    localforage.getItem(keys[i]).then(function(value) {
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

window.addEventListener("online", () => {
  document.getElementById("projecten").innerHTML = "";
  console.log('fetching projecten')
  getProjects()
})

// if(!navigator.onLine){
//   loadProjectsIndexDB()
//   console.log('offline loading from indexDB') 
// } else {
//   getProjects()
// }

getProjects()
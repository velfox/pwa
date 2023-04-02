async function getProjects() {
  let url = 'https://cmgt.hr.nl/api/projects/'
  let projects = [];
  
  try {
      let response = await fetch(url);
      console.log('project fetch result');

      if (response.status === 200) {
      console.log('test status code 200');
      projects = await response.json();
      console.log(projects);
      for (const item of projects.data) {
        addProject(item.project)
        // addProjectIndexDB(item.project)
      }
    }
  } catch (err) {
    // loadProjectsIndexDB() 
    console.log('error fetch function')
    console.log(err);
  }
  console.log('exit fetch function')
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

window.addEventListener("online", () => {
  document.getElementById("projecten").innerHTML = "";
  console.log('fetching projecten')
  getProjects()
})

getProjects()
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
    addProject(item.project)
  }
}

// function addProjectTaggs (project) {
//   var projecten = document.getElementById('projecten');
//   const newProject = document.createElement('div')
//   newProject.classList.add('project');

//   // create a new div element
//   const newDiv = document.createElement("div");
//   newDiv.classList.add('project-title');
//   // and give it some content
//   const newContent = document.createTextNode(project.title);

//   // add the text node to the newly created div
//   newDiv.appendChild(newContent);

//   // add the newly created element and its content into the DOM
//   const currentDiv = document.getElementById("div1");
//   document.body.insertBefore(newDiv, currentDiv);

//   projecten.appendChild(newProject)
// }

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



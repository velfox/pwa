async function f(url) {
  let data = []
  const response = await fetch(url);
  data = await response.json();
  return data
}


async function init() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const projectslug = urlParams.get('p')
  console.log(projectslug);
  console.log('hoi')
  let project = await f(`https://cmgt.hr.nl/api/projects/${projectslug}`)
  project = project.project;
  console.log(project)
  addProject(project)
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

  var screenshots = ``

  // add tagss to var
  for (let i = 0; i < project.tags['length']; i++) {
    var screenshot = project.screenshots[i];
    console.log(screenshot)
    var screenshots = screenshots + `
    <div class="">
    <a href="#" class="d-block mb-4 h-100">
      <img class="img-fluid img-thumbnail" src="${screenshot}" alt="">
    </a>
  </div>    
    `
  }


  //add project info to card, place card in prjojecten div
  document.querySelector('#project').insertAdjacentHTML(
    'afterbegin',
    `
    <section class="jumbotron text-center">
    <div class="container">
    <img class="card-img-top headimg" src="${project.header_image[0]}" alt="Card image cap">
    <div class="project-title">
    <h1 class="jumbotron-heading">${project.title}</h1>  
    </div>
    <div class="project-tagline">
      <h3 class="">${project.tagline}</h3>
    </div>
    <div class="project-tags">
      <div id="tags">
      ${taggs}
      </div>
    </div>
    <div class="project-description">
      <p>${project.description}</p>
    </div>
    <div class="project-author">
    <p> by: ${project.author}</p>
  </div>
  <div class="project-screenshots">

  ${screenshots}
</div>




  </div>
    </div>

  </section>




    </div>
    </div>`
  )


}







async function getTags() {
  let url = 'https://cmgt.hr.nl/api/tags'
  let tags = [];
  
  try {
      let res = await fetch(url);
      const { data } = await res.json();
      tags = data;
  } catch (err) {
    addTagserror(err)
  }
  addTags(tags);
}

getTags()


async function addTags(tags) {
  console.log(tags);
  var taggs = ``
  for (let i = 0; i < tags['length']; i++) {
    var obj = tags;
    var name = (obj['name']);
    console.log(tags[i].name)
    var taggs = taggs + `<button type="button" class="btn btn-outline-primary tag">${tags[i].name}</button>`
  }

  //add tagss to tags div
  document.querySelector('#tags').insertAdjacentHTML(
    'afterbegin',
    `   
      ${taggs}
    </div>`
  )
}

async function addTagserror(err) {
  console.log(err);
  //add tagss to tags div
  document.getElementById("tags").innerHTML = "";
  document.querySelector('#tags').insertAdjacentHTML(
    'afterbegin',
    `   
    <div class="alert alert-danger" role="alert">
      De aplicatie kan geen taggs laden zonder internet verbinding.
  </div>
    </div>`
  )
}

window.addEventListener("offline", () => {
  document.getElementById("tags").innerHTML = "";
  document.querySelector('#tags').insertAdjacentHTML(
    'afterbegin',
    `   
    <div class="alert alert-danger" role="alert">
      De aplicatie kan geen taggs laden zonder internet verbinding.
  </div>
    </div>`
  )
})

window.addEventListener("online", () => {
  document.getElementById("tags").innerHTML = "";
  console.log('getting tags')
  getTags()
})

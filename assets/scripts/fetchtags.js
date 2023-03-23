async function f(url) {
  let data = []
  const response = await fetch(url);
  data = await response.json();
  // addTags(data)
  return data

}


async function init() {
  let tags = await f('https://cmgt.hr.nl/api/tags')
  addTags(tags)
}

init()

async function addTags(tags) {
  console.log(tags)
  var taggs = ``
  for (let i = 0; i < tags.data['length']; i++) {
    var obj = tags.data;
    var name = (obj['name']);
    console.log(tags.data[i].name)
    var taggs = taggs + `<button type="button" class="btn btn-outline-primary tag">${tags.data[i].name}</button>`
  }

  //add tagss to tags div
  document.querySelector('#tags').insertAdjacentHTML(
    'afterbegin',
    `   
      ${taggs}
    </div>`
  )
}



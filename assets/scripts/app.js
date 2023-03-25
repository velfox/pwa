console.log('loading the serviceworker loader')
// if('serviceWorker' in navigator){
//     navigator.serviceWorker.register('/sw.js')
//         .then((reg) => console.log('Service worker registerd', reg))
//         .catch((err) => console.log('Service worker not registerd', err))
// } 

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js", {
      scope: "./",
    })
    .then((registration) => {
      let serviceWorker;
      if (registration.installing) {
        serviceWorker = registration.installing;
        document.querySelector("#swMessage").textContent = "serviceworker installing";
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
        document.querySelector("#swMessage").textContent = "serviceworker waiting";
      } else if (registration.active) {
        serviceWorker = registration.active;
        document.querySelector("#swMessage").textContent = "serviceworker active";
      }
      if (serviceWorker) {
        // logState(serviceWorker.state);
        serviceWorker.addEventListener("statechange", (e) => {
          // logState(e.target.state);
        });
      }
    })
    .catch((error) => {
      // Something went wrong during registration. The service-worker.js file
      // might be unavailable or contain a syntax error.
      console.log(error);
    });
} else {
  // The current browser doesn't support service workers.
  // Perhaps it is too old or we are not in a Secure Context.
}
 
  window.addEventListener("offline", () => {
    document.getElementById("status").innerHTML = "";
    document.getElementById('status').insertAdjacentHTML(
      'afterbegin',
      `<div class="alert alert-danger" role="alert">
      De aplicatie heeft geen internet verbinding!
    </div>`
    )
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
  document.getElementById("status").innerHTML = "";
  document.getElementById('status').insertAdjacentHTML(
    'afterbegin',
    `<div class="alert alert-success" role="alert">
    Inernet is weer beschikbaar!
  </div>`
  )
  // fadeOutEffect();
})


// function fadeOutEffect() {
//   var fadeTarget = document.getElementById('status');
//   var fadeEffect = setInterval(function () {
//       if (!fadeTarget.style.opacity) {
//           fadeTarget.style.opacity = 1;
//       }
//       if (fadeTarget.style.opacity > 0) {
//           fadeTarget.style.opacity -= 0.1;
//       } else {
//           clearInterval(fadeEffect);
//       }
//   }, 500);
// }
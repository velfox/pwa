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
    });
} else {
  // The current browser doesn't support service workers.
  // Perhaps it is too old or we are not in a Secure Context.
}

// Feel free to change the drivers order :)
localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
    ]).then(function() {
    var key = 'STORE_KEY';
    // var value = 'What we save offline';
    var value = 'hoi ik ben tim';
    value[0] = 65
    // var value = undefined;
    var UNKNOWN_KEY = 'unknown_key';
  
    localforage.setItem(key, value, function() {
      console.log('Using:' + localforage.driver());
      console.log('Saved: ' + value);
  
      localforage.getItem(key).then(function(readValue) {
        console.log('Read: ', readValue);
      });
  
      // Since this key hasn't been set yet, we'll get a null value
      localforage.getItem(UNKNOWN_KEY, function(err, readValue) {
        console.log('Result of reading ' + UNKNOWN_KEY, readValue);
      });
    });
  });
  
  // this is just for demonstration purposes
  var originalConsoleLog = console.log;
  function consoleLogProxy() {
    originalConsoleLog.apply(console, arguments);
    var htmlConsole = document.getElementById('htmlConsole');
    if (htmlConsole) {
      var message = Array.prototype.slice.apply(arguments, []).join(' ');
      htmlConsole.innerHTML += '<li>' + message + '</li>';
    }
  }
  console.log = consoleLogProxy;
 
  window.addEventListener("offline", () => {
    document.getElementById("status").innerHTML = "";
    document.getElementById('status').insertAdjacentHTML(
      'afterbegin',
      `<div class="alert alert-danger" role="alert">
      De aplicatie heeft geen internet verbinding!
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
})

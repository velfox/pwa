const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";

importScripts("/assets/scripts/localforage.js");

const assets = [
  "/",
  "/assets/css/style.css",
  // 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  // 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
  "/assets/scripts/app.js",
  "/assets/scripts/localforage.js",
  "/assets/scripts/fetchProjects.js",
  "/assets/scripts/fetchProject.js",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (evt) => {
  console.log("service worker installed ROOT");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  // console.log("try fetch in SW")

  let requestUrl = new URL(event.request.url);
  let imageUpload = (requestUrl + "").includes("uploads");

  // if (imageUpload) {
  //   // console.log("image upload")
  //   event.respondWith(networkThenCache(event));
  // }

  // tags
  // else if (requestUrl.pathname.match("/api/tags")) {
  //   console.log("tags request");
  //   event.respondWith(networkOnly(event.request));
  // }

  // Project details

  // else if (requestUrl.pathname.match("/api/projects/")) {

  //   console.log("project details")
  //   event.respondWith(projectFromIndexedDb(event.request));

  // }

  // All projects
  if (requestUrl.pathname.match("/api/projects")) {
    console.log("all projects");
    // event.respondWith(networkThenIndexDB(event.request));
    event.respondWith(networkThenIndexedDb(event.request));
  } else {
    console.log("app shell");
    cacheThenNetworkWithLogging(event);
  }
});

function networkThenIndexedDb(request) {
  console.log("networkThenIndexedDb");
  return fetch(request)
    .then((response) => {
      // clone response
      console.log("verwerken van networkThenIndexedDb fetch");
      const response2 = response.clone();
      // response gebruiken voor opslag indexedDB
      addProjectIndexDB(response);
      return response2;
    })
    .catch(() => {
      // indexedDb
      console.log("offline loading from index db");
      console.log(projectsFromIndexedDb());
      return projectsFromIndexedDb()
      .then(json => {
        console.log(json);
        let stringData = JSON.stringify(json)
        return Promise.resolve(
          new Response({
            data: 
            // wat je uit indexedDb haalt als object hier meegeven
            stringData}
          )
        );
      })
    });
}

async function addProjectIndexDB(response) {
  let json = await response.json();
  console.log("JSON: ",json);
  console.log("add projects to indexDB");
  for (const item of json.data) {
    console.log(item.project);
    localforage.setDriver([
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE
      ]).then(function() {

      localforage.config({
        name: "projects",
        storeName: "projects"
      });
    })

    //add project to projects
    localforage.setItem(item.project.slug, item.project);
  }
}

function cacheThenNetworkWithLogging(evt) {
  if (!(evt.request.url.indexOf("http") === 0)) return;
  if ((evt.request.url.indexOf('/api/projects') === 18)) return;
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then((fetchRes) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchRes.clone());
              // check cached items size
              limitCacheSize(dynamicCacheName, 400);
              return fetchRes;
            });
          })
        );
      })
      .catch(() => {
        console.log(
          evt.request +
            "kon niet worden gevonden in de cache en kon geen fetch uitvoeren"
        );
      })
  );
}

function projectsFromIndexedDb() {
console.log('hi?')
  localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
    ]).then(function() {

    localforage.config({
      name: "projects",
      storeName: "projects"
    });
  })
  // An array of all the key names.
  return localforage.keys()
  .then(keys => {
    return Promise.all(keys.map(key => {
      return localforage.getItem(key)
      .then(value => {
        console.log('localforage function test')
        console.log(value);
        return {"project": value}
      })
      .catch(e => {
        console.log("Error in localforage.getItem ", e);
      })
    }))
  })


  // localforage
  //   .keys()
  //   .then(function (keys) {
  //     //loop trough all keynames.
  //     let data = new Array()
  //     for (let i = 0; i < keys.length; i++) {
  //       //get projects from indexDB projects by key name

  //       localforage
  //         .getItem(keys[i])
  //         .then((value) => {
  //           console.log('getting from index db');
  //           console.log(value);
  //           console.log(data);
  //           console.log(typeof data);
  //           data.push(value)
  //         })
  //         .catch(function (err) {
  //           // This code runs if there were any errors
  //           console.log(err);
  //         });
  //     }
  //     console.log('done loading data from index db');
  //     console.log(data);
  //     return data;
  //   })
  //   .catch(function (err) {
  //     // This code runs if there were any errors
  //     console.log(err);
  //   });
    // data = JSON.stringify(data)
}

// function addProjectIndexDB(project) {
//   // console.log(project)
//   localforage
//     .setDriver([
//       localforage.INDEXEDDB,
//       localforage.WEBSQL,
//       localforage.LOCALSTORAGE,
//     ])
//     .then(function () {
//       var key = project.slug;
//       var value = project;

//       localforage.config({
//         name: "projects",
//         storeName: "projects",
//       });

//       //add project to projects
//       localforage.setItem(key, value);
//     });
// }

function projectFromIndexedDb() {
  console.log(evt);
  var p
  // An array of all the key names.
  localforage
    .keys()
    .then(function (keys) {
      //loop trough all keynames.
      for (let i = 0; i < keys.length; i++) {
        //get projects from indexDB projects by key name
        localforage
          .getItem(keys[i])
          .then(function (value) {
          })
          .catch(function (err) {
            // This code runs if there were any errors
            console.log(err);
          });
      }
    })
    .catch(function (err) {
      // This code runs if there were any errors
      console.log(err);
    });
}

function LoadFromCache() {}

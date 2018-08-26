var version = 1,
	appShell = 'appShell-'+version,
	filesToCache = []; /*тут должны быть статичные ресурсы для инстала*/

var offline = false;


self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(appShell).then(function(cache) {
      console.log('[ServiceWorker] install кэширование оболочки');
      return cache.addAll(filesToCache);
    })
  );
});


self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] активация service-worker');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== appShell) {
          console.log('[ServiceWorker] удаление старого кэша', key);
          return caches.delete(key);
        }
      }));
    }).catch(function(err){console.log('не удается активировать service-worker: '+err);})
  );
});


function addToCache (cacheName,req,res) {
  if (res && res.status===200) {
  caches.open(cacheName)
    .then(cache => {cache.put(req, res);})
    .catch( error => {console.log('Ошибка добавления в кэш: '+req.url);});
  }
}


self.addEventListener("message", evt => {
  if (evt.data && evt.data.command == "offline") {
    console.dir('надо отдать для оффлайна');
    offline = true;
  }
});


self.addEventListener('fetch', function(event) {
  
  var request=event.request;
  if (request.method != 'GET' && request.url.indexOf('http') !== -1) return;

  let acceptHeader = request.headers.get('Accept');
  let resType = 'static';

  if (acceptHeader.indexOf('html') !== -1) resType = 'html';
  else if (acceptHeader.indexOf('image') !== -1) resType = 'img';
  else if (acceptHeader.indexOf('css') !== -1) resType = 'css';
  else if (request.url.indexOf('fonts/') !== -1) resType = 'fonts';
  else if (request.url.indexOf('.js') !==-1) resType = 'js';

  console.dir(offline);

  if (!offline)
    fetch(request)
      .then( res => { if (res.status == 200) addToCache(resType, request, res.clone()); })
      .catch( (err) => { console.dir(err); });
  else   
    event.respondWith( 
      caches.match(request)
            .then( res => { 
              console.log(res,'СУКА НАДО ОТДАТЬ ',request.url);
              if (res && res.status == 200) return res; 
            })
            .catch( err => { console.dir(err); })
    );

});






















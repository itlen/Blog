var App = function(params){
	this.wrapper = params.wrapper;
	this.post = params.post;
	this.hompage = params.hompage;
}

App.prototype.init = function(){
	this.getData(window.location.hash);
}

App.prototype.setState = function(state){
	document.body.className = '';
	document.body.classList.add(state);
}

App.prototype.active = function(){
	this.setState('active');
}

App.prototype.done = function(){
	this.setState('done');
}

App.prototype.hide = function(){
	this.setState('hideapp');
	this.post.innerHTML = '';
}

App.prototype.error = function(html){
	this.setState('done');
	this.post.innerHTML = html;
}

App.prototype.bind = function(cssSelectors,events,callback,debug=false){
	events = events.split(',');
	elements= this.wrapper.querySelectorAll(cssSelectors)||this;
	elements.forEach(element=>{
		events.forEach(event=>{
			element.addEventListener(event,callback);
			if (debug) console.dir(element+' listen '+event);
		});
	});
}

App.prototype.renderPost = function (data) {

	if(data.length<1) {
		this.hide();
		return;
	}

	var html='';

	if (data.length == 1) {

		html = '<h2 class="post-title">'+data[0].title+'</h2>';
		html += '<div class="post-body">'+data[0].body+'</div>';

	} else {

		[...data].forEach(i=>{
			html += '<br><a class="read-more" href="post/'+i.id+'">'+i.title+'</a>';
		});
	}
	
	this.post.innerHTML = html;

	this.bind('a','click',(e)=>{
		
		let href = e.target.getAttribute('href');
		let blank = href.indexOf('http');
		let examples = href.indexOf('examples');
	
		if ( href != '#' && blank < 0 && examples < 0) {
			e.preventDefault();
			window.location.hash = '/'+href;
		} else if (blank>-1 && examples < 0) {
			console.dir(blank);
			e.target.setAttribute('target','_blank');
		}
	});
}

App.prototype.getData = function(url){

	let rout = url.split('/').filter(i=>i!='#'&&i!='/'&&i!='');

	if(rout.length<1) {
		this.hide();
		return;
	}

	this.active();

	switch(rout.length){
		case 1: url='data/'+rout[0]+'.json';break;
		case 2: url='data/post-'+rout[1]+'.json';break;
		case 3: url='data/post-'+rout[1]+'-'+rout[2]+'.json';break;
		default:break;
	}

	if('caches' in self) {
		console.clear();
		console.dir('идем в кэш');
		caches.open('myCache').then(cache=>{
			cache.match(url).then( response => { 
				
				console.dir('кэш резолвится c '+response+', '+response.status);

				if(response.status == 200) {	// don't check {response && response.status == 200

						response.json().then(data=>{
							this.done();
							console.dir('отдали из кэша');
							this.renderPost(data);
						}).catch(err=>{
							console.dir('но с ошибкой');
							this.error('<code>'+err+'</code><br><br>Ошибка парсинга Json объекта</p>');
						})

				}

			}).catch(()=>{

				console.dir('нет в кэше, идем в сеть');
				
				fetch(url)
					.then(response => {
						
						if(response.status == 200) { // don't check {response && response.status == 200}
							console.dir('все ок, овтет 200');
							let resClone = response.clone();

							response.json().then(data=>{
								this.done();
								console.dir('отдали из сети');
								this.renderPost(data);
							}).catch((err)=>{
								console.dir('Ошибка парсинга Json ответа');
								this.error('<code>'+err+'</code><br><br>Ошибка парсинга Json');
							})

							cache.put(url,resClone).then(e=>{
								console.dir('И положили в кэш '+url+' + '+resClone);
							});

						} else {
							console.dir(response.status+' ошибка');
							this.error('<h2>'+response.status+'</h2><br>Bad url: '+window.location.href+'<h1 style="font-size: 10em;line-height: 1;margin: .67em 0;font-weight: 900;">WE ARE SORRY</h1><br><br><br><br><br><br><p>Лишить разработчика одного пива в пятницу? <a href="#">Да</a>  <a href="#">Нет</a></p>');
						}

					}).catch((err)=>{
						msg = '<code>'+err+'<br>';
						msg += 'Net type: '+navigator.connection.effectiveType+'<br>';
						msg += 'RTT: '+navigator.connection.rtt+'<br>';
						msg += 'You online: '+navigator.onLine+'</code><br><br>';
						msg += 'Проблема с сетью. Ресурс <u>'+url+'</u> еще не в кэше';
						this.error(msg);
					});				
			});
		});
	} else {

	}
}

const Application = function(params){
	App.apply(this,arguments);
}

Application.prototype = Object.create(App.prototype);
Application.prototype.constructor = Application;

const app = new Application({
	wrapper: document.getElementById('posts'),
	post: document.querySelector('.posts-wrapper'),
	hompage: document.querySelector('main')
});

app.init();
console.dir(app);
/*************************************************************************/	

	
	
	window.addEventListener('hashchange',()=>{ app.init(); });

	document.querySelectorAll('a').forEach((item)=>{
		item.addEventListener('click',function(e){
			let href = this.getAttribute('href');
			if ( href != '#' && href.indexOf('examples') < 0) {
				e.preventDefault();
				window.location.hash = '/'+href;
			}
		});
	});
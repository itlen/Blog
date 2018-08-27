class App {
	
	constructor(){
		let args = arguments[0];
		this.wrapper = args.wrapper;
		this.post = args.post;
		this.hompage = args.hompage;
		this.states = ['active','hideapp','done','o'];
		this.init();
	}

	init() { this.getData(window.location.hash); }

	setState(state='',html='') {
		document.body.className = '';
		if(state) document.body.classList.add(state);
		if(html) this.post.innerHTML = html; 
	}

	bind(cssSelectors,events,callback) {
		events = events.split(',');
		let elements= this.wrapper.querySelectorAll(cssSelectors)||this;
		elements.forEach(element=>{
			events.forEach(event=>{
				element.addEventListener(event,callback);
			});
		});
	}

	renderPost(data) {

		if(data.length<1) {
			this.setState('hideapp');
			return;
		}

		let html='';

		if (data.length == 1) {

			html = '<h2 class="post-title">'+data[0].title+'</h2>';
			html += '<div class="post-body">'+data[0].body+'</div>';

		} else {

			[...data].forEach(i=>{
				html += '<br><a class="read-more" href="post/'+i.id+'">'+i.title+'</a>';
			});
		}
		
		this.post.innerHTML = html.replace('<script>','');

		this.bind('a:not(.git)','click',(e)=>{
			let href = e.target.getAttribute('href');
			this.click(href,e);
		});
	}

	click(href,event){
	
		let blank = href.indexOf('http');
		let examples = href.indexOf('examples');
		console.dir(href);

		if ( href != '#' && blank < 0 && examples < 0) {
			event.preventDefault();
			window.location.hash = '/'+href;
		} else if (blank>-1 && examples < 0) {
			event.preventDefault();
			event.target.setAttribute('target','_blank');
		}

	}

	getData(url) {

		let rout = url.split('/').filter(i=>i!='#'&&i!='/'&&i!='');

		if(rout.length<1) {
			this.setState('hideapp','');
			return;
		}

		this.setState('active');

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
								this.setState('done');
								console.dir('отдали из кэша');
								this.renderPost(data);
							}).catch(err=>{
								console.dir('но с ошибкой');
								this.setState('done','<code>'+err+'</code><br><br>Ошибка парсинга Json объекта</p>');
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
									this.srState('done','<code>'+err+'</code><br><br>Ошибка парсинга Json');
								})

								cache.put(url,resClone).then(e=>{
									console.dir('И положили в кэш '+url+' + '+resClone);
								});

							} else {
								console.dir(response.status+' ошибка');
								this.setState('done','<h2>'+response.status+'</h2><br>Bad url: '+window.location.href+'<h1 style="font-size: 10em;line-height: 1;margin: .67em 0;font-weight: 900;">WE ARE SORRY</h1></p>');
							}

						}).catch((err)=>{
							msg = '<code>'+err+'<br>';
							msg += 'Net type: '+navigator.connection.effectiveType+'<br>';
							msg += 'RTT: '+navigator.connection.rtt+'<br>';
							msg += 'You online: '+navigator.onLine+'</code><br><br>';
							msg += 'Проблема с сетью. Ресурс <u>'+url+'</u> еще не в кэше';
							this.setState('done',msg);
						});				
				});
			});
		} else {

		}
	}


}

const app = new App({
	wrapper: document.getElementById('posts'),
	post: document.querySelector('.posts-wrapper'),
	hompage: document.querySelector('main')
});

document.querySelectorAll('a:not(.git)').forEach(item=>{
	item.addEventListener('click',function(e){
		let href = e.target.getAttribute('href');
		app.click(href,e);		
	})
});


window.addEventListener('hashchange',()=>{ app.init(); });

document.body.className ='';
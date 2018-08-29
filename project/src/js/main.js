'use strict'

import App from './class.App.js';

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


import { app } from './app.js'
// const app = new App('posts');
/*************************************************************************/

app.getData(window.location.hash)

window.addEventListener('hashchange', () => {
  app.getData(window.location.hash)
})

document.querySelectorAll('a').forEach((item) => {
  item.addEventListener('click', function (e) {
    let href = this.getAttribute('href')
    if (href != '#' && href.indexOf('data') < 0) {
      e.preventDefault()
      window.location.hash = '/' + href
    } else {
      console.dir('data')
    }
  })
})

document.body.className = ''
// function(){
// 	Object.prototype.on = function(f,c){return Array.from(this,(i)=>i.addEventListener(f,c));}
// 	Object.prototype.find = function(s){return this.querySelectorAll(s);}
// 	Object.prototype.first = function(s){if(!s) return this.firstElementChild;return this.querySelector(s);}
// 	Object.prototype.next = function(){return this.nextElementSibling;};
// 	Object.prototype.prev = function(){return this.previousElementSibling;};
// 	Object.prototype.last = function(){return this.lastElementChild;};
// 	Object.prototype.parents = function(cssSelectors){
// 		if(!cssSelectors) return this.parentElement;
// 		cssSelectors = cssSelectors.split(',');
// 		const a=[];
// 		for(let i=0;i<=cssSelectors.length;i++) {
// 			var p=this.parentElement;
// 			while(p){
// 				if (p.matches(cssSelectors[i])) {
// 					a.push(p);
// 				}
// 				p=p.parentElement;
// 			}
// 		}
// 		return a;
// 	};

// 	Object.prototype.bind = function(cssSelectors,events,callback,debug=false){
// 		events = events.split(',');
// 		elements= this.find(cssSelectors)||this;
// 		elements.forEach(element=>{
// 			events.forEach(event=>{
// 				element.addEventListener(event,callback);
// 				if (debug) console.dir(element+' listen '+event);
// 			});
// 		});
// 	}

// 	Object.prototype.toggleClass = function(className){
// 		try { this.classList.toggle(className);}
// 		catch {Array.from(this, (i)=>i.classList.toggle(className));}
// 		finally {return this;}
// 	}

// 	Object.prototype.addClass = function(className){
// 		try { this.classList.add(className);}
// 		catch {Array.from(this, (i)=>i.classList.add(className));}
// 		finally {return this;}
// 	}

// 	Object.prototype.removeClass = function(className){
// 		try { this.classList.remove(className);}
// 		catch {Array.from(this, (i)=>i.classList.remove(className));}
// 		finally {return this;}
// 	}

// 	Object.prototype.returnContext = function(obj){return obj;}
// 	Object.prototype.siblings = function(cssSelectors){
// 		s = cssSelectors || '*';
// 		return Array.from(this.parentElement.childNodes).filter(i=>i.nodeName != '#text' && i != this && i.matches(s));
// 	};

// }

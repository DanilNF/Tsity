"use strict";var svg={cache:{},_insert:function(e,t){var a=e.parentNode;if(a){a.insertAdjacentHTML("afterbegin",t);var i=a.querySelector("svg");if(i){i.classList=e.classList,i.id=e.id,i.setAttribute("role","img");var r=e.alt||e.getAttribute("aria-label")||null;i.setAttribute("aria-label",r||"false")}a.removeChild(e)}},load:function(){var e=this;arguments.length>0&&void 0!==arguments[0]||document;[].forEach.call(document.querySelectorAll("img[src*='.svg']"),(function(t){if(!t.dataset||void 0===t.dataset.original){var a=t.parentNode.querySelector("svg");a&&a.parentNode.removeChild(a);var i=t.src;void 0!==e.cache[i]?svg._insert(t,svg.cache[i]):fetch(i,{cache:"no-cache"}).then((function(e){if(e.ok)return e.text()})).then((function(e){void 0!==e&&(svg._insert(t,e),svg.cache[i]=e)}))}}))}};document.addEventListener("DOMContentLoaded",(function(e){svg.load()}));
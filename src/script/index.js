const svg = {
	cache: {},
	_insert: function (img, code) {
		const parent = img.parentNode;
		if (parent) {
			parent.insertAdjacentHTML("afterbegin", code);
			const svg = parent.querySelector("svg");
			if (svg) {
				svg.classList = img.classList;
				svg.id = img.id;
				svg.setAttribute("role", "img");
				const title = img.alt || img.getAttribute("aria-label") || null;
				svg.setAttribute("aria-label", title || "false");
			}
			parent.removeChild(img);
		}
	},
	load: function (container = document) {
		[].forEach.call(
			document.querySelectorAll("img[src*='.svg']"),
			(img) => {
				if (
					!img.dataset ||
					typeof img.dataset.original === "undefined"
				) {
					const data = img.parentNode.querySelector("svg");
					if (data) {
						data.parentNode.removeChild(data);
					}
					const src = img.src;
					if (typeof this.cache[src] !== "undefined") {
						svg._insert(img, svg.cache[src]);
					} else {
						fetch(src, {
							cache: "no-cache",
						})
							.then((response) => {
								if (response.ok) {
									return response.text();
								}
							})
							.then((text) => {
								if (typeof text !== "undefined") {
									svg._insert(img, text);
									svg.cache[src] = text;
								}
							});
					}
				}
			}
		);
	},
};

document.addEventListener("DOMContentLoaded", function(e){
	svg.load();
});


// function push(e) {
// 	e.preventDefault();
// 	//var val1 = document.getElementById("name").value;
// 	var name=document.getElementById("name").nodeValue;
// 	document.getElementById("name--lk").innerHTML=name; 
// 	// var val2 = document.getElementById("surname").value;
// 	// var val3 = document.getElementById("email").value;
// 	//document.getElementById("name--lk").value = val1;
// 	// document.getElementById("surname--lk").value = val2;
// 	// document.getElementById("email--lk").value = val3;
// 	return false;
// };



document.addEventListener("DOMContentLoaded", function() {
	horsemanCMS.init();
});


var horsemanCMS = (function () {
	function init() {
		if(!!horsemanCMS.router&&typeof(horsemanCMS.router)=='object') {
			horsemanCMS.router.init();
		}
	}

	return{
		init:init
	};
}());

var horsemanCMS = horsemanCMS || {};

horsemanCMS.router = (function () {
	function init() {
		bindEvents();
	}

	function bindEvents() {
		document.getElementsByTagName('body')[0].addEventListener('click', function(event) {
			if(event.target.tagName=='A') {
				event.preventDefault();
				horsemanCMS.router.linkClicked(event.target);
			}
			console.log(event.target)
		});
		window.onpopstate = function(event) {
			loadPageContents(document.location.pathname);
		};
	}

	function linkClicked(element) {

		//Don't capture external links or links to other targets
		if(!element.attributes.href||element.attributes.href.nodeValue.indexOf('//')>=0||!!element.attributes.target)
			return;
		navigateTo(element.attributes.href.nodeValue);
	}

	function navigateTo(href) {
		history.pushState({}, '', href);
		loadPageContents(href);
	}

	function loadPageContents(href) {
		fetch('/admin/api/pages.php'+href)
			.then(function(response) {
				return response.text();
			}).then(function(text) {
				document.getElementsByTagName('main')[0].innerHTML=text; 
			});
	}

	return{
		init:init,
		linkClicked:linkClicked
	};
}());

HTMLElement.prototype.getClosest = function (selector) {
	var elem = this;
	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	// Get closest match
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}

	return null;

};

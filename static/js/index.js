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
			}).then(function(pageFileContents) {
				pageFileContentsArray=pageFileContents.split('----------');

				if(pageFileContentsArray.length<2) {
					var metadata = null;
					var metadataJSON = '';
					var contents = pageFileContents;
				} else {
					var metadataJSON = pageFileContentsArray[0].replace('\n', '').replace('\r', '');
					var metadata = JSON.parse(metadataJSON);
					var contents = pageFileContentsArray[1];
				}

				document.getElementsByTagName('main')[0].innerHTML='<div class="horseman-content" data-type="page" data-filename="'+(href.charAt(0)=='/'?href.substr(1):href)+'" data-metadata=\''+metadataJSON+'\'>'+contents+'</div>';
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

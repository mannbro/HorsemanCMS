document.addEventListener("DOMContentLoaded", function() {
	horsemanCMS.init();
});


var horsemanCMS = (function () {
	function init() {
		if(!!horsemanCMS.router&&typeof(horsemanCMS.router)=='object') {
			horsemanCMS.router.init();
		}
		if(isAdminEnabled()) {
			loadAdmin();
		}
	}
	function isAdminEnabled() {
		return document.location.search=='?admin';
	}
        function loadAdmin() {
                var head  = document.getElementsByTagName('head')[0];
                var elem  = document.createElement('script');
                elem.src = '/static/js/admin.js';
                head.appendChild(elem);
        }

	return{
		init:init,
		isAdminEnabled:isAdminEnabled
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
				if(response.ok) {
					return response.text();
				} else {
					console.log('404');
				}
			}).then(function(pageFileContents) {
				console.log('updatePage');
				if(!!pageFileContents) {
					updatePage(pageFileContents, href);
				} else {
					//TODO: Fetch actual 404 page
					updatePage('<h1>404</h1>', href);
				}
			});
	}

	function updatePage(pageFileContents, href) {
		pageFileContentsArray=pageFileContents.split('----------');

		if(pageFileContentsArray.length<2) {
			var metadata = null;
			var metadataJSON = '';
			var contents = pageFileContents;
		} else {
			var metadataJSON = pageFileContentsArray[0].replace('\n', '').replace('\r', '');
			var metadata = JSON.parse(metadataJSON);
			var contents = pageFileContentsArray[1];
			checkIfRedirect(metadata);
		}

		//TODO: Set header data (title, meta description)
		document.getElementsByTagName('main')[0].innerHTML='<div class="horseman-content" data-type="page" data-filename="'+(href.charAt(0)=='/'?href.substr(1):href)+'" data-metadata=\''+metadataJSON+'\'>'+contents+'</div>';
	}

	function checkIfRedirect(metadata) {
		if(metadata.hasOwnProperty('redirect301')) {
			var redirectURL = metadata['redirect301'];
		} else if(metadata.hasOwnProperty('redirect302')) {
			var redirectURL = metadata['redirect301'];
		} else {
			return;
		}
		if(redirectURL.charAt(0)==='/') {
			navigateTo(redirectURL);
		} else {
			document.location.href=redirectURL;
		}
	}

	return{
		init:init,
		navigateTo:navigateTo,
		updatePage:updatePage,
		linkClicked:linkClicked,
		checkIfRedirect:checkIfRedirect
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

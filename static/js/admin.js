var horsemanCMS = horsemanCMS || {};

horsemanCMS.admin = (function () {
	function init() {
		if(document.location.search!=='?admin')
			return;

		loadCss();

		if(!!horsemanCMS.admin.editor&&typeof(horsemanCMS.admin.editor)=='object') {
			horsemanCMS.admin.editor.init();
		}
	}

	function loadCss() {
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = '/static/css/admin.css';
		link.media = 'all';
		head.appendChild(link);
	}

	return{init:init};
}());



/*
 *
 * admin_toolbar.js
 *
 */
var horsemanCMS = horsemanCMS || {};
horsemanCMS.admin = horsemanCMS.admin || {};

horsemanCMS.admin.editor = (function () {

	var	activeEditableArticle,
		dirty=false,
		selection=null;

	function init() {
		console.log('init');
		var toolbar = createToolbar();
		this.bindEvents(toolbar);
	}

	function createToolbar() {
		var toolbar=document.createElement('div');
		toolbar.classList.add('toolbar');

		toolbar.innerHTML= `
			<button class="toggleHide fas fa-bars" data-function="toggleHide"></button>
			<h1>Editor</h1>
			<div class='toolbar-currentarticle'>
				<h2>Current article</h2>
				<div class="toolbar-sourceeditor">
					<textarea class="sourcecode"></textarea>
					<button data-function="sourceEditOk">OK</button>
					<button data-function="sourceEditCancel">Cancel</button>
				</div>
				<button data-function="bold">B</button>
				<button data-function="italic">I</button>
				<button data-function="underline">U</button>
				<button data-function="strikeThrough">S</button>
				<button data-function="subscript">Sub</button>
				<button data-function="superscript">Sup</button>

				<button data-function="undo">&lt;</button>
				<button data-function="redo">&gt;</button>

				<button data-function="justifyCenter">Center</button>
				<button data-function="justifyFull">Full</button>
				<button data-function="justifyLeft">Left</button>
				<button data-function="justifyRight">Right</button>

				<button data-function="removeFormat">Unformat</button>

				<button data-function="copy">Copy</button>
				<button data-function="cut">Cut</button>
				<button data-function="paste">Paste</button>

				<button data-function="addSection">Add Section</button>
				<button data-function="addArticle">Add Article</button>

				<button data-function="sourceEditorOpen">Source</button>
				<button data-function="createLink">Link</button>
			</div>
			<div class='toolbar-currentsection'>
				<h2>Current section</h2>
			</div>
			<div class='toolbar-currentcontent'>
				<h2>Current content area</h2>
				<div class='toolbar-onlyshowwhendirty'>
					<button data-function="save">Save</button>
				</div>
			</div>
			<button data-function="toggleOutlines">Toggle Outlines</button>
			<button data-function="closeEditor">X</button>

		`;
		document.getElementsByTagName('body')[0].appendChild(toolbar);
		return toolbar;
	}

	function bindEvents(toolbar) {
		toolbar.addEventListener('click', function(event) {
			if(event.target.nodeName=='BUTTON'&&event.target.dataset.hasOwnProperty('function')) {
				var func = event.target.dataset.function; 

				if(typeof(horsemanCMS.admin.editor[func])==='function') {
					//Call the specified function in Editor
					horsemanCMS.admin.editor[func]();
				} else if(!!horsemanCMS.admin.editor.activeEditableArticle) {
					//So we don't have to create functions for simple execCommand() commands, we default to this
					//TODO: perhaps we need to support other common simple tasks that we don't want to create functions for. If so, we'll add a data tag to determine the "handler"
					document.execCommand(func);
				}
			}
		});
		document.querySelector('.toolbar .sourcecode').addEventListener("input", function(event) {
				this.dirty=true;
		});

		var articles = document.querySelectorAll('article.horseman-article');
		for (let i = 0; i < articles.length; i++) {
			this.bindArticleEvents(articles[i]);
		}
	}

	function bindArticleEvents(article) {
			article.addEventListener("click", function(event) {
				horsemanCMS.admin.editor.bindToolbar(this, event);
			});
			article.addEventListener("input", function(event) {
				horsemanCMS.admin.editor.setDirty(this);
			});
/*
			article.addEventListener("blur", function(event) {
				horsemanCMS.admin.editor.unbindToolbar();
			});
*/
	}

	function toggleHide() {
		var toolbar = document.getElementsByClassName('toolbar')[0];
		if(toolbar.classList.contains('hidden')) {
			toolbar.classList.remove('hidden');
		} else {
			toolbar.classList.add('hidden');
		}
	}

	function setDirty(article) {
		this.dirty=true;
		document.getElementsByClassName('toolbar')[0].classList.add('dirty');
		article.getClosest('.horseman-content').classList.add('dirty');
	}
	function setUndirty(article) {

	}
	function setUndirtyAll() {
		this.dirty=false;
		document.getElementsByClassName('toolbar')[0].classList.remove('dirty');
		var contentDirtys = document.querySelectorAll('.horseman-content.dirty');
		for (let i = 0; i < contentDirtys.length; i++) {
			contentDirtys[i].classList.remove('dirty');
		}

	}

	function bindToolbar(article, event) {
		article.setAttribute('contenteditable', 'true');
		document.getElementsByClassName('toolbar')[0].classList.add('bound');
		this.activeEditableArticle=article;
	}
	function unbindToolbar() {
		article=this.activeEditableArticle;
		article.setAttribute('contenteditable', 'false');
		document.getElementsByClassName('toolbar')[0].classList.remove('bound');
		this.activeEditableArticle=null;
	}


	function addSection() {
		var section=document.createElement('section');
		section.classList.add('horseman-section');
		section.innerHTML= `<article class="horseman-article"><i>Add your content here...</i></article>`;
		this.activeEditableArticle.closest('.horseman-section').parentNode.insertBefore(section, this.activeEditableArticle.closest('.horseman-section').nextSibling);
		var article=section.getElementsByClassName('horseman-article')[0];
		this.setDirty(article);
		this.bindArticleEvents(article);
	}

	function addArticle() {
		var article=document.createElement('article');
		article.classList.add('horseman-article');
		article.innerHTML= `<i>Add your content here...</i>`;
		this.activeEditableArticle.parentNode.insertBefore(article, this.activeEditableArticle.nextSibling);
		this.setDirty(article);
		this.bindArticleEvents(article);
	}

	function toggleOutlines() {
		if(document.getElementsByTagName('body')[0].classList.contains('hideoutlines')) {
			document.getElementsByTagName('body')[0].classList.remove('hideoutlines');
		} else {
			document.getElementsByTagName('body')[0].classList.add('hideoutlines');
		}
	}

	function sourceEditorOpen() {
		var editor = document.querySelector('.toolbar .sourcecode');
		editor.value = this.activeEditableArticle.innerHTML;
		editor.dirty=false;
		document.getElementsByClassName('toolbar')[0].classList.add('sourceeditoropen');
	}
	function sourceEditOk() {
		var editor = document.querySelector('.toolbar .sourcecode');
		if(editor.dirty) {
			this.activeEditableArticle.innerHTML=editor.value;
			horsemanCMS.admin.editor.setDirty(this.activeEditableArticle);
		}
		document.getElementsByClassName('toolbar')[0].classList.remove('sourceeditoropen');
	}
	function sourceEditCancel() {
		document.getElementsByClassName('toolbar')[0].classList.remove('sourceeditoropen');
	}

	function save() {

		if(!horsemanCMS.admin.editor.dirty)
			return;

		this.unbindToolbar();

		var contentDirtys = document.querySelectorAll('.horseman-content.dirty')

		for (let i = 0; i < contentDirtys.length; i++) {

			switch(contentDirtys[i].dataset.type) {
				case 'page':
					savePage(contentDirtys[i]);
					break;
				case 'block':
					saveBlock(contentDirtys[i]);
					break;
			}
		}
		setUndirtyAll();
	}

	function savePage(content) {
		fetch('/admin/api/pages.php', {
			body: JSON.stringify({
				"type": content.dataset.type,
				"filename": content.dataset.filename,
				"content": content.dataset.metadata+'\n----------\n'+content.innerHTML
			}),
			method: 'post',
			headers: {"Content-type": "application/json"}
		});
		console.log('savePage');
	}
	function saveBlock(content) {
		fetch('/admin/api/blocks.php', {
			body: JSON.stringify({
				"type": content.dataset.type,
				"filename": content.dataset.filename,
				"content": content.dataset.metadata+'\n----------\n'+content.innerHTML
			}),
			method: 'post',
			headers: {"Content-type": "application/json"}
		});
		console.log('saveBlocks');
	}

	function storeSelection() {
		if (window.getSelection) {
			var sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				this.selection=sel.getRangeAt(0);
				return this.selection;
			}
		} else if (document.selection && document.selection.createRange) {
			this.selection=document.selection.createRange();
			return this.selection;
		}
		this.selection=null;
		return this.selection;
	}

	function restoreSelection() {
		var range=this.selection;
		if (range) {
			if (window.getSelection) {
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (document.selection && range.select) {
				range.select();
			}
		}
	}

	return {
		init:init, 
		activeEditableArticle:activeEditableArticle,
		dirty:dirty,
		selection:selection,
		setDirty:setDirty,
		toggleHide:toggleHide,
		bindToolbar:bindToolbar,
		unbindToolbar:unbindToolbar,
		bindEvents:bindEvents,
		bindArticleEvents:bindArticleEvents,
		addSection:addSection,
		addArticle:addArticle,
		toggleOutlines:toggleOutlines,
		sourceEditorOpen:sourceEditorOpen,
		sourceEditOk:sourceEditOk,
		sourceEditCancel:sourceEditCancel,
		save:save,
		storeSelection:storeSelection,
		restoreSelection:restoreSelection
	};
}());

horsemanCMS.admin.init();

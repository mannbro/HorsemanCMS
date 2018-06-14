<?php
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);

$page='';
if(isset($_GET['page']))
	$page=$_GET['page'];
if(!$page)
	$page='index.html';

echo renderPage($page);

function renderPage($filename) {
	$filename=sanitizeFilename($filename);

	$decorator = file_get_contents(ROOT_PATH.'content/decorator.html');

	$pageFileContents = file_get_contents(ROOT_PATH.'content/pages/'.$filename);
	$pageFileContentsArray = explode('----------', $pageFileContents);

	if(count($pageFileContentsArray)<2) {
		$metadata = NULL;
		$metadataJSON = '';
		$contents = $pageFileContents;

	} else {
		$metadataJSON = preg_replace( "/\r|\n/", "", $pageFileContentsArray[0]);

		$metadata = json_decode($metadataJSON);

		$contents = $pageFileContentsArray[1];
	}

	$page = str_replace('<!--#MAINCONTENT#-->', '<div class="horseman-content" data-type="page" data-filename="'.$filename.'" data-metadata=\''.$metadataJSON .'\'>'.$contents.'</div>', $decorator);
	$page = str_replace('<!--#HEADCONTENT#-->', renderHead($metadata), $page);

	$regex = '<!--#(.+?)#-->';
	preg_match_all($regex, $page, $matches);

	foreach ($matches[1] as $match) {
		$page=str_replace('<!--#'.$match.'#-->', renderBlock($match), $page);
	}
	return $page;
}


function renderBlock($filename) {
	$filename=sanitizeFilename($filename);

	$blockFileContents = file_get_contents(ROOT_PATH.'content/blocks/'.$filename);
	$blockFileContentsArray = explode('----------', $blockFileContents);

	if(count($blockFileContentsArray)<2) {
		$metadata = NULL;
		$metadataJSON = '';
		$block = $blockFileContents;

	} else {
		$metadataJSON = preg_replace( "/\r|\n/", "", $blockFileContentsArray[0]);
		$metadata = json_decode($metadataJSON);

		$block = $blockFileContentsArray[1];
	}


	$regex = '<!--#(.+?)#-->';
	preg_match_all($regex, $block, $matches);

	foreach ($matches[1] as $match) {
		$block=str_replace('<!--#'.$match.'#-->', renderBlock('block', $match), $block);
	}
	return '<div class="horseman-content" data-type="block" data-filename="'.$filename.'" data-metadata=\''.$metadataJSON .'\'>'.$block.'</div>';

}

function renderHead($metadata) {
	$headcontent = '';
	if(!$metadata)
		return $headcontent;

	if(array_key_exists('title', $metadata)) {
		$headcontent.='<title>'.$metadata->title.'</title>';
	}
	if(array_key_exists('metaDescription', $metadata)) {
		$headcontent.='<meta name="description" content="'.$metadata->metaDescription.'">';
	}
	if(array_key_exists('metaKeywords', $metadata)) {
		$headcontent.='<meta name="keywords" content="'.$metadata->metaDescription.'">';
	}
	return $headcontent;
}

function sanitizeFilename($filename) {
	//TODO: Implement better sanitizing
	$filename=str_replace('..', '', $filename);
	return $filename;
}

?>

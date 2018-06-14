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
		checkIfRedirect($metadata);
	}
	if($contents=='') {
		$contents = file_get_contents(ROOT_PATH.'content/error/404.html');
		if($contents=='') {
			//Fallback
			$contents='404 Not Found';
		}
		header("HTTP/1.0 404 Not Found");
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

function checkIfRedirect($metadata) {
	if(array_key_exists('redirect301', $metadata)) {
		$redirectURL = $metadata->redirect301;
		$redirectType='301 Moved Permanently';
	} else if(array_key_exists('redirect302', $metadata)) {
		$redirectURL = $metadata->redirect302;
		$redirectType='302 Found';
	} else {
		return;
	}
	if(substr($redirectUrl, 0, 1)=='/') {
		$redirectURL=getProtocolAndHost().redirectURL;
	}

	header('HTTP/1.1 '.$redirectType);
	header('Location: '.$redirectURL);
	exit('');
}



function sanitizeFilename($filename) {
	//TODO: Implement better sanitizing
	$filename=str_replace('..', '', $filename);
	return $filename;
}

function getProtocolAndHost()
{
	$currentURL = (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";
	$currentURL .= $_SERVER["SERVER_NAME"];

	if($_SERVER["SERVER_PORT"] != "80" && $_SERVER["SERVER_PORT"] != "443")
	{
		$currentURL .= ":".$_SERVER["SERVER_PORT"];
	}

	return $currentURL;
}
?>

<?php
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);

$page='';
if(isset($_GET['page']))
	$page=$_GET['page'];
if(!$page)
	$page='index.html';


echo render('decorator', $page);

function render($type, $filename) {
	$filename=sanitizeFilename($filename);

	switch ($type) {
		case 'decorator':
			$fullPath = ROOT_PATH.'content/decorator.html';
			break;
		case 'page':
			$fullPath = ROOT_PATH.'content/pages/'.$filename;
			break;
		case 'block':
			$fullPath = ROOT_PATH.'content/blocks/'.$filename;
			break;
	}

	$contents = file_get_contents($fullPath);
	$regex = '<!--#(.+?)#-->';
	preg_match_all($regex, $contents, $matches);

	if($type=='decorator') {
		//TODO: Check if logged in as admin
		$contents=str_replace('<body', '<body data-admin="true"', $contents);
	} else if($type=='page') {
		//TODO: figure a way to set page title, description etc..
		//TODO: actually fetch 404 contents if available
		if($contents=='') {
			$contents='404 Not Found';
			header("HTTP/1.0 404 Not Found");
		}
	}
	foreach ($matches[1] as $match) {
		if($match=='MAINCONTENT') {
			$contents=str_replace('<!--#'.$match.'#-->', '<div class="horseman-content" data-type="page" data-filename="'.$filename.'">'.render('page', $filename).'</div>', $contents);
		}
		else {
			$contents=str_replace('<!--#'.$match.'#-->', '<div class="horseman-content" data-type="block" data-filename="'.$match.'">'.render('block', $match).'</div>', $contents);
		}
	}
	return $contents;
}

function sanitizeFilename($filename) {
	//TODO: Implement better sanitizing
	$filename=str_replace('..', '', $filename);
	return $filename;
}

?>

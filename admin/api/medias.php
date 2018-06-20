<?php
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT']);

//TODO: Move sanitize, save & fetching variables from JSON to separate include-file
function sanitizeFilename($filename) {
	//TODO: Implement better sanitizing
	$filename=str_replace('..', '', $filename);
	return $filename;
}

function saveContent($fullPath, $content) {
	$backupPath = $fullPath.'.'.(string)time();
	echo $fullPath;
	echo '::';
	echo $backupPath;
	rename ($fullPath, $backupPath);
	$bytes_written = file_put_contents($fullPath, $content);
}

function loadContent($fullPath) {
	$contents = file_get_contents($fullPath);
	return $contents;
}

if($_SERVER['REQUEST_METHOD'] === 'POST') {
	//TODO: Authentication
	$json = file_get_contents('php://input');
	$page_data=json_decode ($json, true);
	$type=$page_data['type'];
	$filename=sanitizeFilename($page_data['filename']);
	$content=$page_data['content'];

	$fullPath = ROOT_PATH.'content/media/'.$filename;

	saveContent($fullPath, $content);

} else if($_SERVER['PATH_INFO']!=''){
	$filename=sanitizeFilename($_SERVER['PATH_INFO']);

	$fullPath = ROOT_PATH.'content/media/'.$filename;

	//TODO: better 404 handling
	$content=loadContent($fullPath);
	if($content=='') {
		header("HTTP/1.0 404 Not Found");
	} else {
		//TODO: Set content-type depending on filename
		echo $content;
	}
} else {
	header('Content-Type: application/json');
	$fullPath = ROOT_PATH.'content/media/';

	$files = scandir($fullPath);

	$json='[';

	$first = true;

	foreach ($files as $key => $value) 
	{
		if (!in_array($value,array(".",".."))&!is_dir($fullPath . DIRECTORY_SEPARATOR . $value)) 
		{
			if(!$first)
				$json.=', ';
			$first=false;

			$exif=exif_read_data($fullPath+$value);
			print_r($exif);
			$json.='{"filename": "'.$value.'"}';
		}
	}
	$json.=']';
	echo $json;
}
?>

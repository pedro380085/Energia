<?php header('Content-Type:application/javascript; charset=UTF-8'); ?>
<?php

	// Define the javascript modules
	$modules = array(
		"validator.js",
		"pn.js",
		"field.js",
		"ajax.js",

		"functions.js",
		"loaders.js",
		"offline.js",
		"window.js",

		"collection.js",
		"tools.js",

		"index.js",
		"infoContainer.js",
		"report.js",
	);

	$hashes = "";

	// Include the modules
	for ($i = 0; $i < count($modules); $i++) {
		include_once("modules/" . $modules[$i]);
		$hashes .= md5_file("modules/" . $modules[$i]);
	}

	echo "// Hash: " . md5($hashes) . "\n";
?>
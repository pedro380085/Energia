<?php

	// Our global wrapper
	include_once("../../includes/header.php");
	
	// Header
	include_once("header.php");
	
	// Modules
	switch ($namespace) {
		case 'report':
			include_once("modules/report.php");
			break;

		default:
			http_status_code(501);
			break;
	}
	
?>
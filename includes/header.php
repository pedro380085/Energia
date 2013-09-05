<?php
header('Content-Type:text/html; charset=UTF-8');

// Connection
include_once("connection.php");

// Essential functions
include_once("function/bcrypt.php");
include_once("function/generic.php");

// Other functions
include_once("function/format.php");
include_once("function/security.php");
include_once("function/utils.php");

// Extra
include_once("wrap.php");

// Set the default time zone
mysql_query("SET time_zone = '+00:00'");
date_default_timezone_set('America/Sao_Paulo');

if ($globalDev == 0) {
	// Disable error reporting
	error_reporting(0);
	ini_set('display_errors', 'Off');

} else {
	// Disable error reporting
	error_reporting(E_ALL);
	ini_set('display_errors', 'On');
}

?>
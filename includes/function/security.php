<?php

	/**
	 * Wrappers, functions and code for database needs
	 */

	function logout() {
		$filename = basename($_SERVER['PHP_SELF']);
		$path = str_replace($filename, '', $_SERVER['PHP_SELF']);

		$security = Security::singleton();

		setcookie($security->key, '', 0, $path);
		header("Location: $path");	
		exit("Monkeys are on the way to solve whatever you need!");
	}

	function validateCompany($companyID = 0) {

		// Get the singleton
		$core = Core::singleton();

		if ($companyID == 0 && (isset($_GET["companyID"]) || isset($_COOKIE["companyID"]))) {
			// See if the user provided a company
			$companyID = isset($_GET["companyID"]) ? getAttribute($_GET["companyID"]) : getAttribute($_COOKIE["companyID"]);
		}
		
		// Assign the variable to the property
		$core->companyID = $companyID;

		$query = (
			"SELECT
				`memberCompany`.`companyID`,
				`memberCompany`.`permission`,
				`memberCompany`.`roleID`
			FROM
				`memberCompany`
			WHERE 1
				AND `memberCompany`.`memberID` = $core->memberID
		");

		// Append some information if the member has given it
		if ($core->companyID != 0) $query .= "AND `memberCompany`.`companyID` = $core->companyID";

		$result = resourceForQuery($query);

		// Create global variables
		if (mysql_num_rows($result) > 0) {
			$core->companyID = mysql_result($result, 0, "companyID");
			$core->mapID = getMapID(mysql_result($result, 0, "companyID"));
			$core->workAtCompany = true;
			$core->permission = mysql_result($result, 0, "permission");
			$core->roleID = mysql_result($result, 0, "roleID");
		} else {
			// Since no one needs permission to be inside a company, we can leave the $core->companyID as it is
			$core->workAtCompany = false;
			$core->permission = 0;
			$core->roleID = ROLE_CLIENT;
		}

		// Domain current path
		$filename = basename($_SERVER['PHP_SELF']);
		$path = str_replace($filename, '', $_SERVER['PHP_SELF']);

		// Create company cookie if not present
		if (!isset($_COOKIE["companyID"])) setcookie("companyID", $core->companyID, time() + 60*60*24*30, $path);

		// Create a last notification cookie if not present
		if (!isset($_COOKIE["lastNotificationID"])) {
			$result = getNotificationsForMapQueryText($core->mapID, '', " LIMIT 1 ");
			$lastNotificationID = (mysql_num_rows($result) > 0) ? mysql_result($result, 0, "id") : 0;
			setcookie("lastNotificationID", $lastNotificationID, time() + 60*60*24*30, $path);
		}
	}
	
?>
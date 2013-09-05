<?php

	/**
	 * Wrappers, functions and code for database needs
	 */

	/**
	 * Truncate name of something if it is bigger than maxSize
	 * @param  [string] $name    	Name to truncate
	 * @param  [int] 	$maxSize 	Max size of the name
	 * @return [string] 			Truncated name
	 */
	function truncateName($name, $maxSize, $delimiter = " ") {
		// If the name is too big, we gotta truncate it
		if (strlen(html_entity_decode($name)) > $maxSize) {
			$truncatedName = "";
			$nomes = explode($delimiter, $name);
			// We will truncate everything that comes after the given name
			for ($i = 0; $i < count($nomes); $i++) {
				if ($i == 0) {
					$truncatedName .= $nomes[$i] . " ";
				} else {
					$truncatedName .= substr($nomes[$i], 0, 1) . ". "; 
				}
			}

			// We now check it again
			if (strlen(html_entity_decode($truncatedName)) > $maxSize) {
				// If not, we truncate it right at the max size
				return substr($truncatedName, 0, $maxSize - 1) . ".";
			} else {
				return $truncatedName;
			}

		} else {
			return $name;
		}
	}
	
	/**
	 * See if the company has permissions over the given childID (which can be a category, item...)
	 * @param  integer 	$companyID 	id of the company
	 * @param  integer 	$childID 	id of the child
	 * @param  string 	$childType 	type of child
	 * @return boolean 	
	 */
	function checkPermission($companyID, $childID, $childType) {

		if ($childType == "carte") {
			$result = resourceForQuery(
				"SELECT
					`carte`.`id` 
				FROM
					`carte` 
				INNER JOIN
					`carteParent` ON `carte`.`id` = `carteParent`.`childID` 
				WHERE 1
					AND `carteParent`.`childID` = $childID 
					AND `carteParent`.`parentID` = $companyID
			");
		} elseif ($childType == "carteCategory") {
			$result = resourceForQuery(
				"SELECT
					`carte`.`id` 
				FROM
					`carte` 
				INNER JOIN
					`carteParent` ON `carte`.`id` = `carteParent`.`childID` 
				INNER JOIN
					`carteCategoryParent` ON `carte`.`id` = `carteCategoryParent`.`parentID` 
				WHERE 1
					AND `carteCategoryParent`.`childID`=$childID 
					AND `carteParent`.`parentID`=$companyID
			");
		} elseif ($childType == "carteItem") {
			$result = resourceForQuery(
			// echo (
				"SELECT
					`carte`.`id` 
				FROM
					`carte` 
				INNER JOIN
					`carteParent` ON `carte`.`id` = `carteParent`.`childID` 
				INNER JOIN
					`carteCategoryParent` ON `carte`.`id` = `carteCategoryParent`.`parentID` 
				INNER JOIN
					`carteItemParent` ON `carteCategoryParent`.`childID` = `carteItemParent`.`parentID` 
				WHERE 1 
					AND `carteItemParent`.`childID` = $childID 
					AND `carteParent`.`parentID` = $companyID
			");
		} elseif ($childType == "carteItemOption") {
			$result = resourceForQuery(
				"SELECT
					`carte`.`id` 
				FROM
					`carte` 
				INNER JOIN
					`carteParent` ON `carte`.`id` = `carteParent`.`childID` 
				INNER JOIN
					`carteCategoryParent` ON `carte`.`id` = `carteCategoryParent`.`parentID` 
				INNER JOIN
					`carteItemParent` ON `carteCategoryParent`.`childID` = `carteItemParent`.`parentID` 
				INNER JOIN
					`carteItemOptions` ON `carteItemOptions`.`itemID` = `carteItemParent`.`childID` 
				WHERE 1
					AND `carteItemOptions`.`id` = $childID 
					AND `carteParent`.`parentID` = $companyID
			");
		} elseif ($childType == "carteItemOptionItem") {
			$result = resourceForQuery(
				"SELECT
					`carte`.`id` 
				FROM
					`carte` 
				INNER JOIN
					`carteParent` ON `carte`.`id` = `carteParent`.`childID` 
				INNER JOIN
					`carteCategoryParent` ON `carte`.`id` = `carteCategoryParent`.`parentID` 
				INNER JOIN
					`carteItemParent` ON `carteCategoryParent`.`childID` = `carteItemParent`.`parentID` 
				INNER JOIN
					`carteItemOptions` ON `carteItemOptions`.`itemID` = `carteItemParent`.`childID` 
				INNER JOIN
					`carteItemOptionsItem` ON `carteItemOptionsItem`.`optionID` = `carteItemOptions`.`id` 
				WHERE 1 
					AND `carteItemOptionsItem`.`id` = $childID 
					AND `carteParent`.`parentID` = $companyID
			");
		}

		if (mysql_num_rows($result) > 0) {
			return true;
		} else {
			return false;
		}
	}

	function getTableUniqueID($tableID) {
		// Obtain the unique id from our log
		$result = resourceForQuery(
			"SELECT 
				`tableUnique`.`id` 
			FROM 
				`tableUnique` 
			INNER JOIN
				`table` ON `table`.`id`=`tableUnique`.`tableID`
			WHERE 1
				AND `tableUnique`.`tableID` = $tableID
				AND `tableUnique`.`dateBegin` > `tableUnique`.`dateEnd`
			ORDER BY
				`tableUnique`.`id` DESC
			LIMIT 1
		");

		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "id");
		} else {
			return 0;
		}
	}

	function getTableIDForUniqueID($tableUniqueID) {
		// Obtain the unique id from our log
		$result = resourceForQuery(
			"SELECT 
				`table`.`id` 
			FROM 
				`tableUnique` 
			INNER JOIN
				`table` ON `table`.`id` = `tableUnique`.`tableID`
			WHERE 1
				AND `tableUnique`.`id` = $tableUniqueID
				AND `tableUnique`.`dateBegin` > `tableUnique`.`dateEnd`
			ORDER BY
				`tableUnique`.`id` DESC
			LIMIT 1
		");

		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "id");
		} else {
			return 0;
		}
	}

	function getTableIDForOrderID($orderID) {
		// Obtain the unique id from our log
		$result = resourceForQuery(
			"SELECT 
				`table`.`id` 
			FROM 
				`tableUnique` 
			INNER JOIN
				`table` ON `table`.`id` = `tableUnique`.`tableID`
			INNER JOIN
				`order` ON `order`.`tableUniqueID` = `tableUnique`.`id`
			WHERE 1
				AND `order`.`id` = $orderID
				AND `tableUnique`.`dateBegin` > `tableUnique`.`dateEnd`
			ORDER BY
				`tableUnique`.`id` DESC
			LIMIT 1
		");

		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "id");
		} else {
			return 0;
		}
	}

	function getTableNumber($tableID) {
		// Obtain the unique id from our log
		$result = resourceForQuery("SELECT `number` FROM `table` WHERE `id`=$tableID ORDER BY `id` DESC LIMIT 1");
		
		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "number");
		} else {
			return 0;
		}
	}

	function getCompanyIDForMapID($mapID) {
		// Obtain the unique id from our log
		$result = resourceForQuery("SELECT `companyID` FROM `tableMap` WHERE `id`=$mapID LIMIT 1");

		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "companyID");
		} else {
			return 0;
		}
	}

	function getCompanyIDForTableUniqueID($tableUniqueID) {
		// Obtain the unique id from our log
		$result = resourceForQuery(
			"SELECT
				`tableMap`.`companyID`
			FROM
				`tableMap`
			INNER JOIN
				`table` ON `tableMap`.`id` = `table`.`mapID` 
			INNER JOIN
			    `tableUnique` ON `table`.`id` = `tableUnique`.`tableID` 
			WHERE
				`tableUnique`.`id` = $tableUniqueID
			LIMIT 1
		");

		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "companyID");
		} else {
			return 0;
		}
	}

	function getCompanyIDForMemberID($memberID) {
		// Obtain the unique id from our log
		$result = resourceForQuery("SELECT `companyID` FROM `memberCompany` WHERE `memberID`=$memberID LIMIT 1");

		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "companyID");
		} else {
			return 0;
		}
	}

	function getMapID($companyID) {
		// Obtain the unique id from our log
		$result = resourceForQuery("SELECT `id` FROM `tableMap` WHERE `companyID`=$companyID LIMIT 1");

		if (mysql_num_rows($result) == 1) {
			return mysql_result($result, 0, "id");
		} else {
			// See if the company exists
			$result = resourceForQuery("SELECT `id` FROM `company` WHERE `id`=$companyID");

			// If it exists, add a new map into it
			if (mysql_num_rows($result) == 1) {
				$insert = resourceForQuery("INSERT INTO `tableMap` (`companyID`, `width`, `height`) VALUES ($companyID, 0, 0)");
				return mysql_insert_id();
			} else {
				return 0;
			}
		}
	}

	function companyHasTable($companyID, $tableID) {
		$mapID = getMapID($companyID);

		$result = resourceForQuery(
			"SELECT 
				`table`.`id`
			FROM
				`tableMap`
			INNER JOIN
				`table` ON `tableMap`.`id` = `table`.`mapID`
			WHERE 1
				AND `tableMap`.`companyID` = $companyID
				AND `table`.`id` = $tableID
		");

		if (mysql_num_rows($result) > 0) {
			return true;
		} else {
			return false;
		}
	}

	function companyHasOrder($companyID, $orderID) {

		$result = resourceForQuery(
		// echo (
			"SELECT
				`order`.`id` 
			FROM 
				`order`
			INNER JOIN
			    `tableUnique` ON `order`.`tableUniqueID` = `tableUnique`.`id`
			INNER JOIN
			    `table` ON `table`.`id` = `tableUnique`.`tableID` 
			INNER JOIN
			    `tableMap` ON `tableMap`.`id` = `table`.`mapID` 
			WHERE 1
				AND `tableMap`.`companyID` = $companyID
				AND `order`.`id` = $orderID
			");

		if (mysql_num_rows($result) > 0) {
			return true;
		} else {
			return false;
		}
	}

	function tableExists($tableID) {

		$result = resourceForQuery(
			"SELECT
				`table`.`id` 
			FROM 
				`table` 
			WHERE
				`table`.`id` = $tableID
			");

		if (mysql_num_rows($result) > 0) {
			return true;
		} else {
			return false;
		}
	}

	function getPersonName($memberID) {

		$result = resourceForQuery(
			"SELECT
				`member`.`name` 
			FROM 
				`member` 
			WHERE
				`member`.`id` = $memberID
			");

		if (mysql_num_rows($result) > 0) {
			return mysql_result($result, 0, "name");
		} else {
			return "";
		}
	}

	/**
	 * Get the hash from the database
	 * @param  string $imageFile image path
	 * @return 
	 */
	function getImageUsingHash($imageFile) {

		// Generate the hash
		$hash = md5_file($imageFile);

		$result = resourceForQuery("SELECT `image` FROM `image` WHERE `hash`='$hash'");	

		if (mysql_num_rows($result) > 0) {

			if (file_exists(mysql_result($result, 0, "image"))) {
				
				// Delete the image
				unlink($imageFile);

				// Return the result
				return mysql_result($result, 0, "image");
			} else {
				$update = resourceForQuery("UPDATE `image` SET `image`='$imageFile' WHERE `hash`='$hash'");

				if ($update) {
					return $imageFile;
				} else {
					die("Couldn't change this image!");
				}
			}

		} else {

			$insert = resourceForQuery("INSERT INTO `image` (`image`, `hash`) VALUES ('$imageFile', '$hash')");

			if ($insert) {
				return $imageFile;
			} else {
				die("Could write this image!");
			}
		}
	}

	/**
	 * The default time zone
	 * @return string time zone offset
	 */
	function timeZone() {
		$now = new \DateTime();
		$mins = $now->getOffset() / 60;
		$sgn = ($mins < 0 ? -1 : 1);
		$mins = abs($mins);
		$hrs = floor($mins / 60);
		$mins -= $hrs * 60;
		$offset = sprintf('%+d:%02d', $hrs*$sgn, $mins);

		return $offset;
	}


	/**
	 * Rebuilds the whole image hash from scrath.
	 * ALWAYS RUN THIS ON DEBUG!
	 * @return
	 */
	function rebuildImageHashIndex() {

		$path = "uploads/";

		$dir = new DirectoryIterator($path);

		foreach ($dir as $fileinfo) {
		    if (!$fileinfo->isDot()) {
		        $image = $path . $fileinfo->getFilename();
		        $dead = false;

		        echo "$image";

		        // Select on the first query
		        $result = resourceForQuery("SELECT * FROM `carteItemImages` WHERE `image`='$image'");
		        echo mysql_num_rows($result);

		        if (mysql_num_rows($result) != 0) {
		        	$originalImage = getImageUsingHash($image);

			        // Images are different, we delete the image and update the reference
			        if ($originalImage != $image) {
			        	unlink($image);
				        $result = resourceForQuery("UPDATE `carteItemImages` SET `image`='$originalImage' WHERE `image`='$image'");
				    }
		        } else {
		        	$dead = true;
		        }

		        $result = resourceForQuery("SELECT * FROM `carteCategory` WHERE `image`='$image'");
		        echo mysql_num_rows($result);

		        if (mysql_num_rows($result) != 0) {
		        	$originalImage = getImageUsingHash($image);

			        // Images are different, we delete the image and update the reference
			        if ($originalImage != $image) {
			        	unlink($image);
				        $result = resourceForQuery("UPDATE `carteCategory` SET `image`='$originalImage' WHERE `image`='$image'");
				    }
		        } elseif ($dead) {
		        	// unlink($image);	
		        }
		    }
		}
	}

?>
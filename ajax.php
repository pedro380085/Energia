<?php include_once("includes/header.php"); ?>
<?php
	
// -------------------------------------- MENU --------------------------------------- //

	function convertData($data) {

        if (!strstr($data, '/')) {
			// $data está no formato ISO (yyyy-mm-dd) e deve ser convertida
			// para dd/mm/yyyy
			sscanf( $data, '%d-%d-%d', $y, $m, $d );
			return sprintf( '%d/%d/%d', $d, $m, $y );

        } else {
            // $data está no formato brasileiro e deve ser convertida para ISO
            sscanf( $data, '%d/%d/%d', $d, $m, $y );
            return sprintf( '%d-%d-%d', $y, $m, $d );
        }
 
        return false;
	}

	function importData() {

		// Import the PHPExcel parser
		include_once('classes/PHPExcel/IOFactory.php');

		// Get the filename from our requisition
		$relativePath = "energy.xlsx";

		// Number of rows on the spreadsheet
		$totalRows = -1;

		// And check that it exists and has a valid path
		if (file_exists($relativePath) && pathinfo($relativePath, PATHINFO_EXTENSION) == "xlsx") {

			// Read the object
			$objReader = PHPExcel_IOFactory::createReader('Excel2007');
			$objReader->setReadDataOnly(true);
			$objPHPExcel = $objReader->load($relativePath);
			$objWorksheet = $objPHPExcel->getActiveSheet();
			$totalRows = $objPHPExcel->getActiveSheet()->getHighestRow();

			// Headers
			$headersFound = false;
			$headersPosition = array('Data' => -1, 'Hora' => -1, 'Demand' => -1, 'Price' => -1, 'Wind' => -1, 'Balance' => -1, 'HOEP' => -1);

			foreach ($objWorksheet->getRowIterator() as $row) {

				// Clean the variables
				$lastDate = "";
				$lastHour = 0;
				$lastDemand = 0;
				$lastPrice = 0.0;
				$lastWind = 0;
				$lastBalance = 0;
				$lastHOEP = 0.0;
				
				// Get the cell iterator
				$cellIterator = $row->getCellIterator();
				// This loops all cells, even if it is not set.
				// By default, only cells that are set will be iterated.
				$cellIterator->setIterateOnlyExistingCells(false);

				foreach ($cellIterator as $key => $cell) {
					// $colIndex = PHPExcel_Cell::columnIndexFromString($cell->getColumn());

					$value = getEmptyAttribute($cell->getValue());
					var_dump($value);

					// Process the items
					if ($headersFound) {
						// Get the name of the column
						$column = (string)array_search($key, $headersPosition);

						// Process each type of column
						switch ($column) {
							case 'Data':
								// Set that as the last categoryID
								$lastDate = convertData($value);
								break;
							case 'Hora':
								$lastHour = $value;
								break;
							case 'Demand':
								$lastDemand = $value;
								break;
							case 'Price':
								$lastPrice = floatval(preg_replace("/^[^0-9\.]/","", preg_replace("/,/",".", $value)));
								break;
							case 'Wind':
								$lastHOEP = $value;
								break;
							case 'Balance':
								$lastBalance = $value;
								break;
							case 'HOEP':
								$lastItemPrice = floatval(preg_replace("/^[^0-9\.]/","", preg_replace("/,/",".", $value)));
								break;
						}

					} else {
						// Try to find the header
						if (array_key_exists((string)$value, $headersPosition)) {
							// If we found it, we update the column index of the given key
							$headersPosition[$value] = $key;

							// Update the list if we have all the proper headers 
							if (array_search(-1, $headersPosition) === FALSE) {
								// Set the boolean
								$headersFound = true;
							}
						}
					}
				}

				// Ended processing the cell, we can write on the 
				if ($headersFound) {

					$timestamp = strtotime($lastDate . " " . ($lastHour - 1) . ":00:00");

					// Write item on database
					$insert = resourceForQuery(
						"INSERT INTO
							`timetable`
							(`date`, `demand`, `price`, `wind`, `balance`, `hoep`)
						VALUES
							(FROM_UNIXTIME($timestamp), $lastDemand, $lastPrice, $lastWind, $lastBalance, $lastHOEP)
					");

					// Decrement the unwritten rows
					$totalRows--;

				}
			}
		}

		// Response code
		if ($totalRows != 0) http_status_code(500);
	}

?>
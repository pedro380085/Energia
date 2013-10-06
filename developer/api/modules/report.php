<?php
// -------------------------------------- RELATÓRIO --------------------------------------- //

	if ($method === "getReport") {

		if (isset ($_GET['hour']) && isset ($_GET['weekDay']) && isset ($_GET['month'])) {

			$hour = getAttribute($_GET['hour']);
			$weekDay = getAttribute($_GET['weekDay']);
			$month = getAttribute($_GET['month']);

			$query = (
				"SELECT
					`timetable`.`id`,
					COUNT(`timetable`.`id`) AS `entries`,
					DATE_FORMAT(`timetable`.`date`, '%m-%Y'),
					ROUND(AVG(`timetable`.`demand`), 3) AS `demand`,
					ROUND(AVG(`timetable`.`price`), 3) AS `price`,
					ROUND(AVG(`timetable`.`wind`), 3) AS `wind`,
					ROUND(AVG(`timetable`.`balance`), 3) AS `balance`,
					ROUND(AVG(`timetable`.`hoep`), 3) AS `hoep`
				FROM
					`timetable`
				WHERE 1
					AND HOUR(`timetable`.`date`) = $hour
					AND DAYOFWEEK(`timetable`.`date`) = $weekDay
					AND MONTH(`timetable`.`date`) = $month
				GROUP BY
					YEAR(`timetable`.`date`) ASC
			");

			$result = resourceForQuery($query);

			$headers = array("Entradas", "Mês-Ano", "Demanda", "Preço", "Vento", "Balanço", "HOEP");

			// Return some data
			if ($format == "json") {
				echo printInformation("timetable", $result, true, "json");
			} elseif ($format == "html") {
				reportListWrap($result, $headers);
			} else {
				http_status_code(405);
			}

		} else {
			http_status_code(400);
		}

	} else 

// ----------------------------------------------------------------------------------- //

	{ http_status_code(501); }

?>
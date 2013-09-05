<?php

/**
 * Wrap all the entries inside a table
 */

function reportTimeWrap($result, $optionTime) {
	?>
	<table>
		<thead>
			<tr>
				<td></td>
				<?php
					if ($optionTime == "H") {
						for ($i = 0; $i < 24; $i++) {
							?><td><b><?php echo $i ?>h</b></td><?php
						}
					} else {
						?><td><b>24h (das 6h às 6h)</b></td><?php
					}
				?>
			</tr>
		</thead>
		<tbody>
			<?php
			$rows = mysql_num_rows($result);

			if ($rows > 0) {
				$firstDay = date("z", mysql_result($result, 0, "timestamp"));
				$timestamp = mysql_result($result, 0, "timestamp");
				$lastDay = date("z", mysql_result($result, $rows - 1, "timestamp"));

				$currentDay = $firstDay;
				$currentRow = 0;
				$masterValue = 0;

				for ($i = 0; $i < ($lastDay - $firstDay + 2); $i++) {

					// Increment the number of days
					if ($i != 0) {
						$currentDay += 1;
						$timestamp += 86400;
					}
				?>
				
				<tr value="<?php if ($currentRow < $rows) { echo mysql_result($result, $currentRow, "id"); } else { echo "0"; } ?>">
					<td <?php if ($optionTime == "D") { ?>class="crop"<?php } ?>>
						<b><?php if ($optionTime == "D") { echo date("j/n", $timestamp - 86400); } else { echo date("j/n", $timestamp); } ?></b>
					</td>
					
					<?php
						
						for ($j = 0; $j < 24; $j++) {
							if ($currentRow < $rows
								&& date("z", mysql_result($result, $currentRow, "timestamp")) == $currentDay 
								&& date("G", mysql_result($result, $currentRow, "timestamp")) == $j) {
								if ($optionTime == "H") {
									?><td class="data"><?php echo mysql_result($result, $currentRow, "value") ?></td><?php
								} else {
									$masterValue += mysql_result($result, $currentRow, "value");
								}
								$currentRow++;
							} else {
								if ($optionTime == "H") {
									?><td>0</td><?php
								}
							}

							if ($optionTime == "D" && $j == 5) {
								if ($masterValue > 0) {
									?><td class="data inner"><?php echo $masterValue ?></td><?php
									$masterValue = 0;
								} else {
									?><td class="data inner">0</td><?php
								}
							}
						}

					?>

				</tr>
				
			<?php
				}
			}	
			?>
		</tbody>
	</table>
	<?php
}

function reportListWrap($result, $headers) {

	if (mysql_num_fields($result) == count($headers) + 1) {
		?>
		<table>
			<thead>
				<tr>
				<?php for ($i = 0; $i < count($headers); $i++) { ?>
					<td><b><?php echo $headers[$i] ?></b></td>
				<?php } ?>
				</tr>
			</thead>
			<tbody>
			<?php for ($i = 0; $i < mysql_num_rows($result); $i++) { ?>
				<tr value="<?php echo mysql_result($result, $i, 0) ?>">
				<?php for ($j = 1; $j < mysql_num_fields($result); $j++) { ?>
					<td><?php echo mysql_result($result, $i, $j) ?></td>
				<?php } ?>
			<?php } ?>
			</tbody>
		</table>
		<?php
	} else {
		http_status_code(500, "Wrong number of collumns");
	}
}

?>
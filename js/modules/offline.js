$(document).ready(function() {

// ------------------------------------- OFFLINE --------------------------------------- //

// -------------------------------------- ORDERS -------------------------------------- //

	/**
	 * Save a specific set of orders into the user local storage
	 * @return {null}
	 */
	$(window).live("offlineOrders", function(event, tableID) {

		// Save the orders
		$.post('ajaxMap.php',
		{	
			getDataForTable: tableID,
			shouldBeValid: false
		}, // And we print it on the screen
		function(data) {
			// Append the content
			if (data.length > 0) {
				// Save the orders on our database
				// localStorage.setItem("table" + tableID, JSON.stringify(data));
				localStorage.setItem("table/" + tableID, data);
			}
		}, 'html');

	});

});
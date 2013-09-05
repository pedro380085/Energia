$(document).ready(function() {

// ------------------------------------- NOTIFICATION ---------------------------------- //

	(function checking() {
		if ($(".accountType").length != 0) checkNotifications();
		
		setTimeout(checking, 5000); // 5s
	})();
	
	function checkNotifications() {

		$.post('ajax.php', {
			checkNotifications: "checkNotifications"
		}, function(data, textStatus, jqXHR) {
			processNotification(data);
		}, 'html');
		
	}
	
	function processNotification(jsonData) {
	
		// First we parse the JSON object that we received
		try {
			var jsonReturn = JSON.parse(jsonData);
		} catch (Exception) {
			console.log("Couldn't parse JSON");
			return 0;
		}

		// A element to parse html entities 
		var $p = $(document.createElement("p"));
		
		// Then we loop to see if we have any data
		for (var i = 0; i < jsonReturn.data.length; i++) {
			var data = jsonReturn.data[i];
			var showNotification = true;

			// Store the last notification on permanent storage
			var lastNotificationID = parseInt(readCookie("lastNotificationID")) || 0;
			if (data.id > lastNotificationID) createCookie("lastNotificationID", data.id, 10);

			// We must know if what requisition we are dealing with
			if (data.constant == "order/new") {

				// The order item for the current table id
				var $orderItem = $(".orderItem[value = \"" + data.tableID + "\"]");
				// The corresponding table item for the current grouped orders
				var $tableEquivalent = $(".table[value = \"" + data.tableID + "\"]");

				// See if the notification has already been delivered
				if ($orderItem.length != 0) {

					// Update the color of the order table
					$orderItem.find(".tableIcon").attr("src", $tableEquivalent.find(".tableIcon").attr("src"));

					// Save the orders offline
					$(window).trigger("offlineOrders", [data.tableID]);

					// Push to the top
					$orderItem.prependTo($orderItem.parent());

				} else {

					// Clone the orderItem
					$orderItem = $(".orderItemInvisible").eq(0).clone();

					// Set all the necessary data
					$orderItem.attr("data-orderid", data.orderID);
					$orderItem.attr("data-number", data.tableNumber).find(".tableNumber").text(data.tableNumber);

					// Hide all the items which doesn't have a valid table yet
					if ($tableEquivalent.attr("data-valid") == "0") $orderItem.css("display", "none");

					// Append it to the box with a little animation
					$orderItem
						.removeClass("orderItemInvisible")
						.val(data.tableID)
						.find(".tableIcon").attr("src", $tableEquivalent.find(".tableIcon").attr("src"));
					$(".orderBox ul").prepend($orderItem);
				}

				// Print the order
				$(".mapContent").trigger("printOrder", [data.orderID]);

				// Save the orders offline
				$(window).trigger("offlineOrders", [data.tableID]);

				var $allOrders = $orderItem.find(".orderInfo .allOrders span");
				$allOrders.html(parseInt($allOrders.text(), 10) + 1);

				var $sentOrders = $orderItem.find(".orderInfo .sentOrders span");
				$sentOrders.html(parseInt($sentOrders.text(), 10) + 1);

			} else if (data.constant == "order/update") {

				// The order item for the current table id
				var $orderItem = $(".orderItem[value = \"" + data.tableID + "\"]");
			
				// Save the orders offline
				$(window).trigger("offlineOrders", [data.tableID]);

				var $sentOrders = $orderItem.find(".orderInfo .sentOrders span");
				var sentOrders = parseInt($sentOrders.text(), 10);
				$sentOrders.html((sentOrders - 1 >= 0) ? (sentOrders - 1) : 0);

			} else if (data.constant == "table/request/validate") {
				// Locate the table and set the proper attributes
				var $theTable = $(".table[value = \"" + data.tableID + "\"]").attr("data-occupied", "1").attr("data-valid", "0");
				$theTable.add(".orderItem[value = \"" + data.tableID + "\"]").find(".tableIcon").attr("src", "images/288-table_yellow.png");

			} else if (data.constant == "table/request/close") {
				// Locate the table and set the proper attributes
				var $theTable = $(".table[value = \"" + data.tableID + "\"]").attr("data-check", "1");
				$theTable.add(".orderItem[value = \"" + data.tableID + "\"]").find(".tableIcon").attr("src", "images/288-table_red.png");

				// Remove the orders from our localStorage
				localStorage.removeItem("table/" + data.tableID);

			} else if (data.constant == "table/request/waiter") {
				// Locate the table and load the egret
				var $theTable = $(".table[value = \"" + data.tableID + "\"]");

				if ($theTable.attr("data-valid") == "1") {
					$theTable.attr("data-waiter", "1");
					$theTable.find(".egretWaiter").addClass("egretWaiterSelected");
				}

			} else if (data.constant == "table/confirmation/validate") {
				// Locate the table and set the proper attributes
				var $theTable = $(".table[value = \"" + data.tableID + "\"]").attr("data-occupied", "1").attr("data-valid", "1");
				$theTable.add(".orderItem[value = \"" + data.tableID + "\"]").find(".tableIcon").attr("src", "images/288-table_green.png");

			} else if (data.constant == "table/confirmation/close") {
				// Locate the table and set the proper attributes
				var $theTable = $(".table[value = \"" + data.tableID + "\"]").attr("data-occupied", "0").attr("data-valid", "0").attr("data-check", "0");
				$theTable.add(".orderItem[value = \"" + data.tableID + "\"]").find(".tableIcon").attr("src", "images/288-table_gray.png");

				// Remove the orders from our localStorage
				localStorage.removeItem("table/" + data.tableID);

			} else if (data.constant == "table/confirmation/waiter") {
				// Locate the table and remove the egret
				var $theTable = $(".table[value = \"" + data.tableID + "\"]").attr("data-waiter", "0");
				$theTable.find(".egretWaiter").removeClass("egretWaiterSelected");
			}		
		
			// Only notify if the item wasn't a new order
			if (data.constant != "order/new" || showNotification == true) {

				// Reload the current opened table if necessary
				if ($(".tableMenuWrapper").attr("data-value") == data.tableID) {
					$(".table[value = \"" + data.tableID + "\"]").find(".tableImage").trigger("click");
				}

				// Create the container to deliver the message
				var $item = $("<li></li>").clone();
				$item.val(data.id).addClass("unseenNotification").html($p.text(data.message).text());
				
				// Open the box and then prepend the content to it
				$(".notificationBox").show().find("ul").prepend($item);
				
				// Show the info, wait for a while and then fade it out
				(function($item) {
					return (function() {
						$item.fadeIn(200).delay(8000).fadeOut(3000, function() {
							moveNotificationFromBoxToCenter($item);
						});
					})();
				})($item);
			}
		}

		// Delete the object
		delete jsonData;
	}

	function moveNotificationFromBoxToCenter($item) {
		// So first we remove it from the bottom
		$item.remove();
		
		// And we see if there is any notification left, otherwise, we just fade the box
		if ($(".notificationBox li").length == 0) {
			$(".notificationBox").hide();
		}
	}
	
	$(".notificationsBottom .notificationLoadExtra").live("click", function () {
		var $ref = $(this);
		var $sibling = $(this).parents(".notificationsBottom").siblings(".notificationsContent");
		var notificationLoaded = $sibling.find("li").length;
		
		$.post('ajax.php',
		{
			notificationLoadExtra: "notificationLoadExtra",
			value: notificationLoaded
		},
		function(data) {
			processUserNotifications(data, false);
			
			// If the bucket came empty, we inform the user about it
			if (!data.data) {
				$ref.text("Todas as notificações foram carregadas.");
				$(".notifications").mCustomScrollbar("update");
			}
		});
	});

});

$(document).ready(function() {

// --------------------------------------- REPORT --------------------------------------- //

	/**
	 * Page initialization
	 * @return {null}
	 */
	$(".reportContent").live("hashDidLoad", function() {

		// Load the first box
		$(this).find(".reportCategory:first-child").trigger("click");

		// Make the select beautiful
		$(this).find("select").chosen({
			width: "50%",
			disable_search_threshold: 100
		});

	});

// --------------------------------------- MENU --------------------------------------- //
// 
	$(".reportContent .toolInformation").live("click", function () {

		var $optionsBox = $(".toolBoxOptionsInformation").slideToggle(400, function() {
			$(".menuContent ~ .pageContentBox").css("top", $(".menuContent").height() + "px");
		});
	});	

	$(".reportContent .reportCategory, .reportContent .reportOptionItem").live("click", function() {
		$(".reportContent").trigger("updateReport");
	});

	$(".reportContent .reportOption select").live("change", function() {
		$(".reportContent").trigger("updateReport");
	});

	$(".reportContent").live("updateReport", function() {

		// Get the parent
		var $pageContent = $(this).find(".pageContentBox");

		// Find each value inside the box
		var hour = $pageContent.find(".hour select").val();
		var weekDay = $pageContent.find(".weekDay select").val();
		var month = $pageContent.find(".month select").val();

		// We send the data to the server
		$.post('developer/api/?' + $.param({
			method: "report.getReport",
			hour: hour,
			weekDay: weekDay,
			month: month,
			format: "html"
		}), {},
		function(data) {

			var $detailBox = $pageContent.siblings(".detailBox");
			
			$detailBox.html(data);

			var colorMap = "heatmap";
			var painter = "bars";

			$detailBox.find("td.data").graphup({
				// Define any options here
				colorMap: colorMap,
				painter: painter,
				bubblesDiameter: 100 // px
			});

		}, 'html');

	});

// -------------------------------------- RECEIPT -------------------------------------- //

	/**
	 * Print a receipt
	 * @return {null}
	 */
	$(".reportContent .toolPrint").live("click", function(event) {
		window.print();
	});

});
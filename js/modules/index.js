$(document).ready(function() {
	
// -------------------------------------- HOME -------------------------------------- //

	/**
	 * Change the current item on the show stand
	 * @return {null}
	 */
	$(".homeContent .coolMenu > li").live("click", function(event) {
		// Remove the selection
		$(this).siblings(".coolMenuItemSelected").removeClass("coolMenuItemSelected").end().addClass("coolMenuItemSelected");

		// Animate the change on the show stand
		var $coolShow = $(this).parent(".coolMenu").siblings(".coolShow");
		$coolShow.find(".coolShowItemSelected").	removeClass("coolShowItemSelected").end().children().eq($(this).index()).addClass("coolShowItemSelected");
	});

});

// We must put it on the global scope so it can be called from a external function

// Cool Show
function coolShowAnimation() {
	var $coolShow = $(".homeContent .sectionCarte .coolShow");

	// Check for its existance
	if ($coolShow.length != 0) {

		var index = $coolShow.find(".coolShowItemSelected").index() + 1;

		// See if we have reached the bounds
		if (index >= $coolShow.children().length) index = 0;

		$coolShow.find(".coolShowItemSelected").removeClass("coolShowItemSelected").end().children().eq(index).addClass("coolShowItemSelected");
		
		setTimeout(coolShowAnimation, 4000); // 5s
	}
}
$(document).ready(function() {

// -------------------------------------- WINDOW -------------------------------------- //

	/**
	 * Callback for windows and popovers dismissal
	 * @return {null}       
	 */
	$("body").live("click", function () {

		// Only trigger the change if there is an activePopover
		if ($(this).data("activePopover")) {

			if (typeof $(this).data("activePopover") === 'function') {
				var f = $(this).data("activePopover");
				f.call($(".activePopover"));
			}
			$(".activePopover").removeClass("activePopover").slideUp(100);

			// Remove the boolean
			$(this).data("activePopover", false);
		}

		// Only trigger the change if there is an activeField
		if ($(this).data("activeField") == true) {
			// Trigger any instantSave component and then remove the field
			var $components = $(".activeField").removeClass("activeField").filter(".instantSave").pn("instantSave").end();

			// Remove the components
			$components.filter("input, textarea").field("removeField");
			$components.filter("select").attr("disabled", true).trigger("liszt:updated");

			// Deselect the current table
			$(".tableImageSelected").removeClass("tableImageSelected");

			// Remove the boolean
			$(this).data("activeField", false);
		}

	});

	/**
	 * Calculate the position and scroll the menuContent every time the human slides the screen
	 * @return {null}       
	 */
	$(window).scroll(function (event) {
		// What the y position of the scroll is
		$(".menuContent").trigger("scrollIt", [$(this).scrollTop()]);
	});

	/**
	 * Callback for toggling the state of the loadingBox
	 * @return {null}       
	 */
	$(".loadingBox").bind("ajaxSend", function(event, jqxhr, settings) {
		if (settings.url != "ajax.php") $(this).show();	
	}).bind("ajaxComplete", function() {
		$(this).hide();
	});

	/**
	 * Callback for toggling the state of the loadingBox
	 * @return {null}       
	 */
	$(".errorBox").bind("ajaxError", function(event, jqXHR, settings) {
		if (jqXHR.status != 408) {
			$(this).fadeToggle(200).delay(6000).fadeToggle(2000);
		}
	})

	/**
	 * Define the height of the menuContent
	 * @return {null}       
	 */
	$(".menuContent").live("calculateTop", function(event, jqXHR, settings) {
		var $menuContent = $(this);
		if ($menuContent.length != 0) {
			var offset = $menuContent.offset().top;
			var menuHeight = $menuContent.height();
			var marginTop = parseFloat($menuContent.css('marginTop').replace(/auto/, 0));
			var barHeight = $('.barWrapper').height();
			$menuContent.data("top", offset - marginTop - barHeight);
		}
	});

	/**
	 * Update the size of the bar on scroll
	 * @return {null}       
	 */
	$(".menuContent").live("scrollIt", function(event, y) {

		var $menuContent = $(this);
		var top = $menuContent.data("top");

		// whether that's below the form
		if (y >= top) {
			// if so, ad the fixed class
			$menuContent.closest(".boardContent").addClass('fixed');
		} else {
			// otherwise remove it
			$menuContent.closest(".boardContent").removeClass('fixed');
		}

		// Resize the bar
		$menuContent.width($menuContent.parent().width() - $menuContent.css("padding-left").replace("px", "") - $menuContent.css("padding-right").replace("px", ""));
	});

	/**
	 * Update the tips for every content load
	 * @return {null}       
	 */
	$(document).bind("ajaxComplete", function(event, jqXHR, settings) {
		// Tips
		$("[title != '']").qtip({
		    style: {
		    	classes: 'qtip-light qtip-rounded qtip-shadow'
		    },
		    position: {
		        my: 'top left',
		        at: 'center center',
		        target: "event" // my target
		    }
		});
	});

});
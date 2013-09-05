$(document).ready(function() {

// -------------------------------------- TOOLS -------------------------------------- //

	/**
	 * Animation when the user hovers one of the tools
	 * @return {null}       
	 */
	// $(".toolBox img").live("mouseenter", function () {	

	// 	var $image = $(this);

	// 	// First we are going to check if the wrapper has already been placed
	// 	if (!($(this).parent().hasClass("toolWrapper"))) {
	// 		// We are going to create our wrapper 
	// 		var $wrapper = $(document.createElement("div")).addClass("toolWrapper").addClass($(this).attr("class"));

	// 		// Then we can use it to wrap our image
	// 		// The parent() method is used to return a reference to the wrapper, since JS sucks and just loses the reference to it!
	// 		$wrapper = $(this).wrap($wrapper).parent();

	// 		// Make sure that the previous animations have been completed
	// 		$wrapper.siblings(".spanActive").remove();

	// 		// We create a label so we can write the image title
	// 		$wrapper.prepend(document.createElement("span"));

	// 		// Then we calculate the width of the span, already setting the title
	// 		var width = $wrapper.find("span").addClass("spanActive").text($image.attr("title")).width();

	// 		// We wait for the CSS complete its transition
	// 		// setTimeout(function() {
	// 		// 	// Then we calculate the width of the span, already setting the title
	// 		// 	$wrapper.find("span").text($image.attr("title")).addClass("spanActive");	
	// 		// }, 150);

	// 		// And then we animate it
	// 		$wrapper.find(".spanActive")
	// 			.width(0) // Zeroed
	// 			.show() // Show it
	// 			.css("display", "inline") // Display mode
	// 			.animate({
	// 				width: width
	// 			}, 400);
			    
	// 	}
		
	// });

	// /**
	//  * Animation when the user exit the tool wrapper
	//  * @return {null}       
	//  */
	// $(".toolBox .toolWrapper").live("mouseleave", function () {	
	// 	// Get the image (will be the only thing left)
	// 	$image = $(this).find("img");

	// 	// Unwrap
	// 	$image.unwrap();

	// 	// We wait for the CSS complete its transition
	// 	// setTimeout(function() {
	// 	// 	$image.unwrap();
	// 	// 	$image.siblings("span").remove();
	// 	// }, 150);

	// 	// And then we animate it
	// 	$image.siblings(".spanActive")
	// 		.stop(true, true) // Stop any ongoing animation
	// 		.animate({
	// 			width: 0
	// 		}, 300, function() {
	// 			$image.siblings(".spanActive").remove(); // Delete the label
	// 		});

	// });

	/**
	  * FAVORITE TOOL
	  */

	/**
	 * Tool to favorite a carte
	 * @return {null}       
	 */
	$(".toolFavorite").live("click", function () {	
		
		// We must stop the bubble
		event.stopPropagation();
	
		$image = $(this).find("img");

		// Check if we DON'T have the parent (probably no)
		if ($(this).is("img")) {
			return;
		}

		// Toggle the image
		if ($image.hasClass("favorite")) {
		    $image.attr('src', 'images/32-Unfavorite.png');
		} else {
			$image.attr('src', 'images/32-Favorite.png');
		}

		// A little animation to give the impression the user has put some pressure on the click (it's really cool)
		$image.toggleClass("favorite") // Toggle the class
			.width($image.width() * 1.25) // Set the width a little bigger
			.animate({
				"width": $image.width() / 1.25 // And then default it
			}, 100);
	});

	/**
	  * FULLSCREEN TOOL
	  */

	/**
	 * Go fullscreen
	 * @return {null}
	 */
	$(".toolBox .toolFull").live("click", function() {

		// Get the pageContent
		var $pageContent = $(this).parents(".pageContent").toggleClass("fullscreen");

		var speed = ($pageContent.find(".boardContent").hasClass("fixed")) ? 300 : 0;

		$('html, body').animate({ scrollTop: 0 }, speed, function() {

			// Set the width to autos
			$pageContent.find(".menuContent").css("width", "100%");

			if ($pageContent.hasClass("fullscreen")) {
				$("#header").hide(600);

				$pageContent.children(".titleContent").hide(600);

				$("#content").animate({
					"top": 0,
				}, 600, function() {
					$pageContent.animate({
						"width": "90%",
					}, 600, function() {
						$pageContent.find(".pageContentItem:visible").not(".pageContentItemExtra").pn("equalHeights");
						$pageContent.find(".menuContent").trigger("calculateTop");
					});

					$("#wrapper .coolMenu").hide(0);
				});
			} else {
				$pageContent.animate({
					"width": "960px",
				}, 600);

				$("#content").animate({
					"top": "-145px",
				}, 600);

				$pageContent.children(".titleContent").show(600);

				$("#header").show(600, function() {
					$pageContent.find(".pageContentItem:visible").not(".pageContentItemExtra").pn("equalHeights");
					$pageContent.find(".menuContent").trigger("calculateTop");
				});

				$("#wrapper .coolMenu").show(0);
			}
		});
	});

	/**
	 * Edit tool has been clicked (or the done button)
	 * @return {null}
	 */
	$(".toolBox .toolPreferences, .toolBox .toolDone").live("click", function() {

		// Get the pageContentBox
		var $pageContentBox = $(".pageContentBox").toggleClass("editingMode");
		var $pageContentSector = $(".pageContentSector:visible");
		var level = $pageContentSector.index();

		// Hide any options box
		$(".toolBoxOptions").slideUp(300);

		// Sanitize the data
		if (isNaN(parseFloat(level)) || !isFinite(level) || level < 0) level = 0;

		// PREFERENCES TOOL
		if ($pageContentBox.hasClass("editingMode")) {
			$(".toolBox > div:eq("+level+") div")
				.not(".editingToolBox, .toolBoxBreadcrumb")
				.slideToggle(300)
				.end()
				.filter(".editingToolBox")
				.delay(300)
				.slideToggle(300, function() {
					$pageContentBox.find(".pageContentItem:visible").not(".pageContentItemExtra").pn("equalHeights");

					$pageContentSector
						.sortable({
							connectWith: ".pageContentSector:visible",
							tolerance: "intersect",
							cancel: ".pageContentItemExtra",
							revert: true
						});
				});
		
		// DONE TOOL
		} else {
			// Hide the items and show others
			$(".toolBox > div:eq("+level+") div")
				.filter(".editingToolBox")
				.slideToggle(300)
				.end()
				.not(".editingToolBox, .toolBoxBreadcrumb")
				.delay(300)
				.slideToggle(300, function() {
					$pageContentBox.find(".pageContentItem:visible").not(".pageContentItemExtra").pn("equalHeights");
				});

			// Make sure that all classes are deselected and that the special itemExtra is hidden
			$pageContentSector.find(".pageContentItemSelected").toggleClass("pageContentItemSelected");
			$pageContentSector.find(".pageContentItemExtra").hide();
		}
		
	});

	/**
	 * User wants to navigate between levels
	 * @return {null}
	 */
	$(".toolBox .toolBack, .pageContentBox .pageContentSector").live("click", function(event) {

		// Get the pageContentBox
		var $pageContentBox = $(".pageContentBox");

		// Check if it's editing OR animating OR is clicking on a carteItem (we shouldn't animate these)
		if (!$pageContentBox.hasClass("editingMode") &&
			!($pageContentBox.attr("data-lock") == "yes") &&
			!($pageContentBox.children(".carteItems").is(":visible") && $(this).hasClass("pageContentSector"))) {

			// Lock the page
			$pageContentBox.attr("data-lock", "yes");

			// -------------------------------
			// CONTENT
			// -------------------------------

			// Some variables
			var destiny = $(this).parents(".boardContent").attr("data-ajax");

			// The containerList seeks the element that WILL BE loaded, so we must know where we are going
			if ($(this).hasClass("pageContentSector")) {
				var $containerList = $(".pageContentSector:visible").next();
			} else {
				var $containerList = $(".pageContentSector:visible").prev();
			}

			// Clean the containerList
			$containerList.html("");

			// We get the parentID (the one that is responsible for all the items that are going to be loaded)
			if ($containerList.index() == 0) {
			    var parentID = 0;
			} else {
				var parentID = $containerList.siblings().eq($containerList.index() - 1).find(".pageContentItemSelected").val();
			}

			// Update the title of the next controller
			var breadCrumb = $(".toolBoxBreadcrumb");
			breadCrumb.eq(breadCrumb.index(breadCrumb.filter(":visible")) + 1).find("p").text($(".pageContentItemSelected:visible").find(".title").text());

			// We load these items
			$.post(destiny + '.php',
			{	
				loadSomething: $containerList.attr("class"),
				parentID: parentID,
			}, // And we print it on the screen
			function(data) {
				$containerList.html(data).find(".pageContentItem:visible").not(".pageContentItemExtra").pn("equalHeights");
			}, 'html' );

			// -------------------------------
			// ANIMATION
			// -------------------------------
		
			// Then we can start to calculate the transition
			var level = $(".pageContentSector:visible").index();

			// Sanitize the attr
			if (isNaN(parseFloat(level)) || !isFinite(level) || level < 0) level = 0;

			// We don't load anything on the deepness of the navigation system
			if ($(this).hasClass("pageContentSector")) {
				if ($pageContentBox.find(".pageContentSector").size() - 1 == level) {
				    return;
				} else {
					level++;
				}
			} else {
				level--;
			}

			// Animate the tool change
			$(".toolBox > div").not(":eq("+level+")").slideUp(300).end().eq(level).delay(300).slideDown(300);

			// Animate the content change
			$(".pageContentSector").not(":eq("+level+")").fadeOut(300).end().eq(level).delay(300).fadeIn(300, function() {
				$pageContentBox.attr("data-lock", "no");
				$containerList.find(".pageContentItem:visible").not(".pageContentItemExtra").pn("equalHeights");
			});
		}
	});


	/**
	 * Mini Tool!
	 */
	
	/**
	 * Edit a box that has miniTool components
	 * @return {null}
	 */
	$(".miniTool.edit").live("click", function(event) {
		// Stop event propagation
		event.stopPropagation();

		// Tag the input and notify the document
		var $awesomeBox = $(this).closest(".awesomeBox");

		// See if the field has already
		if ($awesomeBox.find(".activeField").length == 0) {
			$awesomeBox.pn("saveForm").find("input, textarea, select").addClass("activeField").first().focus().select();
			$("body").data("activeField", true);
		} else {
			$("body").trigger("click");
		}
	});

	/**
	 * Remove a box that has miniTool components
	 * @return {null}
	 */
	$(".miniTool.remove").live("click", function(event) {

		// Now we just have to notify our server
		var destiny = $(this).parents(".boardContent").data("ajax");

		// CLASS SELECTOR
		var $exclusiveAwesomeBox = $(this).closest(".awesomeBox[data-deleteparent!='yes']"); // I know, complicated right? :)

		if ($exclusiveAwesomeBox.hasClass("line")) {
			// CHILD ID
			var childID = $exclusiveAwesomeBox.attr("data-value");

		} if ($exclusiveAwesomeBox.hasClass("option")) {
			// CHILD ID
			var childID = $exclusiveAwesomeBox.val();

			// PARENT ID
			var parentID = $(this).parents(".pageContentItem").val();

		} else if ($exclusiveAwesomeBox.hasClass("optionItem")) {
			// CHILD ID
			var childID = $exclusiveAwesomeBox.val();

			// PARENT ID
			var parentID = $(this).parents(".option").val();
		}

		// When we find it, we can just delete
		$exclusiveAwesomeBox.remove();

		// SHIP 'EM ALL!
		$.post(destiny + '.php',
		{	
			itemDetail: $exclusiveAwesomeBox.attr("class"),
			action: "remove",
			parentID: parentID,
			childID: childID,
		}, // And we print it on the screen
		function(data) {
			if (!isFinite(parseInt(data))) {
				$(".errorBox").fadeIn(200);
			}
		}, 'html' );

	});

	/**
	 * Save the box with miniTool components
	 * @return {null}
	 */
	$(".awesomeBox input").live("keyup", function(event) {
		
		 var code = (event.keyCode ? event.keyCode : event.which);
		 // Enter keycode
		 if (code == 13) {
		 	// Trigger click outside the view as a dismissal
		 	$("body").trigger("click");
		 }
	});

	/**
	 * AwesomeBox input field must not propagate its events!
	 * @return {null}
	 */
	$(".awesomeBox input, .awesomeBox textarea, .awesomeBox .chzn-container").live("click", function(event) {
		event.stopPropagation();
	});

});
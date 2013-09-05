$(document).ready(function() {

// ------------------------------------- LOADERS ------------------------------------- //

	/**
	 * Remove date picker reference
	 */
	$(".ui-datepicker a").live("click", function() {
		$(this).removeAttr("href"); 
	});

	/**
	 * Make sure that the hash is set
	 */
	$(window).ajax("hashConfigureSource", window.location.hash);

	/**
	 * Swap the cache
	 */
	// window.applicationCache.addEventListener("updateready", function() {
	// 	alert(JSON.stringify(localStorage).length);
	// 	window.applicationCache.swapCache();
	// });
	window.applicationCache.addEventListener('updateready', function(e) {
		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			window.applicationCache.swapCache();
			// alert(JSON.stringify(localStorage).length);
		} else {
	      // Manifest didn't changed. Nothing new to server.
	    }
	}, false);
	
});
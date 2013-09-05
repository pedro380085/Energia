// ------------------------------------- PN MODULE ------------------------------------- //

$.fn.pn = function(method) {

	var telephoneInput = "";

	var methods = {
		/**
		 * Verification for brazilian telephones, including the ones within São Paulo
		 * @return {null}
		 */
		telephoneVerification: function() {

			// We apply the mask and see if the user is in São Paulo, where the phone may have 9 digits
			this.mask("(99) 9999-9999")
			.keyup(function () {
					var beginning = $(this).val().substring(0, 6);
					if ((beginning == "(11) 6" || beginning == "(11) 7" || beginning == "(11) 8" || beginning == "(11) 9") && $(this).parent().find(".infoContainerFieldContentSub").size() == 0) {
						$(this).parent().append("<br><span class='infoContainerFieldContentSub'>O prefixo 9 será adicionado automaticamente.</span>");
					}
			}).blur(function () {
				telephoneInput = $(this).val();
				$(this).parent().find(".infoContainerFieldContentSub").text("");
				
				var beginning = $(this).val().substring(0, 6);
				if (beginning == "(11) 6" || beginning == "(11) 7" || beginning == "(11) 8" || beginning == "(11) 9") {
					$(this).val($(this).val().replace(/\(11\)\ /g,"(11) 9"));
				}
			}).focus(function () {
				if (telephoneInput.length = 15) {
					$(this).val(telephoneInput);
				}
			});

			return this;
		},

		/**
		 * Verification for dates, adopting the standard brazilian format
		 * @return {null}
		 */
		dateVerification: function() {

			// We apply a mask, so the user recognize the date format and we also apply a GUI picker
			this.mask("99/99/9999")
			.datepicker( {
				"dateFormat": "dd/mm/yy"
			});

			return this;

		},

		/**
		 * Create a map, a marker and a default location
		 * @param  {google.maps.LatLng} deadLocation 	The default location
		 * @param  {oject}				mapOptions    	Options for the map
		 * @param  {object}				markerOptions	Options for the marker
		 * @return {object} 			locationData 	Information
		 */
		geoMap: function(deadLocation, mapOptions, markerOptions) {

			// Allocate an object
			var locationData = {};

			try {
				// Case the user didn't send a default location
				if (typeof deadLocation !== "object") {
					locationData.deadLocation = new google.maps.LatLng(-23.5489433, -46.6388182); // SP
				}

				if (typeof mapOptions !== "object") {
					mapOptions = {
						zoom: 16,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
				}

				locationData.map = new google.maps.Map(this[0], mapOptions);

				if (typeof markerOptions !== "object") {
					markerOptions = {
						map: locationData.map,
						animation: google.maps.Animation.DROP,
						draggable: true
					};
				}

				locationData.marker = new google.maps.Marker(markerOptions);

			} catch (Exception) {
				console.log("Map could not be loaded");
			}

			return locationData;
		},

		/**
		 * Geocoder the user for a certain address
		 * @param  {string} 			text          The address
		 * @param  {google.maps.LatLng} deadLocation  The default location
		 * @param  {object}				mapOptions    Options for the map
		 * @param  {object} 			markerOptions Options for the marker
		 * @return {object} 			locationData  Information
		 */
		geocoder: function(text, deadLocation, mapOptions, markerOptions) {
			
			var locationData = this.pn("geoMap", deadLocation, mapOptions, markerOptions);
			
			locationData.geocoder = new google.maps.Geocoder();

			locationData.geocoder.geocode(
				{'address': text}, 
				function(results, status) { 
					if (status == google.maps.GeocoderStatus.OK) { 
						var loc = results[0].geometry.location;
						locationData.map.setCenter(loc);
						locationData.marker.setPosition(loc);
		            }  else {
		            	// Case not, we default it to São Paulo
		            	locationData.marker.setPosition(locationData.deadLocation);
		            	locationData.map.setCenter(locationData.deadLocation); 
		            }
		        }
			);

			return locationData;
		},

		/**
		 * Geolocate the user based on his actual location
		 * @param  {object} 			locationData  	Information
		 * @param  {google.maps.LatLng} deadLocation  	The default location
		 * @param  {object} 			mapOptions   	Options for the map
		 * @param  {object} 			markerOptions 	Options for the marker
		 * @return {object} 			locationData  	Information
		 */
		geolocate: function(locationData, deadLocation, mapOptions, markerOptions) {

			var locationData = this.pn("geoMap", deadLocation, mapOptions, markerOptions);

			// Geolocation is not so accurate, so we must zoom it out a bit
			locationData.map.setZoom(10);

			// Try W3C Geolocation (Preferred)
			if (navigator.geolocation) {
			  	navigator.geolocation.getCurrentPosition(function(position) {
			  		// We get the geocoderd position and define it as our center
			  		initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			  		locationData.marker.setPosition(initialLocation);
			  		locationData.map.setCenter(initialLocation);
			  	}, function() {
			  		handleNoGeolocation();
			  	});
			// Browser doesn't support Geolocation
			} else {
				browserSupportFlag = false;
				handleNoGeolocation();
			}

			function handleNoGeolocation(errorFlag) {
				locationData.map.setCenter(locationData.deadLocation);
			}

			return locationData;
		},

		/**
		 * Siblings div's will have the same size
		 * @return {null	}
		 */
		equalHeights: function() {
			var height = 0;

			// Me need to know how many div's we can fit in a row
			// var cols = Math.floor($(this).filter(":visible").parent().width() * 1.01 / $(this).filter(":visible").width()); // 1% error on precision

			var $visible = this.filter(":visible");

			// Make sure that we fill at least one row
			// if ($visible.size() < cols)
			var cols = $visible.size();

			// We must check if the div is hidden
			$visible.each(function (index) {

				if (index % cols == 0) {

					// And we reset the height for after comparisons
					height = 0;

					// We compare all the following collumns to find the right height
					for (var i = 0; i < cols; i++) {
						// We find all the visible siblings and capture their heights (the auto preposition is to allow the box to show its real size)
						var tempHeight = $visible.eq(index + i).css("height", "auto").height();

						// Now we can compare the heights and see which one is tallest
						height = (tempHeight > height) ? tempHeight : height;
					};

					$(this).height(height - ($(this).outerHeight() - $(this).height()));

				} else {
				
					// Then we get the two siblings and explicit set their heights
					$(this).height(height - ($(this).outerHeight() - $(this).height()));
				}
			});

			return this;
		},

		/**
		 * Get the tableMap and serialize it
		 * @return {null	}
		 */
		serializeMap: function() {
			
			var mapData = [];

			this.find(".table:not(.tableInvisible)").each(function (index) {

				var tableData = {};

				// Get the attributes
				tableData["id"] = $(this).val();
				tableData["number"] = $(this).find(".tableNumber").text();
				tableData["col"] = $(this).attr("data-col");
				tableData["row"] = $(this).attr("data-row");
				tableData["width"] = $(this).attr("data-sizex");
				tableData["height"] = $(this).attr("data-sizey");
				tableData["active"] = ($(this).hasClass("tableDeactivated")) ? 0 : 1;

				// Save the data on the array
				mapData.push(tableData);
			});

			return mapData;
		},

		/**
		 * Do the tough work to toggle between edit modes
		 * From now one, the caller is going to identify up to where the search can go
		 * @return {null	}
		 */
		saveForm: function(singleLevel) {

			// The caller is responsible for providing the right container
		
			// If the caller decided to go only on a singleLevel, we must create a string to filter this clause
			if (singleLevel) {
			    var limiter = "> ";
			} else {
				var limiter = "";
			}

			if ($(".pageContentBox").hasClass("editingMode")) {

				// So we have to loop through all elements on the form
				// First we go with the input
				this.find(limiter + ".infoContainerInputContent[type!='password']").field("createField", "input", {"type": "text"});
				this.find(limiter + ".infoContainerInputContent[type='password']").text("").field("createField", "input", {"type": "password"});
				this.find(limiter + ".infoContainerTextAreaContent").field("createField", "textarea", {"resize": "none"});
				this.find(limiter + ".infoContainerInputContent[name='price']").priceFormat({prefix: '', centsSeparator: '.', thousandsSeparator: ''});
				this.find(limiter + ".infoContainerInputContent[name='delta']").priceFormat({prefix: '', centsSeparator: '.', thousandsSeparator: ''});
				this.find(limiter + ".infoContainerInputContent[name='cpf']").mask("999.999.999-99");

				// And finally we load the necessary components
				this.find(limiter + ".infoContainerInputContent[name='telephone']").pn("telephoneVerification");
				this.find(limiter + ".infoContainerInputContent[name='birthday'], .infoContainerInputContent[name='historyDate']").pn("dateVerification");
				this.find(limiter + ".infoContainerSelectContent").attr("disabled", false).trigger("liszt:updated");

				this.find(limiter + ".infoContainerSave").css("display", "inline-block").show();
				this.find(limiter + ".infoContainerDelete").css("display", "inline-block").show();
				
			}

			return this;
		},

		/**
		 * Awesome way to save things using our instant save!
		 * @return {null}
		 */
		instantSave: function() {

			this.each(function () {
				var destiny = $(this).parents(".boardContent").data("ajax");

				// CLASS SELECTOR
				var $exclusiveAwesomeBox = $(this).closest(".awesomeBox[data-deleteparent!='yes']"); // I know, complicated right? :)

				if ($exclusiveAwesomeBox.hasClass("line")) {
					var itemDetail = "line";

					var childID = $exclusiveAwesomeBox.attr("data-value");

				} else if ($exclusiveAwesomeBox.hasClass("option")) {
					var itemDetail = "option";

					// CHILD ID
					var childID = $exclusiveAwesomeBox.val();

					// PARENT ID
					var parentID = $(this).parents(".pageContentItem").val();

				} else if ($exclusiveAwesomeBox.hasClass("optionItem")) {
					var itemDetail = "optionItem";

					// CHILD ID
					var childID = $exclusiveAwesomeBox.val();

					// PARENT ID
					var parentID = $(this).parents(".option").val();

				} else {
					var $containerList = $(this).parents(".pageContentSector");

					// CHILD ID
					var childID = $(this).parents(".pageContentItem").val();

					// PARENT ID
					var parentID = ($containerList.index() != 0) ? $containerList.siblings().eq($containerList.index() - 1).find(".pageContentItemSelected").val() : 0;
				}

				// FIELD VALUE
				// Make a typecast and see if the value has been correctly captured
				if ($(this).is("img")) {
				    var fieldValue = $(this).attr("data-value");
				} else {
					var fieldValue = $(this).val();
				}

				// OPTIONAL VALUE
				// Make a typecast and see if the value has been correctly captured
				var optionalValue = $(this).attr("data-optional");
				if (typeof optionalValue === 'undefined' || optionalValue === false || optionalValue == "") optionalValue = undefined;

				// FIELD NAME
				var fieldName = $(this).attr("name");

				// SHIP 'EM ALL!
				if (itemDetail) {
					// ---------------------
					// ITEM OPTIONS
					// ---------------------

					$.post(destiny + '.php',
					{	
						itemDetail: $exclusiveAwesomeBox.attr("class"),
						action: "edit",
						parentID: parentID,
						childID: childID,
						fieldName: fieldName,
						fieldValue: fieldValue,
						optionalValue: optionalValue,
					}, // And we print it on the screen
					function(data) {

					}, 'html');

				} else {
					// ---------------------
					// CARTE, CATEGORIES AND ITEMS
					// ---------------------

					$.post(destiny + '.php',
					{	
						editSomething: $containerList.attr("class"),
						parentID: parentID,
						childID: childID,
						fieldName: fieldName,
						fieldValue: fieldValue,
						optionalValue: optionalValue,
					}, // And we print it on the screen
					function(data) {

					}, 'html');
				}

				// Content update
				var $parent = $(this).parent();
				if ($parent.attr("data-counterpart") == "yes") {
					$(this).parents(".pageContentItem").siblings(".pageContentItemSelected").find("span[name=" + fieldName + "]").text(fieldValue);
				}
			});

			return this;
		},

	};


	// Method calling logic
    if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
	}

};
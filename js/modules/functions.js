	/**
	 * Type of device being used
	 * @return {null}
	 */
	var isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i) ? true : false;
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i) ? true : false;
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
	    }
	};

	/**
	 * Cookies!
	 * @return {null}
	 */
	function createCookie(name, value, days) {
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	        var expires = "; expires=" + date.toGMTString();
	    } else var expires = "";
	    document.cookie = escape(name) + "=" + escape(value) + expires + "; path="+ window.location.pathname;
	}

	function readCookie(name) {
	    var nameEQ = escape(name) + "=";
	    var ca = document.cookie.split(';');
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
	        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
	    }
	    return null;
	}

	function eraseCookie(name) {
	    createCookie(name, "", -1);
	}

	/**
	 * Local storage with expiration!
	 * @type {null}
	 */
	var storageExpiration = {
		save: function(key, data, expirationMin) {
			var expirationMS = expirationMin * 60 * 1000;
			var record = {
				value: data,
				timestamp: new Date().getTime() + expirationMS
			};

			localStorage.setItem(key, JSON.stringify(record));

			return data;
		},
		load: function(key) {
			var record = JSON.parse(localStorage.getItem(key));
			if (record) {
				if (new Date().getTime() < record.timestamp) {
				 	return record.value;
				} else {
					localStorage.removeItem(key);
				}
			}

			return false;
		}
	}

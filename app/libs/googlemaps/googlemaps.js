/* class for working with google maps */

function Map(mapOptions, canvasClass) {
	this.map = new google.maps.Map(document.getElementsByClassName(canvasClass)[0], mapOptions);
	this.markers = [];
	Map.activeInfoWindow = undefined;

	this.addMarker = function(markerOptions, markerInfo) {
		var marker = new google.maps.Marker(markerOptions);
		this.markers.push(marker);

		marker.setMap(this.map);

		// addMarkerInfo.call(this, marker, markerInfo);
		addMarkerInfo.call(this, this.markers[this.markers.length - 1], markerInfo);
	}

	this.showInfoWindow = function(markerId) {
		
		google.maps.event.trigger(this.markers[markerId], 'click');

	}

	function addMarkerInfo(marker, info) {
		if(info === undefined) {
			var info = {};
		}

		var infoWindowOptions = {
			content: "<div class='infowindow'>" +
						"<div class='infowindow-content'>" +
							 "<h5 class='infowindow__title'>" + info.title + "</h5>" + 
							 "<p class='infowindow__person'>" + info.person + "</p>" + 
							 "<div class='infowindow__contacts'>" +
							 	"<p>контактна інформація:</p>" +
							 	"<p>тел. " + info.phone + ",</p>" +
							 	"<p>адреса: " + info.address + "</p>" +
							 "</div>" +
						"</div>" +
					 "</div>",
			zIndex: 1,
			maxWidth: 300,
			disableAutoPan: false
		};

		// create new window
		var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

		google.maps.event.addListener(marker, 'click', function(e){

			// close active window if exists 
			if(Map.activeInfoWindow) 
				Map.activeInfoWindow.close(); 

			// open new window 
			infoWindow.open(this.map, marker);

			// global in Map class variable
			Map.activeInfoWindow = infoWindow; 
		});

		/*
		 * The google.maps.event.addListener() event waits for
		 * the creation of the infowindow HTML structure 'domready'
		 * and before the opening of the infowindow defined styles
		 * are applied.
		 */
		google.maps.event.addListener(infoWindow, 'domready', function() {

			// Reference to the DIV which receives the contents of the infowindow using jQuery
			var iwOuter = $('.gm-style-iw');

			iwOuter.parent().addClass('custom-iw');


			/* The DIV we want to change is above the .gm-style-iw DIV.
			* So, we use jQuery and create a iwBackground variable,
			* and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
			*/
			var iwBackground = iwOuter.prev();

			// Moves the shadow of the arrow away (under infowin)
			iwBackground.children(':nth-child(1)').addClass('display-none');

			// Remove the background shadow DIV
			iwBackground.children(':nth-child(2)').addClass('display-none');

			// Moves the arrow away (under infowin)
			iwBackground.children(':nth-child(3)').addClass('display-none');

			// Remove the white background DIV
			iwBackground.children(':nth-child(4)').addClass('display-none');


			iwOuter.parent().parent().addClass('gm-style-iw-parent-parent');
			iwOuter.parent().addClass('gm-style-iw-parent');


			// Taking advantage of the already established reference to
			// div .gm-style-iw with iwOuter variable.
			// You must set a new variable iwCloseBtn.
			// Using the .next() method of JQuery you reference the following div to .gm-style-iw.
			// Is this div that groups the close button elements.
			var iwCloseBtn = iwOuter.next();

			// remove default close img tag
			iwCloseBtn.find('img').remove();

			// Apply the desired effect to the close button
			iwCloseBtn.addClass('gm-style-iw-close');

			// The API automatically applies 0.7 opacity to the button after the mouseout event.
			// This function reverses this event to the desired value.
			iwCloseBtn.mouseout(function(){
				$(this).css({opacity: '1'});
			});

		});
	}
}
$(function() {

/**
 *	Drop down language selector
 *
 */
	var $trigger = $('.lang-switcher__selector'),
		$list = $('.lang-switcher__languages'),
		$oldLang, $newLang, $target;

	$trigger.click(function() {
		$trigger.toggleClass('lang-switcher__selector--active');
		$list.toggleClass('lang-switcher__languages--active');
	});

	$list.click(function(e) {

		/* replace current selector language with selected */
		$target = $(e.target);
		if(! $target.is('a'))
			return;

		$oldLang = $trigger.text();
		$newLang = $target.text();

		$trigger.text($newLang);
		$target.text($oldLang);
		
		$trigger.removeClass('lang-switcher__selector--active');
		$list.removeClass('lang-switcher__languages--active');
	});

///////////////////////////////////////////////////////////////////////////



/**
 *	Search button toggle class
 *
 */
	var $search = $('.btn-search'),
		$searchBox = $('.search-box');
	$search.click(function() {
		$searchBox.toggleClass('search-box--is-shown');
		$(this).toggleClass('btn-search--is-close');
	});

///////////////////////////////////////////////////////////////////////////
	


/**
 *	News or investigations slider
 *
 */
	var $news = $('#news'),
	    $newsInvestigation = $('#newsInvestigation');

	if($news.length > 0) $news.cslide();
	if($newsInvestigation.length > 0) 
		$newsInvestigation.cslide();

///////////////////////////////////////////////////////////////////////////	



/**
 *	Get cities list from JSON data file
 *
 */
	var cities = [];
	$.ajax({
		url: '/cities.json',
		async: false,
		dataType: 'json',
		success: function (json) {
			cities = json.cities;
		}
	});

	/* connect jQuery custom selector Select2 */
	var $selectCity = $('.select-city');
	if($selectCity.length > 0) {
		$selectCity.select2({
			placeholder: 'Оберіть місто',
			data: cities, 
			width: 250
		});
	}

///////////////////////////////////////////////////////////////////////////	



/**
 *	Load map with markers and show infowindow one of them
 *
 */
	if($('.map-cells').length > 0) {
		var mapOptions, map, markerOptions, markerInfo;

		mapOptions = {
			center: new google.maps.LatLng(48.6546600, 30.5238000),
			zoom: 6,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false
		};
		map = new Map(mapOptions, 'map-cells');

		for (var i = 0; i < cities.length; i++) {

			markerOptions = {
				position: new google.maps.LatLng(cities[i].markerOptions.position.lat, cities[i].markerOptions.position.lng),
				icon: '/img/map_marker.png'
			};

			markerInfo = {
				title: cities[i].markerInfo.title,
				person: cities[i].markerInfo.person,
				phone: cities[i].markerInfo.phone,
				address: cities[i].markerInfo.address
			}

			map.addMarker(markerOptions, markerInfo);
		}

		$(window).bind('load', function() {
			$selectCity.val(7).trigger('select2:select').trigger('change');
		});

		$selectCity.on('select2:select', function(e) {
			var infoWinNumber = $(this).val();
			map.showInfoWindow(infoWinNumber);		
		});
	}

///////////////////////////////////////////////////////////////////////////	



/**
 *	Load new set of items (news or investigations)
 *
 */
	var lastNews = -1,
		loadNewsNumber = 6,
		$loadMoreContainer = false,
		ajaxUrl;

	if($(".newsContainer").length > 0) {
		$loadMoreContainer = $(".newsContainer");
		ajaxUrl = '/news.json';
	}
	else if($(".investigationContainer").length > 0) {
		$loadMoreContainer = $(".investigationContainer");
		ajaxUrl = '/investigation.json';
	}

	if($loadMoreContainer) {
		
		/* first 6 items display on regular load */
		getRequest(ajaxUrl, showNewsCallback);

		/* on click load next 6 items */
		$('.load-more__button').on('click', function() {
			getRequest(ajaxUrl, showNewsCallback);
		});

		function getRequest(url, successCallback){
			$.ajax({
				url: url,
				dataType: "json",
				success: function(data, textStatus, jqXHR){
					successCallback(data, textStatus, jqXHR);
				}
			});    
		}

		function showNewsCallback(data, textStatus, jqXHR) {
			for(var i = lastNews + 1; i < lastNews + 1 + loadNewsNumber; i++)
				addNewsContent(i);
			lastNews = i - 1;
			console.log(lastNews);

			function addNewsContent(newsId) {
				if(data.news[newsId] == undefined) {
					return;
				}
				var newsItem =  "<article class='news-item'>" +
									"<img class='news-item__photo' src='" + data.news[newsId].imgUrl + "' alt>" +
									"<div class='news-item__container'>" +
										"<div class='news-item__date'>" + getFormatDate(data.news[newsId].date) + "</div>" +
										"<h4 class='news-item__title'>" + data.news[newsId].title + "</h4>" +
										"<p class='news-item__info'>" + data.news[newsId].info + "</p>" +
										"<a href='#' class='news-item__details'>Детальніше</a>" +
									"</div>" +
								"</article>";
				$loadMoreContainer.append( $(newsItem) );
				
				function getFormatDate(dateString) {
					var d = new Date(dateString);
					var date = d.getDate();
					switch ( d.getMonth() ) {
						case 0: date += " СІЧНЯ, "; break;
						case 1: date += " ЛЮТОГО, "; break;
						case 2: date += " БЕРЕЗНЯ, "; break;
						case 3: date += " КВІТНЯ, "; break;
						case 4: date += " ТРАВНЯ, "; break;
						case 5: date += " ЧЕРВНЯ, "; break;
						case 6: date += " ЛИПНЯ, "; break;
						case 7: date += " СЕРПНЯ, "; break;
						case 8: date += " ВЕРЕСНЯ, "; break;
						case 9: date += " ЖОВТНЯ, "; break;
						case 10: date += " ЛИСТОПАДА, "; break;
						case 11: date += " ГРУДНЯ, "; break;
					}
					date += d.getFullYear();
					return date;
				}
			}
		}
	}

///////////////////////////////////////////////////////////////////////////	



/**
 *	Connect jQuery custom selector Flexslider
 *
 */
	var $investigationSlider = $('#investigationInnerSlider');

	if($investigationSlider.length > 0) {
		$investigationSlider.flexslider({
			animation: "slide",
			controlNav: false,
			controlsContainer: $(".custom-controls-container"),
			customDirectionNav: $("#investigationInnerSlider + .custom-navigation a")
		});
	}

///////////////////////////////////////////////////////////////////////////	



/**
 *	Tabs switcher
 *
 */
	var $tabsLink = $('.tabs__link');
	if($tabsLink.length > 0) {
		$tabsLink.click(function(){
			var tab_id = $(this).attr('data-tab');

			$tabsLink.removeClass('tabs__link--current');
			$('.tabs__item').removeClass('tabs__item--current');

			$(this).addClass('tabs__link--current');
			$("#" + tab_id).addClass('tabs__item--current');
		});
	}

	/* add file handler */
	if($(".tab__add-file").length > 0) {
		$(".tab__add-file").click(function(e){
			e.preventDefault();
			$("#add-file").trigger('click');
		});	
	}

///////////////////////////////////////////////////////////////////////////	



/**
 *	Load repairs map
 *
 */
	if($('.map-cells--repairs').length > 0) {
		var mapOptionsRepairs, mapRepairs;

		mapOptionsRepairs = {
			center: new google.maps.LatLng(50.8573855, 30.6027633),
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false,
			disableDefaultUI: true
		};
		mapRepairs = new Map(mapOptionsRepairs, 'map-cells--repairs');
	}

///////////////////////////////////////////////////////////////////////////	
});
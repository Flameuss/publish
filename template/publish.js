$(function(){
	var map;
	var data = {};
	var $legend = $('#legend');

	function renderLegend(colors, property){
		$legend.empty();
		$legend.append($('<div id="legend-container"><h4 class="panel-title">' + Publish.legend +'</h4><br/></div>'));
		var $legendContent = $('<div id="legend-content">').appendTo($('#legend-container'));
		$.each(colors, function(attribute, color){
			var $div = $('<div style="height:25px;">')
				.append($('<div class="legend-color-box">').css({backgroundColor: color}))
				.append($('<span>').css("lineHeight", "23px").html(property + " " + attribute));
			$legendContent.append($div);
		});
	}

	function setStyle(feature){
		return{
			fillColor: feature.getProperty("color"),
			strokeWeight: 1
		};
	}

	function onClick(event){
		var id = event.target.id;
		if(data[id]){
			$legend.empty();
			data[id].setMap(null);
			delete data[id];
		}else{
			var url = Publish.path + id + ".geojson";
			$.getJSON(url, function(geojson){
				var selected = Publish.data[id];
				var property = selected[0];
				var colors = selected[1];
				renderLegend(colors, property);

				var mdata = new google.maps.Data();
				mdata.addGeoJson(geojson);
				mdata.forEach(function(feature){
					feature.setProperty("color", colors[feature.getProperty(property)]);
				});

				mdata.setStyle(setStyle);
				mdata.setMap(map);
				data[id] = mdata;
			});
		}
	}

	function initMap(){
		google.maps.visualRefresh = true;
		var mapOptions = {
			center: new google.maps.LatLng(Publish.center.lat, Publish.center.long),
			zoom: Publish.zoom,
			minZoom: Publish.minZoom,
			maxZoom: Publish.maxZoom,
			mapTypeId: google.maps.MapTypeId[Publish.mapTypeId],
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				position: google.maps.ControlPosition.TOP_RIGHT
			}
		};

		var mapElement = document.getElementById("map");
		map = new google.maps.Map(mapElement, mapOptions);
		map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push($legend[0]);
		map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push($('#footer')[0]);

		$('#layers').find(':button').click(onClick);
	}

	google.maps.event.addDomListener(window, "load", initMap);

	function applyMargins(){
		var leftToggler = $('.mini-submenu-left');
		if (leftToggler.is(':visible')) {
		 	$('#map').find('.ol-zoom')
			.css('margin-left', 0)
			.removeClass('zoom-top-opened-sidebar')
			.addClass('zoom-top-collapsed');
		} else {
			$('#map').find('.ol-zoom')
			.css('margin-left', $('.sidebar-left').width())
			.removeClass('zoom-top-opened-sidebar')
			.removeClass('zoom-top-collapsed');
		}
	}

	function isConstrained(){
		return $('.sidebar').width() == $(window).width();
	}

	function applyInitialUIState(){
		if (isConstrained()){
			$('.sidebar-left .sidebar-body').fadeOut('slide');
			$('.mini-submenu-left').fadeIn();
		}
	}

	$('.sidebar-left .slide-submenu').on('click',function(){
		var thisEl = $(this);
		thisEl.closest('.sidebar-body').fadeOut('slide',function(){
			$('.mini-submenu-left').fadeIn();
			applyMargins();
		});
	});

	$('.mini-submenu-left').on('click',function(){
		var thisEl = $(this);
		$('.sidebar-left .sidebar-body').toggle('slide');
		thisEl.hide();
		applyMargins();
	});

	$(window).on('resize', applyMargins);

	applyInitialUIState();
	applyMargins();
});
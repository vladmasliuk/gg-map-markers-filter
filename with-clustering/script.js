var json = [{"title":"Store","country":"Country 2","state":"State 3","city":"City 1","stor":"Online","geometry":{"type":"regMark","coordinates":[22.9136423,61.3192647]}},{"title":"Store","country":"Country 1","state":"State 1","city":"City","stor":"Online","geometry":{"type":"topMark","coordinates":[1.5897899,48.7974785]}},{"title":"Store","country":"Country 2","state":"State 8","city":"City 7","stor":"Online","geometry":{"type":"regMark","coordinates":[0.4003768,39.397829]}},{"title":"Store","country":"Country 5","state":"State 2","city":"City 12","stor":"Online","geometry":{"type":"regMark","coordinates":[72.8518987,19.1591391]}},{"title":"Store","country":"Country 3","state":"State 7","city":"City 9","stor":"Traditional","geometry":{"type":"foreMark","coordinates":[7.8317568,53.2705224]}},{"title":"Store","country":"Country 2","state":"State 7","city":"City 10","stor":"Traditional","geometry":{"type":"regMark","coordinates":[23.9987056,54.9071229]}},{"title":"Store","country":"Country 3","state":"State 4","city":"City 9","stor":"Traditional","geometry":{"type":"foreMark","coordinates":[6.4048487,49.640073]}},{"title":"Store","country":"Country 2","state":"State 1","city":"City 9","stor":"Online","geometry":{"type":"regMark","coordinates":[10.2130222,59.7341107]}},{"title":"Store","country":"Country 2","state":"State 3","city":"City 4","stor":"Online","geometry":{"type":"foreMark","coordinates":[172.5586693,-43.5353626]}},{"title":"Store","country":"Country 4","state":"State 7","city":"City 13","stor":"Online","geometry":{"type":"topMark","coordinates":[-8.6121719,41.234484]}},{"title":"Store","country":"Country 2","state":"State 6","city":"City 4","stor":"Traditional","geometry":{"type":"regMark","coordinates":[26.0183058,44.4848626]}},{"title":"Store","country":"Country 5","state":"State 3","city":"City 9","stor":"Traditional","geometry":{"type":"topMark","coordinates":[21.3461775,44.546003]}},{"title":"Store","country":"Country 3","state":"State 6","city":"City 8","stor":"Traditional","geometry":{"type":"regMark","coordinates":[18.7083446,49.2150819]}},{"title":"Store","country":"Country 5","state":"State 3","city":"City 2","stor":"Online","geometry":{"type":"topMark","coordinates":[14.5718825,46.1647155]}},{"title":"Store","country":"Country 3","state":"State 5","city":"City 7","stor":"Online","geometry":{"type":"foreMark","coordinates":[9.471981,47.1693]}},{"title":"Store","country":"Country 6","state":"State 5","city":"City 12","stor":"Online","geometry":{"type":"foreMark","coordinates":[19.0619361,47.4896313]}},{"title":"Store","country":"Country 6","state":"State 8","city":"City 14","stor":"Traditional","geometry":{"type":"topMark","coordinates":[0.0227168,50.804037]}}]

var jsonStringify = JSON.stringify(json)
var jsonParse = JSON.parse(jsonStringify); 

var markers = [];
var markerCluster = [];
var filterSelect = $('.filter');
var resetButton = $('#resetFilter');

var filterResults = [];
for (var i = 0; i < json.length; i++) {
    var filters = json[i];
    var filterCountry = filters.country;
    var filterState = filters.state;
    var filterCity = filters.city;
    var filterStor = filters.stor;
    filterResults.push(filterCountry, filterState, filterCity, filterStor); 
}

var filterStringify = JSON.stringify(filterResults)
var filterParse = JSON.parse(filterStringify);   

function initMap() {
    var map = new google.maps.Map(document.getElementById('store-map'), {
      zoom: 2,
      center: new google.maps.LatLng(36.4128349, 6.0497745),
      styles: [{"featureType":"landscape","stylers":[{"hue":"#F1FF00"},{"saturation":-27.4},{"lightness":9.4},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#0099FF"},{"saturation":-20},{"lightness":36.4},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#00FF4F"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FFB300"},{"saturation":-38},{"lightness":11.2},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00B6FF"},{"saturation":4.2},{"lightness":-63.4},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#9FFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]}]
    });

    for (var i = 0; i < json.length; i++){
        setMarkers(json[i], map);
    }
    
    markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

var iconBase = "./img/";

    var icons = {
        regMark: {
            icon: iconBase + 'store-map-marker.png'
        },
        topMark: {
            icon: iconBase + 'store-top-map-marker.png'
        },
        foreMark: {
            icon: iconBase + 'store-fore-map-marker.png'
        } 
    };

function setMarkers(marker, map) {
    var markerMap = marker.geometry.coordinates;
    var title = marker.title;
    var country = marker.country;
    var state = marker.state;
    var city = marker.city;
    var stor = marker.stor;
    var pos = new google.maps.LatLng(markerMap[1], markerMap[0]);
    var content = marker;
    var icon = icons[marker.geometry.type].icon;


    markerMap = new google.maps.Marker({
        position: pos,
        title: title,
        country: country,
        state: state,
        city: city,
        stor: stor,
        map: map,
        icon: icon
    });

    markers.push(markerMap);

    var infowindow = new google.maps.InfoWindow({
        content: title + '<br/>' + country + '<br/>' + state + '<br/>' + city + '<br/>' + stor 
    });    

    // Marker click listener
    google.maps.event.addListener(markerMap, 'click', (function (marker1, content) {
        return function () {
            infowindow.setContent(content);
            infowindow.open(map, markerMap);
            map.panTo(this.getPosition());
        }
    })(markerMap, content));

}

function clusterManager(array) { 
    markerCluster.clearMarkers();
    if (array.length) {
        for (i=0; i < array.length; i++) {
            markerCluster.addMarker(array[i]);
        }
    }  
}

function newFilter(filterType1 = 'all', filterType2 = 'all', filterType3 = 'all', filterType4 = 'all') {
    var criteria = [
        { Field: "country", Values: [filterType1] },
        { Field: "state", Values: [filterType2] },
        { Field: "city", Values: [filterType3] },
        { Field: "stor", Values: [filterType4] },
      ];

    var filtered = markers.flexFilter(criteria);
    clusterManager(filtered);
}

Array.prototype.flexFilter = function(info) {

    var matchesFilter, matches = [], count;
    matchesFilter = function(item) {
      count = 0
      for (var n = 0; n < info.length; n++) {
        if (info[n]["Values"].indexOf(item[info[n]["Field"]]) > -1) {
            count++;
        }
        //if value = all, return all item
        else if (info[n]["Values"] == "all") {
            count++;
        }
      }
      // If TRUE, then the current item in the array meets all the filter criteria
      return count == info.length;
    }
    // Loop through each item in the array
    for (var i = 0; i < this.length; i++) {
      // Determine if the current item matches the filter criteria
      if (matchesFilter(this[i])) {
        matches.push(this[i]);
      }
    }
    // Give us a new array containing the objects matching the filter criteria
    return matches;
  }
  
$(document).ready(function() {
  $('.filter-country').on('change', function(){   
    var filter2 = $('.filter-state').val();
    var filter3 = $('.filter-city').val();
    var filter4 = $('.filter-stor').val();
    newFilter($(this).val(), filter2, filter3, filter4);
  });
  
  $('.filter-state').on('change', function(){
    var filter1 = $('.filter-country').val();
    var filter3 = $('.filter-city').val();
    var filter4 = $('.filter-stor').val();
    newFilter(filter1, $(this).val(), filter3, filter4);
  });
  
  $('.filter-city').on('change', function(){
    var filter1 = $('.filter-country').val();
    var filter2 = $('.filter-state').val();
    var filter4 = $('.filter-stor').val();
    newFilter(filter1, filter2, $(this).val(), filter4);
  });

  $('.filter-stor').on('change', function(){
    var filter1 = $('.filter-country').val();
    var filter2 = $('.filter-state').val();
    var filter3 = $('.filter-city').val();
    newFilter(filter1, filter2, filter3, $(this).val());
  });

    resetButton.on('click', function() {
        // searchInput.val('');
        filterSelect.val('all');
        newFilter();
    });
 
    //delete all duplicated value from the previous array
    var uniqueValue = [];
    $.each(filterResults, function(i, el){
        if($.inArray(el, uniqueValue) === -1) {
            uniqueValue.push(el);
        }

    });

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
        var matches, substringRegex;
        matches = [];
        substrRegex = new RegExp(q, 'i');
        $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
            matches.push(str);
            }
        });
        cb(matches);
        };    
    };
});
 
initMap();
    var locations =  [
   {
            title: 'New York , USA',
            type: 'NA City',
            location: {
                lat: 40.730610,
                lng: -73.935242
            }
        },

        {
            title: 'London , England',
            type: 'EU City',
            location: {
                lat: 51.508530,
                lng: -0.076132
            }
            
        },

        {
            title: 'Rome , Italy',
          type: 'EU City',
            location: {
                lat: 41.9028,
                lng: 12.4964
            }
        },

        {
            title: 'Reykjavik , Iceland',
          type: 'EU City',
            location: {
                lat: 64,
                lng: -21
            }
        },

        {
            title: 'Ottawa , Canada',
          type: 'NA City',
            location: {
                lat: 45.4215,
                lng: -75.6981200
            }
        },

        {
            title: 'Sydney , Australia',
          type: 'AU City',
            location: {
                lat: -33,
                lng: 151
            }
        }

  ];

    var fourSqrsVenues = [];
    var fourSqrsData = [];
    var markers = [];
    var info_windows = [];
    var latlon;
    var location_marker;
    var map;

    var ViewModel = function() {

    
      this.categoryList = [],

      // dynamically retrieve categories to
      // create drop down list later
      locations.map(food => {
        if (!this.categoryList.includes(food.type))
          this.categoryList.push(food.type);
      }),

      this.foodArray = ko.observableArray(locations);
      // Observable Array for drop down list
      this.categories = ko.observableArray(this.categoryList); 
      // This will hold the selected value from drop down menu
      this.selectedCategory = ko.observable(); 

      /**
       * Filter function, return filtered food by
       * selected category from <select>
       */
      this.filterFood = ko.computed(() => {
        if (!this.selectedCategory()) {
          // No input found, return all food
          return this.foodArray();
        } else {
          // input found, match food type to filter
          return ko.utils.arrayFilter(this.foodArray(), (food) => {
            return ( food.type === this.selectedCategory() );
          });
        } //.conditional
      }), //.filterFood 
     //.constructor

    
        this.focusLocation = function (clicked_id) {
        
        i = 0;

        while (i < 6) {

            if (clicked_id == locations[i].title) {

                this.setVisible(true);

                focusMarker(i);

                return;

            } else {

                this.setVisible(false);

                i++;

            }
        }
    },

            this.focusMarker = function(place) {

            // markers[i].infowindow.open(map, markers[i]);
            console.log(this.location)
            map.setCenter(this.location);

            map.setZoom(4);

        }

    };


var vm = new ViewModel()

ko.applyBindings(vm);
// alert(vm.selectedCategory);
    function createMarker(lat, lon, infoText, imgData) {

        var newmarker = new google.maps.Marker({

            position: new google.maps.LatLng(lat, lon),

            map: map,

            title: infoText

        });

    function toggleBounce() {
        if (newmarker.getAnimation() === null) {
            newmarker.setAnimation(google.maps.Animation.BOUNCE); 
            setTimeout(function(){newmarker.setAnimation(null);}, 700);
          
        } else {
           newmarker.setAnimation(null);
        }
      }
      newmarker.addListener('click', toggleBounce);
        newmarker.infowindow = new google.maps.InfoWindow({

            content: imgData

        });

        

        google.maps.event.addListener(newmarker, 'click', function() {


            var test = fourSqrsVenues;

            this.infowindow.open(map, this);

        });

    }
    function processMarker(_marker) {


        var _venueId;

        var _venueData;

        var fourSqrAPI = "https://api.foursquare.com/v2/venues/explore?ll=" + _marker.position.lat() + "," + _marker.position.lng() + "&client_id=RMUX5HBSR5HMDKG3RCXK3O2VIY0BCRNMSD14V2DGQV0PK02U&client_secret=I3TIMAEYGCPDPB1T0332OOF3O2JP454OZ0PVCGWOXB1UIR4Y&v=20170323";

        $.getJSON(fourSqrAPI).done(function(data) {

            var testData = data;

            $.each(data.response.groups, function(i, groups) {

                if (i === 0) {

                    $.each(groups.items, function(j, items) {

                        if (j === 0) {

                            var venueName = items.venue.name;

                            var venueCat = items.venue.categories[0].name;

                            $.each(items.tips, function(k, tips) {

                                if (k === 0) {

                                    var fName = tips.user.firstName;

                                    var lName = tips.user.lastName;

                                    if (fName === null) fName = "";

                                    if (lName === null) lName = "";

                                    var userDetails = fName + " " + lName;

                                    var details = "<div style='font-size:17px;text-decoration:underline;font-weight:bold; margin-bottom:7px;'>" + _marker.title + "</div> <div style='margin-bottom:3px;'><span style='font-size:13px;font-weight:bold;'>Name:</span> " + venueName + "</br></div>  <div style='margin-bottom:3px;'> <span style='font-size:13px;font-weight:bold;'>Category:</span> " + venueCat + "</br></div>  <span style='font-size:13px;font-weight:bold;'>Tip:</span> " + tips.text + " (<i>submitted by: " + userDetails + "</i>)";

                                    createMarker(_marker.position.lat(), _marker.position.lng(), _marker.title, details);
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    function randomIntFromInterval(min, max) {

        return Math.floor(Math.random() * (max - min + 1) + min);

    }

    function initAutocomplete() {

        map = new google.maps.Map(document.getElementById('map'), {

            center: {
                lat: 31.7917,
                lng: 7.0926
            },

            zoom: 3,

            mapTypeId: 'roadmap'

        });

        for (var i = 0; i < locations.length; i++) {

            location_marker = new google.maps.Marker({

                map: map,

                title: locations[i].title,

                position: locations[i].location,
            });

            markers.push(location_marker);

            processMarker(location_marker);
        }
    }

    // function focusMarker(place) {

    //     map.setCenter(locations[place].location);

    //     map.setZoom(4);

    // };





    function gmapsError() {
    alert("Google Maps has failed to load. Please check your internet connection and try again.");
}

$('.hamburger').on('click', function(e) {
  // Prevent link from jumping to the top of the page
  e.preventDefault();
  // If menu is already showing, slide it up. Otherwise, slide it down.
  $('.menu').toggleClass('slide-down');
});
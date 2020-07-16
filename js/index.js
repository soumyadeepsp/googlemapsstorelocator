function initMap() {
    var losAngeles = {lat: 34.063380, lng: -118.358080};
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores(){
    var foundStores = []
    var zipCode = document.getElementById('zipcode').value;
    if(zipCode){
        for(var store of stores){
            var postal = store['address']['postalCode'].substring(0, 5);
            if(postal == zipCode){
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store_container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        });
    });
}

function displayStores(stores){
    var storesHtml = '';
    //stores = stores.slice(2);
    for (var [index, store] of stores.entries()){
        //console.log(store);
        var address = store['addressLines'];
        var phone = store['phoneNumber'];
        storesHtml = storesHtml + 
        `<div class="store_container">
            <div class="store_container_background">
                <div class="store_info_container">
                    <div class="store_address">
                        <span> ${address[0]} </span>
                        <span> ${address[1]} </span>
                    </div>
                    <div class="store_phone_number">
                        ${phone}
                    </div>
                </div>
                <div class="store_number_container">
                    <div class="store_number">
                        ${index+1}
                    </div>
                </div>
            </div>
        </div>`
        document.querySelector('.stores_list').innerHTML = storesHtml;
    }
}

var map;
var markers = [];
var infoWindow;

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for (var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store['coordinates']['latitude'],
            store['coordinates']['longitude']);
        var name = store['name'];
        var address = store['addressLines'][0];
        var openStatusText = store['openStatusText'];
        var phoneNumber = store['phoneNumber'];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, index+1);
    }
    map.fitBounds(bounds)
}

function createMarker(latlng, name, address, openStatusText, phoneNumber, index){
    var html = `
    <div class = "store_info_window">
        <div class = "store_info_name">
            ${name}
        </div>
        <div class = "store_info_status">
            ${openStatusText}
        </div>
        <div class = "store_info_address">
            <div class="circle">
                <i class="fas fa-location-arrow"></i>
            </div>
            ${address}
        </div>
        <div class = "store_info_phone">
            <div class="circle">
                <i class="fas fa-phone-alt"></i>
            </div>
            ${phoneNumber}
        </div>
    </div>
    `;
          var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            label: index.toString()
          });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
          });
          markers.push(marker);
}
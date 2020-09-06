import React, { useEffect } from 'react';
import { GOOGLE_MAP_URL } from '@constants/thirdPartyAPIUrl';

const Map = ({ npoOrgName, locations }) => {
  useEffect(() => {
    // create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = GOOGLE_MAP_URL;
    script.defer = true;
    script.async = true;

    // attach your callback function to the `window` object
    window.initMap = function () {
      // center the map according to center lat, lng of Singapore if there are more than 1 marker
      const centerLocation = {
        lat: locations.length > 1 ? 1.3521 : locations[0].latitude,
        lng: locations.length > 1 ? 103.8198 : locations[0].longitude,
      };

      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: locations.length > 1 ? 11 : 16, // determines the magnification level of the map
        center: centerLocation,
      });

      locations.map((location, index) => {
        const contentString = `<h2 style="padding: 0px 20px 0px 20px;">${npoOrgName}</h2><p style="padding: 0px 20px 0px 20px;">${location.name}<b></p>`;

        const infowindow = new google.maps.InfoWindow({
          content: contentString,
        });

        const marker = new google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: map,
        });

        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });

        // only the first location infowindow will be opened if there are more than 1 marker
        if (index === 0) {
          infowindow.open(map, marker);
        }
      });
    };

    // append the 'script' element to 'body'
    document.body.appendChild(script);
  }, []);

  return null;
};

export default Map;

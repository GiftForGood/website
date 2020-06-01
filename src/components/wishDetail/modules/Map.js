import React, { useEffect } from 'react';
import { GOOGLE_MAP_URL } from '../../../../utils/constants/thirdPartyAPIUrl';

const Map = ({ lat, lng, npoOrgName, npoOrgAddress }) => {
  useEffect(() => {
    // create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = GOOGLE_MAP_URL;
    script.defer = true;
    script.async = true;

    // attach your callback function to the `window` object
    window.initMap = function () {
      const npoLocation = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };

      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16, // determines the magnification level of the map
        center: npoLocation,
      });

      const contentString = `<h2 style="padding: 0px 20px 0px 20px;">${npoOrgName}</h2><p style="padding: 0px 20px 0px 20px;">${npoOrgAddress}<b></p>`;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      const marker = new google.maps.Marker({
        position: npoLocation,
        map: map,
      });

      marker.addListener('click', function () {
        infowindow.open(map, marker);
      });

      infowindow.open(map, marker);
    };

    // append the 'script' element to 'body'
    document.body.appendChild(script);
  }, []);

  return null;
};

export default Map;

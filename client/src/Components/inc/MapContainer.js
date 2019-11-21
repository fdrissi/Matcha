import React, { useState } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";
import { InfoWindow, Marker } from "google-maps-react";

export function MapContainer({ google }) {
  const [marker, setMarker] = useState({
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  });

  const onMarkerClick = (props, marker, e) => {
    // ..
    console.log(marker);
    console.log(props);
    console.log(e);
  };
  return (
    <Map
      google={google}
      zoom={14}
      initialCenter={{
        lat: -1.2884,
        lng: 36.8233
      }}
    >
      <Marker
        onClick={onMarkerClick()}
        name={"Kenyatta International Convention Centre"}
      />
      <InfoWindow></InfoWindow>
    </Map>
  );
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyCjR4ewWqdPGjnGwre1aSN3l2llz6dp7IQ"
})(MapContainer);

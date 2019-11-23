import React from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const MyMapComponent = withScriptjs(
  withGoogleMap(({ isMarkerShown, data, setData }) => {
    const { lat, lng } = data.user_location;

    const handleLocationChange = e => {
      const user_location = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setData({ ...data, user_location });
    };

    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat, lng }}
        onClick={e => handleLocationChange(e)}
      >
        {isMarkerShown && (
          <Marker
            position={{ lat, lng }}
            icon={{
              url: "/img/location.png",
              scaledSize: new window.google.maps.Size(25, 25)
            }}
          />
        )}
      </GoogleMap>
    );
  })
);

const MapContainer = ({ data, setData }) => {
  return (
    <MyMapComponent
      data={data}
      setData={setData}
      isMarkerShown
      googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCjR4ewWqdPGjnGwre1aSN3l2llz6dp7IQ"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `40vh` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
};

export default MapContainer;

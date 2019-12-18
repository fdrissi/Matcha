import React from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MyMapComponent = withGoogleMap(({ isMarkerShown, data, setData }) => {
  const { lat, lng } = data.user_location;
  const { user_set_from_map } = data;

  const handleLocationChange = e => {
    const user_location = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    const user_set_from_map = true;
    setData({ ...data, user_location, user_set_from_map });
  };

  return (
    <GoogleMap
      defaultZoom={lat && lng && user_set_from_map ? 8 : 2}
      defaultCenter={
        lat && lng ? { lat, lng } : { lat: 32.8821167, lng: -6.8978511 }
      }
      onClick={e => handleLocationChange(e)}
    >
      {isMarkerShown && lat && lng && user_set_from_map && (
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
});

const MapContainer = ({ data, setData }) => {
  return (
    <MyMapComponent
      data={data}
      setData={setData}
      isMarkerShown
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `40vh` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
};

export default MapContainer;

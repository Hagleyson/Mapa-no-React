import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Search from "./search/Search";
import styles from "./map.module.css";
const libraries = ["places"];
const center = {
  lat: -9.183715923214667,
  lng: -55.013154104300035,
};
const mapContainerStyle = {
  height: "100%",
  width: "100%",
  position: "absolute",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState(null);

  const onMapClick = useCallback((e) => {
    setMarkers({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      time: new Date(),
    });
  }, []);
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
    setMarkers({
      lat: lat,
      lng: lng,
      time: new Date(),
    });
  }, []);
  if (loadError) return "Error ao carregar o mapa";
  if (!isLoaded) return "Carregando Mapa";

  return (
    <div className={styles.mapContainer}>
      <Search panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers && (
          <Marker
            key={markers.time.toISOString()}
            position={{ lat: markers.lat, lng: markers.lng }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
export default Map;

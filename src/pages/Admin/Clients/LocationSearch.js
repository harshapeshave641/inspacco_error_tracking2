import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

const LocationSearch = ({ 
  setSocietyLat, 
  setSocietyLong, 
  setAddress1, 
  setAddress2, 
  setPincode, 
  setArea, 
  setCity, 
  setState, 
  societyLat, 
  societyLong,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAY-c_RLQBwu0uWOLoXEl_nandopt5XwMk',
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  const onLoad = useCallback((autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        setSocietyLat(location.lat());
        setSocietyLong(location.lng());
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        if (map) {
          map.panTo(location);
        }

        const addressComponents = place.address_components;
        let address1 = '';
        let address2 = '';
        let pincode = '';
        let area = '';
        let city = '';
        let state = '';

        addressComponents.forEach((component) => {
          const types = component.types;
          if (types.includes('street_number')) {
            address1 = component.long_name + ' ';
          }
          if (types.includes('route')) {
            address1 += component.long_name;
          }
          if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
            address2 = component.long_name;
          }
          if (types.includes('postal_code')) {
            pincode = component.long_name;
            fetchPincodeDetails(pincode);
          }
          if (types.includes('administrative_area_level_2')) {
            area = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
        });

        setAddress1(address1.trim());
        setAddress2(address2.trim());
        setPincode(pincode);
        setArea(area);
        setCity(city);
        setState(state);
      }
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data && data.length > 0 && data[0].Status === "Success") {
        const { Block, District, State } = data[0].PostOffice[0];
        const area = Block;
        const city = District;
        const state = State;

        setArea(area);
        setCity(city);
        setState(state);

        const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=AIzaSyAY-c_RLQBwu0uWOLoXEl_nandopt5XwMk`);
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.status === "OK") {
          const location = geocodeData.results[0].geometry.location;
          setSocietyLat(location.lat);
          setSocietyLong(location.lng);
          console.log("THis is marker for pincode");
          setMarkerPosition({ lat: location.lat, lng: location.lng });
          if (map) {
            map.panTo(location);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
    }
  };

  useEffect(() => {
    if (societyLat && societyLong) {
      const newPosition = { lat: societyLat, lng: societyLong };
      setMarkerPosition(newPosition);
      if (map) {
        map.panTo(newPosition);
      }
    }
  }, [societyLat, societyLong, map]);

  return isLoaded ? (
    <div>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          className='mb-4 text-black bg-white border-2'
          placeholder="Search Location"
          style={{ width: '100%', height: '40px', padding: '12px' }}
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || defaultCenter}
        zoom={10}
        onLoad={map => setMap(map)}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  ) : <></>;
};

export default React.memo(LocationSearch);
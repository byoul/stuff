import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 커스텀 마커 아이콘 생성
const createIcon = (team) => {
  const color = team === 'black' ? '#1a1a1a' : '#888888';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

function Map({ restaurants, selectedRestaurant, onSelectRestaurant }) {
  // 한국 중심 좌표 (서울)
  const center = [37.5665, 126.9780];

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.lat, restaurant.lng]}
            icon={createIcon(restaurant.team)}
            eventHandlers={{
              click: () => onSelectRestaurant(restaurant)
            }}
          >
            <Popup>
              <div className="popup-content">
                <h3>{restaurant.chef}</h3>
                <p><strong>{restaurant.restaurant}</strong></p>
                <p>{restaurant.category}</p>
                <p className="popup-address">{restaurant.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;

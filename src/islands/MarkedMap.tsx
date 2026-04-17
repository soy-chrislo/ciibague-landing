import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Use CDN URL to avoid Vite ImageMetadata type issues with leaflet png
const markerIconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';

export interface MapLocation {
  id: string;
  position: [number, number];
  photo?: string;
  price?: string;
  label?: string;
}

interface MarkedMapProps {
  positions: [number, number][];
  locations?: MapLocation[];
  className?: string;
  style?: React.CSSProperties;
}

const markerIcon = new Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MarkedMap({ positions, className, style, locations }: MarkedMapProps) {
  const center = locations && locations.length > 0 ? locations[0].position : positions[0];
  if (!center) return null;

  return (
    <div className={`w-full overflow-hidden ${className || ''}`} style={style}>
      <MapContainer className={`w-full h-[250px] ${className || ''}`} center={center} zoom={14}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {locations
          ? locations.map((location) => (
              <Marker key={location.id} position={location.position} icon={markerIcon}>
                {(location.photo || location.price) && (
                  <Popup>
                    <a
                      href={`/property/${location.id}`}
                      className="block no-underline text-inherit"
                    >
                      {location.photo && (
                        <img
                          src={location.photo}
                          alt="Propiedad"
                          className="w-[180px] h-[100px] object-cover rounded"
                        />
                      )}
                      {location.price && (
                        <p className="font-semibold text-center mt-1 text-sm">
                          {location.label ? `${location.label}: ` : ''}$
                          {Number(location.price).toLocaleString('es-CO')}
                        </p>
                      )}
                    </a>
                  </Popup>
                )}
              </Marker>
            ))
          : positions.map((position) => (
              <Marker key={position.join('')} position={position} icon={markerIcon}>
                <Popup>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 no-underline hover:text-orange-600"
                  >
                    Cómo llegar
                  </a>
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
}

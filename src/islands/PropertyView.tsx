import { lazy, Suspense } from 'react';
import type { Property } from '../types';
import ImageViewer from './ImageViewer';

const MarkedMap = lazy(() => import('./MarkedMap'));

type PropertyViewProps = {
  property: Property;
};

function CharacteristicRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex rounded-lg items-center justify-between p-2 px-5 text-base mb-2"
      style={{ border: '1px solid #DADADA' }}
    >
      <p className="border-r-2 w-1/2 border-gray-300 text-gray-500">{label}</p>
      <p className="font-medium" style={{ color: '#EE6910' }}>
        {value}
      </p>
    </div>
  );
}

function PropertyStatus({ status }: { status: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {status ? 'Disponible' : 'No disponible'}
    </span>
  );
}

export default function PropertyView({ property }: PropertyViewProps) {
  const position =
    property.lat && property.lng
      ? { latitude: property.lat, longitude: property.lng }
      : { latitude: 4.444078700336001, longitude: -75.23468133604176 };

  const handleShare = async () => {
    const url = window.location.href;
    const title = `${propertyTypeLabel} en ${property.address}`;

    // Mobile: use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or error — fall through to clipboard
      }
    }

    // Desktop: copy to clipboard with feedback
    try {
      await navigator.clipboard.writeText(url);
      const btn = document.getElementById('share-btn');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="text-green-600 text-xs font-medium">Enlace copiado!</span>';
        setTimeout(() => {
          btn.innerHTML = original;
        }, 2000);
      }
    } catch {
      // Fallback
    }
  };

  const propertyTypeLabel = property.propertyType
    ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)
    : 'No especificado';

  return (
    <article className="w-full max-w-5xl mx-auto px-4 pb-8 lg:px-6">
      <div className="lg:flex lg:gap-8 lg:items-start mt-4">
        {/* LEFT: Images + Map */}
        <div className="lg:w-3/5 lg:sticky lg:top-4">
          <div className="rounded-xl overflow-hidden shadow-lg h-[260px] sm:h-[380px]">
            <ImageViewer propertyPhotos={property.photos} />
          </div>

          {/* Map — visible on desktop inside left column */}
          <div className="hidden lg:block mt-4 rounded-xl overflow-hidden shadow">
            <Suspense fallback={<div className="h-[220px] bg-gray-200 animate-pulse" />}>
              <MarkedMap positions={[[position.latitude, position.longitude]]} />
            </Suspense>
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="lg:w-2/5 mt-4 lg:mt-0">
          {/* Status + Share */}
          <div className="flex items-center justify-between mb-3">
            <PropertyStatus status={property.available} />
            <button
              type="button"
              id="share-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition-colors cursor-pointer"
              aria-label="Compartir"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>

          {/* Price */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ${Number(property.price).toLocaleString('es-CO')}
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span>{property.bedrooms} hab</span>
            <span>{property.bathrooms} baños</span>
            <span>{property.parkingSpots} parq</span>
            <span>{property.area} m²</span>
          </div>

          {/* Address */}
          <p className="text-gray-500 text-sm mb-4">{property.address}</p>

          {/* WhatsApp contact button */}
          <a
            href="https://wa.me/573164601494"
            target="_blank"
            rel="noreferrer"
            className="block mb-6"
          >
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-base font-semibold text-white py-3 rounded-lg transition-opacity hover:opacity-90 active:opacity-75"
              style={{ backgroundColor: '#1A9305' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.146.564 4.158 1.549 5.9L0 24l6.304-1.654A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.97 0-3.839-.533-5.454-1.463l-.39-.232-3.744.982.999-3.648-.254-.404A9.71 9.71 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75S21.75 6.615 21.75 12s-4.365 9.75-9.75 9.75z" />
              </svg>
              Contactar por WhatsApp
            </button>
          </a>

          {/* Description */}
          {property.description && (
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Characteristics */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Datos y características</h2>
            <CharacteristicRow label="Tipo" value={propertyTypeLabel} />
            <CharacteristicRow label="Habitaciones" value={String(property.bedrooms)} />
            <CharacteristicRow label="Baños" value={String(property.bathrooms)} />
            <CharacteristicRow label="Área total (m²)" value={String(property.area)} />
            <CharacteristicRow label="Parqueaderos" value={String(property.parkingSpots)} />
            <CharacteristicRow
              label="Estrato"
              value={property.stratum ? `Estrato ${property.stratum}` : 'No especificado'}
            />
            <CharacteristicRow
              label="Barrio"
              value={property.neighborhood ?? property.address ?? 'No especificado'}
            />
          </div>
        </div>
      </div>

      {/* Map — visible on mobile, below the 2-col layout */}
      <div className="lg:hidden mt-4 rounded-xl overflow-hidden shadow">
        <Suspense fallback={<div className="h-[220px] bg-gray-200 animate-pulse" />}>
          <MarkedMap positions={[[position.latitude, position.longitude]]} />
        </Suspense>
      </div>
    </article>
  );
}

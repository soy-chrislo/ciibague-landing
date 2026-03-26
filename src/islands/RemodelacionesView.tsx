import { useCallback, useEffect, useRef, useState } from 'react';

interface BeforeAfter {
  id?: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

interface RemodelacionesViewProps {
  initialItems: BeforeAfter[];
  apiUrl: string;
}

function ArrowDownUpIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Ver antes y después</title>
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Cerrar</title>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function RemodelacionCard({
  item,
  onOpen,
}: {
  item: BeforeAfter;
  onOpen: (item: BeforeAfter) => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-lg border shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer group bg-white"
      onClick={() => onOpen(item)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(item)}
      role="button"
      tabIndex={0}
      aria-label={`Ver transformación: ${item.title}`}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={item.beforeImage}
          alt={`Antes - ${item.title}`}
          className="object-cover w-full h-full transition-opacity duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <ArrowDownUpIcon />
        </div>
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Antes
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
}

function RemodelacionModal({ item, onClose }: { item: BeforeAfter; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
    // biome-ignore lint/a11y/useKeyWithClickEvents: escape handled separately
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-2xl font-bold">
            {item.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[4/3]">
                <img
                  src={item.beforeImage}
                  alt={`Antes - ${item.title}`}
                  className="object-cover w-full h-full rounded-lg"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  Antes
                </div>
              </div>
              <div className="relative aspect-[4/3]">
                <img
                  src={item.afterImage}
                  alt={`Después - ${item.title}`}
                  className="object-cover w-full h-full rounded-lg"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  Después
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RemodelacionesView({ initialItems, apiUrl }: RemodelacionesViewProps) {
  const [items, setItems] = useState<BeforeAfter[]>(initialItems);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BeforeAfter | null>(null);

  const fetchMore = useCallback(
    async (paginationToken: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: '10', paginationToken });
        const res = await fetch(`${apiUrl}/remodelings?${params}`);
        const data = await res.json();
        const fetchedItems: BeforeAfter[] = Array.isArray(data) ? data : (data.items ?? []);
        const fetchedNextToken: string | null = Array.isArray(data)
          ? null
          : (data.nextToken ?? null);
        setItems((prev) => [...prev, ...fetchedItems]);
        setNextToken(fetchedNextToken);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  return (
    <>
      {items.length === 0 ? (
        <div className="col-span-full text-center py-20">
          <h3 className="text-2xl font-semibold text-gray-400 mb-2">
            No hay remodelaciones disponibles
          </h3>
          <p className="text-gray-400">No se encontraron remodelaciones para mostrar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <RemodelacionCard key={item.id ?? item.title} item={item} onOpen={setSelectedItem} />
          ))}
        </div>
      )}

      {nextToken && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => fetchMore(nextToken)}
            disabled={loading}
            className="px-6 py-2 text-white rounded-md font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#EE6910' }}
          >
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}

      {selectedItem && (
        <RemodelacionModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}

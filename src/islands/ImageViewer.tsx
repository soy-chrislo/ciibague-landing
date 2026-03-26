import { useState } from 'react';
import { PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function ImageViewer({ propertyPhotos }: { propertyPhotos: string[] }) {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const morePhotos = [...propertyPhotos];

  return (
    <>
      <PhotoSlider
        visible={visible}
        onClose={() => setVisible(false)}
        index={index}
        onIndexChange={(idx) => setIndex(idx)}
        images={morePhotos.map((photo, i) => ({
          src: photo,
          key: i,
        }))}
      />

      <div style={{ position: 'relative' }} className="w-full h-full">
        <img
          onClick={() => {
            setVisible(true);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setVisible(true);
            }
          }}
          className="w-full object-contain h-full cursor-pointer"
          src={
            propertyPhotos.length > 0 ? propertyPhotos[0] : 'https://via.placeholder.com/345x180'
          }
          alt="Property item"
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <p className="font-semibold">{morePhotos.length} fotos</p>
        </div>
      </div>
    </>
  );
}

import { useRef, useState } from 'react';

export default function CameraViewfinder({ imageSrc, ocrRunning, detectionVisible, onFileSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  function handleInputChange(e) {
    const file = e.target.files[0];
    if (file) onFileSelected(file);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelected(file);
  }

  return (
    <>
      <div
        className="camera-viewfinder"
        id="viewfinder"
        style={isDragOver ? { borderColor: 'var(--accent)' } : undefined}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="captured-image-wrap show">
          <img src={imageSrc} alt="Imagem analisada pelo scanner OCR" />
          <div
            className={`detection-box${detectionVisible ? ' show' : ''}`}
            style={{ top: '15%', left: '20%', width: '60%', height: '45%' }}
            aria-label="Texto detectado"
          />
        </div>

        <div className="camera-overlay" aria-hidden="true">
          <div className="scan-frame" />
          <div className={`scan-line${ocrRunning ? ' active' : ''}`} />
        </div>
      </div>

      <div className="camera-action-group">
        <label className="btn btn-primary" style={{ flex: 1, cursor: 'pointer' }} htmlFor="upload-input">
          Enviar imagem
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="upload-input"
          accept="image/*"
          className="hidden"
          aria-label="Selecionar imagem do dispositivo"
          onChange={handleInputChange}
        />
      </div>
    </>
  );
}

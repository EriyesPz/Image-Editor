import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import useImage from 'use-image';

const ImageMaskEditor: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [lines, setLines] = useState<any[]>([]);
  const [brushSize, setBrushSize] = useState(20); // Tamaño del pincel
  const stageRef = useRef<any>(null);
  const [image] = useImage(imageURL || '');
  
  const handleMouseDown = () => {
    setIsSelecting(true);
    const pos = stageRef.current.getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]); // Inicia la selección
  };

  const handleMouseMove = () => {
    if (!isSelecting) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  // Función para guardar la imagen con la selección
  const handleSaveImage = () => {
    const uri = stageRef.current.toDataURL({
      mimeType: 'image/png',
      quality: 1,
    });
    
    // Crear un enlace para descargar la imagen
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = uri;
    link.click();
  };

  return (
    <div>
      <h2>Image Mask Editor</h2>

      {/* Input para cargar la imagen */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageURL(imageUrl);
          }
        }}
      />

      {/* Control deslizante para cambiar el tamaño del pincel */}
      <label>Tamaño del pincel: {brushSize}px</label>
      <input
        type="range"
        min="1"
        max="50"
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
      />

      {/* Canvas con Konva */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 150}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        style={{ border: '1px solid black' }}
      >
        <Layer>
          {/* Mostrar la imagen cargada */}
          {image && <KonvaImage image={image} width={600} height={400} />}
          
          {/* Dibujar las líneas seleccionadas */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="rgba(0, 120, 255, 0.5)" // Color de selección azul semitransparente
              strokeWidth={brushSize}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>

      {/* Botón para guardar la imagen con la selección */}
      <button onClick={handleSaveImage}>Guardar imagen con selección</button>
    </div>
  );
};

export { ImageMaskEditor };

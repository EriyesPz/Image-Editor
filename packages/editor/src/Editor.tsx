import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import useImage from 'use-image';

const ImageMaskEditor: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [lines, setLines] = useState<any[]>([]);
  const [currentLine, setCurrentLine] = useState<any | null>(null); // Línea actual en dibujo
  const [brushSize, setBrushSize] = useState(20); // Tamaño del pincel
  const stageRef = useRef<any>(null);
  const [image] = useImage(imageURL || '');

  const handleMouseDown = () => {
    setIsSelecting(true);
    const pos = stageRef.current.getPointerPosition();
    const newLine = { points: [pos.x, pos.y], strokeWidth: brushSize }; // Línea con el grosor actual
    setCurrentLine(newLine); // Establecer la línea actual
  };

  const handleMouseMove = () => {
    if (!isSelecting) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    const updatedLine = { ...currentLine };
    updatedLine.points = updatedLine.points.concat([point.x, point.y]);
    setCurrentLine(updatedLine); // Actualizar la línea actual mientras se selecciona
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (currentLine) {
      setLines([...lines, currentLine]); // Añadir la línea dibujada a las líneas finales
      setCurrentLine(null); // Reiniciar la línea actual
    }
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
              strokeWidth={line.strokeWidth} // Mantiene el grosor de pincel usado en el momento de la selección
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}

          {/* Dibujar la línea actual mientras se está seleccionando */}
          {currentLine && (
            <Line
              points={currentLine.points}
              stroke="rgba(0, 120, 255, 0.5)"
              strokeWidth={currentLine.strokeWidth} // El grosor del pincel actual
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          )}
        </Layer>
      </Stage>

      {/* Botón para guardar la imagen con la selección */}
      <button onClick={handleSaveImage}>Guardar imagen con selección</button>
    </div>
  );
};

export { ImageMaskEditor };

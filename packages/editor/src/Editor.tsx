import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import useImage from 'use-image';

const ImageMaskEditor: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState<any[]>([]); // Almacenar los trazos de selección
  const [brushSize, setBrushSize] = useState(20); // Tamaño del pincel
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null); // Posición del mouse para mostrar el círculo
  const stageRef = useRef<any>(null);
  const [image] = useImage(imageURL || '');

  const stageWidth = 600;
  const stageHeight = 400;

  const handleMouseDown = () => {
    setIsDrawing(true);
    const pos = stageRef.current.getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], strokeWidth: brushSize }]); // Inicia un nuevo trazo
  };

  const handleMouseMove = (e: any) => {
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setMousePosition({ x: point.x, y: point.y }); // Actualiza la posición del círculo en todo momento

    if (isDrawing) {
      const lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]); // Continuar el trazo
      setLines([...lines.slice(0, -1), lastLine]); // Actualizar el último trazo
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false); // Detener el dibujo
  };

  // Función para ajustar la imagen a las dimensiones del Stage
  const getAdjustedImageDimensions = (imgWidth: number, imgHeight: number) => {
    const aspectRatio = imgWidth / imgHeight;
    let newWidth = stageWidth;
    let newHeight = stageHeight;

    if (aspectRatio > 1) {
      // Imagen más ancha que alta
      newHeight = stageWidth / aspectRatio;
    } else {
      // Imagen más alta que ancha
      newWidth = stageHeight * aspectRatio;
    }

    return { width: newWidth, height: newHeight };
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
        width={stageWidth}
        height={stageHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
        style={{ border: '1px solid black', margin: '20px 0' }}
      >
        <Layer>
          {/* Mostrar la imagen cargada y ajustar al tamaño del Stage */}
          {image && (
            <KonvaImage
              image={image}
              {...getAdjustedImageDimensions(image.width, image.height)}
            />
          )}

          {/* Dibujar las áreas seleccionadas como líneas libres */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="rgba(0, 120, 255, 0.5)" // Color de selección azul semitransparente
              strokeWidth={line.strokeWidth} // Mantiene el grosor del pincel usado
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}

          {/* Círculo que muestra el área del pincel antes y durante el dibujo */}
          {mousePosition && (
            <Circle
              x={mousePosition.x}
              y={mousePosition.y}
              radius={brushSize / 2}
              stroke="#e1e1e1"
              strokeWidth={2}
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

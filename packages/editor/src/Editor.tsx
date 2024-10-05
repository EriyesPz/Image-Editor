import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import useImage from 'use-image';

const ImageMaskEditor: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [allLines, setAllLines] = useState<any[]>([]); // Almacenar todas las líneas seleccionadas
  const [currentLine, setCurrentLine] = useState<any>({ points: [], strokeWidth: 20 }); // Línea actual
  const [brushSize, setBrushSize] = useState(20); // Tamaño del pincel actual
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null); // Posición del mouse para mostrar el círculo
  const stageRef = useRef<any>(null);
  const [image] = useImage(imageURL || '');

  const stageWidth = 600;
  const stageHeight = 400;

  // Distancia mínima para evitar añadir puntos cercanos (elimina superposiciones visuales)
  const MIN_DISTANCE = 5;

  const handleMouseDown = () => {
    setIsDrawing(true);
    const pos = stageRef.current.getPointerPosition();
    setCurrentLine({ points: [pos.x, pos.y], strokeWidth: brushSize }); // Inicia un nuevo trazo con el tamaño del pincel actual
  };

  const handleMouseMove = () => {
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setMousePosition({ x: point.x, y: point.y }); // Actualiza la posición del círculo

    if (isDrawing) {
      const lastPointIndex = currentLine.points.length - 2; // Último punto
      const dx = point.x - currentLine.points[lastPointIndex];
      const dy = point.y - currentLine.points[lastPointIndex + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Añadir puntos solo si la distancia es mayor a un umbral (para evitar puntos muy juntos)
      if (distance > MIN_DISTANCE) {
        setCurrentLine((prevLine: any) => ({
          ...prevLine,
          points: [...prevLine.points, point.x, point.y], // Añadir nuevos puntos a la línea actual
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (currentLine.points.length > 0) {
      // Fusionar si las líneas están lo suficientemente cerca
      const mergedLines = mergeWithExistingLines(allLines, currentLine);
      setAllLines(mergedLines); // Actualizar todas las líneas
      setCurrentLine({ points: [], strokeWidth: brushSize }); // Reiniciar la línea actual manteniendo el tamaño del pincel actual
    }
  };

  // Función para ajustar la imagen a las dimensiones del Stage
  const getAdjustedImageDimensions = (imgWidth: number, imgHeight: number) => {
    const aspectRatio = imgWidth / imgHeight;
    let newWidth = stageWidth;
    let newHeight = stageHeight;

    if (aspectRatio > 1) {
      newHeight = stageWidth / aspectRatio;
    } else {
      newWidth = stageHeight * aspectRatio;
    }

    return { width: newWidth, height: newHeight };
  };

  // Función para fusionar líneas si están lo suficientemente cerca
  const mergeWithExistingLines = (lines: any[], newLine: any) => {
    const mergedLines = [...lines]; // Copia de las líneas existentes
    let merged = false;

    // Comprobar si el nuevo trazo debe fusionarse con una línea existente
    for (let i = 0; i < mergedLines.length; i++) {
      const existingLine = mergedLines[i];
      if (areLinesClose(existingLine.points, newLine.points)) {
        // Fusionar los puntos de las líneas sin cambiar el grosor del pincel existente
        mergedLines[i] = {
          ...existingLine,
          points: [...existingLine.points, ...newLine.points], // Fusionar las líneas
        };
        merged = true;
        break;
      }
    }

    // Si no se ha fusionado, añadir como una nueva línea
    if (!merged) {
      mergedLines.push(newLine);
    }

    return mergedLines;
  };

  // Función para verificar si dos líneas están lo suficientemente cerca para fusionarse
  const areLinesClose = (lineA: number[], lineB: number[], threshold = 25) => {
    for (let i = 0; i < lineA.length; i += 2) {
      for (let j = 0; j < lineB.length; j += 2) {
        const dx = lineA[i] - lineB[j];
        const dy = lineA[i + 1] - lineB[j + 1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < threshold) {
          return true;
        }
      }
    }
    return false;
  };

  // Función para verificar si dos líneas son idénticas y evitar solapamientos visuales
  const areLinesIdentical = (lineA: number[], lineB: number[]) => {
    if (lineA.length !== lineB.length) return false;
    for (let i = 0; i < lineA.length; i++) {
      if (lineA[i] !== lineB[i]) return false;
    }
    return true;
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
        max="100"
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

          {/* Dibujar todas las áreas seleccionadas con el tamaño de pincel original */}
          {allLines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="rgba(0, 120, 255, 0.5)" // Color de selección azul semitransparente
              strokeWidth={line.strokeWidth} // Mantener el grosor original de cada área seleccionada
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}

          {/* Dibujar el área actual mientras se está seleccionando */}
          {currentLine.points.length > 0 && (
            <Line
              points={currentLine.points}
              stroke="rgba(0, 120, 255, 0.5)"
              strokeWidth={currentLine.strokeWidth} // Mantener el grosor del pincel actual durante el dibujo
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          )}

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

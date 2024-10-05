import React, { useState, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';

const ImageEditor: React.FC = () => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [selection, setSelection] = useState<any[]>([]);
  const stageRef = useRef<any>(null);
  const [image] = useImage(imageURL || '');
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = (e: any) => {
    setIsSelecting(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    setSelection([{ x, y, width: 0, height: 0 }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isSelecting) return;
    const stage = stageRef.current.getStage();
    const point = stage.getPointerPosition();
    const newSelection = selection[0];
    newSelection.width = point.x - newSelection.x;
    newSelection.height = point.y - newSelection.y;
    setSelection([newSelection]);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  return (
    <div>
      <h2>Select an Area to Edit</h2>
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
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 150}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {image && <KonvaImage image={image} width={600} height={400} />}
          {selection.map((sel, index) => (
            <Rect
              key={index}
              x={sel.x}
              y={sel.y}
              width={sel.width}
              height={sel.height}
              fill="rgba(0, 120, 255, 0.5)"
              stroke="blue"
              strokeWidth={2}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export { ImageEditor };

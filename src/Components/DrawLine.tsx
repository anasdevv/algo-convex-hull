import React, { useState } from 'react';
import { useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Point {
  x: number;
  y: number;
}

interface Line {
  id: string;
  start: Point;
  end: Point;
}

interface DraggableLineProps {
  line: Line;
  updateLine: (id: string, newLine: Line) => void;
}

const DraggableLine: React.FC<DraggableLineProps> = ({ line, updateLine }) => {
  const [, drag] = useDrag({
    type: 'LINE',
    item: { id: line.id, originalLine: line },
  });

  const handleDrop = (e: React.DragEvent) => {
    // Handle the drop event and update the line's position
    const { clientX, clientY } = e;
    const newLine: Line = { ...line, end: { x: clientX, y: clientY } };
    updateLine(line.id, newLine);
  };

  return (
    <div
      ref={drag}
      onDrop={handleDrop}
      style={{
        position: 'absolute',
        left: `${line.start.x}px`,
        top: `${line.start.y}px`,
        width: `${line.end.x - line.start.x}px`,
        height: `${line.end.y - line.start.y}px`,
        border: '4px solid black',
        cursor: 'move',
      }}
    />
  );
};

interface DrawLinesProps {
  lines: Line[];
  setLines: React.Dispatch<React.SetStateAction<Line[]>>;
}

const DrawLines: React.FC<DrawLinesProps> = ({ lines, setLines }) => {
  const updateLine = (id: string, newLine: Line) => {
    setLines((prevLines) =>
      prevLines.map((line) => (line.id === id ? { ...line, ...newLine } : line))
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {lines.map((line) => (
        <DraggableLine key={line.id} line={line} updateLine={updateLine} />
      ))}
    </div>
  );
};

const Lines: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);

  const handleMouseDown = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    console.log('down');
    const newLine: Line = {
      id: `${lines.length}`,
      start: { x: clientX, y: clientY },
      end: { x: clientX, y: clientY },
    };
    setLines([...lines, newLine]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div onMouseDown={handleMouseDown}>
        <DrawLines lines={lines} setLines={setLines} />
      </div>
    </DndProvider>
  );
};

export default Lines;

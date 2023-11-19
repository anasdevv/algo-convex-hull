import React, { useState, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

const Plotter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      setContext(ctx);

      // Generate and display 10 random points initially
      const initialPoints: Point[] = Array.from({ length: 10 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }));
      setPoints(initialPoints);
      drawPoints(initialPoints);
    }
  }, []);

  useEffect(() => {
    // Adjust canvas size when the window is resized
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        // Redraw points when resizing
        drawPoints(points);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [points]);

  const drawPoints = (pointArray: Point[]) => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear canvas
      context.fillStyle = 'orange';
      const radius = 2 * 0.5;

      pointArray.forEach((point) => {
        context.beginPath();
        // context.arc(point.x, point.y, 1, 0.1, 2 * Math.PI);
        // context.fill();
        context.fillRect(point.x, point.y, 2, 2);
      });
    }
  };

  const connectPoints = () => {
    if (context && points.length >= 2) {
      context.strokeStyle = 'black';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }

      context.stroke();
    }
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setPoints([...points, { x: offsetX, y: offsetY }]);
    if (context) {
      drawPoints([...points, { x: offsetX, y: offsetY }]);
    }
  };

  return (
    <main className='flex-1 w-3/4 h-full'>
      <div className='bg-white  h-full p-2 w-full'>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          style={{ border: '1px solid black', width: '100%', height: '100%' }}
        />
        <div style={{ width: '200px', background: 'lightgray' }}>
          <button onClick={connectPoints}>Connect Points</button>
          <div>
            <h3>Points:</h3>
            <ul>
              {points.map((point, index) => (
                <li key={index}>{`(${point.x.toFixed(2)}, ${point.y.toFixed(
                  2
                )})`}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Plotter;

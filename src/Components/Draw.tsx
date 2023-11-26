import { useEffect, useRef, RefObject, useState } from 'react';
import p5 from 'p5';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import { useActiveState } from '../Context.ts/ActiveContex';

const P5Canvas = ({ setP5Instance }: any) => {
  const { points, linePoints, quickHullPoints } = useDrawingContext();
  const { active } = useActiveState();
  const p5ContainerRef = useRef();
  const [currentPoint, setCurrentPoint] = useState(0);

  console.log('lp ', linePoints);

  useEffect(() => {
    const sketch = (p: any) => {
      const widht = document.getElementById('parent')?.clientWidth ?? 700;
      const height =
        document.getElementById('parent')?.clientHeight! - 50 ?? 600;
      p.setup = () => {
        setP5Instance(p);
        p.frameRate(30);
        p.createCanvas(widht, height);
        p.background(17, 24, 39);
        p.noLoop();
      };

      p.draw = () => {
        if (active === 'quickElimination' && quickHullPoints.length > 0) {
          for (let i = 0; i < quickHullPoints.length; i++) {
            console.log('points ', points);
            const start = quickHullPoints[i];
            const end =
              quickHullPoints[(i + 1) % (quickHullPoints.length as number)];
            if (start.x || start.y || end.x || end.y) {
              p.stroke(0, 0, 139);
              p.strokeWeight(3);
              p.line(start.x, start.y, end.x, end.y);
            }
          }
        }
        if (active === 'line') {
          p.fill(255, 0, 0);
          p.noStroke();
          for (let i = 0; i < points.length; i++) {
            const point1 = points[i];
            p.ellipse(point1.x, point1.y, 10, 10);
            const label = `( ${Math.round(point1.x)}, ${Math.round(
              point1.y
            )} )`;
            p.text(label, point1.x, point1.y - 10);
          }
          p.stroke(255, 0, 0);
          p.strokeWeight(3);
          for (let i = 0; i < points.length - 1; i += 2)
            p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        } else {
          if (linePoints.length > 2) {
            for (let i = 0; i < linePoints.length; i++) {
              console.log('points ', points);

              const start = linePoints[i];
              const end = linePoints[(i + 1) % (linePoints.length as number)];
              if (start.x || start.y || end.x || end.y) {
                p.stroke(255, 0, 0);
                p.strokeWeight(3);
                p.line(start.x, start.y, end.x, end.y);
              }
            }
          }
          if (points.length > 1) {
            for (let i = 0; i < points.length; i++) {
              let point = points[i];
              p.fill(255, 0, 0); // Set fill color to red
              p.noStroke();
              p.ellipse(point.x, point.y, 10, 10); // Draw a circle at each point
            }
          }
        }
      };
    };

    const startAnimation = () => {
      setCurrentPoint(0);
      animateDrawing();
    };
    const animateDrawing = () => {
      if (currentPoint < linePoints.length - 1) {
        setCurrentPoint((prev) => prev + 1);
        setTimeout(animateDrawing, 10000);
      }
    };
    startAnimation();

    const canvas = new p5(sketch, p5ContainerRef.current);

    return () => {
      canvas.remove();
    };
  }, [points, linePoints]);
  return (
    <>
      <div
        className='w-full h-[592px] p-5 mb-5 pb-8'
        ref={p5ContainerRef as unknown as RefObject<HTMLDivElement>}
      />
    </>
  );
};

export default P5Canvas;

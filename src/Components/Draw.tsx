import { useEffect, useRef, RefObject, useState } from 'react';
import p5 from 'p5';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import { useActiveState } from '../Context.ts/ActiveContex';
import { Point } from './Service/Operations';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const constrainPoint = (
  point: Point,
  canvasWidth: number,
  canvasHeight: number
) => {
  const constrainedX = Math.min(Math.max(0, point.x), canvasWidth);
  const constrainedY = Math.min(Math.max(0, point.y), canvasHeight);
  return { x: constrainedX, y: constrainedY };
};
const mapOutOfBoundNumbers = (
  point: Point,
  canvasWidth: number,
  canvasHeight: number,
  offsetValue?: number,
  proximityThreshold?: number
): Point => {
  const offset: number = offsetValue || 100;
  const threshold: number = proximityThreshold || 10;
  return point;
  let mappedX: number = point.x;
  if (point.x < 0) {
    mappedX += Math.abs(offset);
  } else if (point.x > canvasWidth) {
    mappedX -= Math.abs(offset);
  }
  let mappedY: number = point.y;
  if (point.y < 0) {
    mappedY += Math.abs(offset);
  } else if (point.y > canvasHeight) {
    mappedY -= Math.abs(offset);
  }

  if (
    Math.abs(mappedX - point.x) < threshold &&
    Math.abs(mappedY - point.y) < threshold
  ) {
    const scaleFactor = 10;
    mappedX *= scaleFactor;
    mappedY *= scaleFactor;
  }

  return { x: mappedX, y: mappedY };
};
const P5Canvas = ({ setP5Instance }: any) => {
  const { points, linePoints, retry } = useDrawingContext();
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
              // active !== 'grahamScan' && (await sleep(2000));
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
  }, [points, linePoints, retry]);
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

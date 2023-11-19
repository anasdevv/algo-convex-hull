import React, { useEffect } from 'react';
import { Point, useDrawingContext } from '../Context.ts/DrawingContext';
import { useLoading } from '../Context.ts/LoadingContext';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ccw = (a: Point, b: Point, c: Point) => {
  const area2 = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  if (area2 < 0) return -1;
  else if (area2 > 0) return 1;
  else return 0;
};
const getPointWithLowestY = (points: Point[]) => {
  let startingPoint = points[0];
  let startingPointIndex = 0;
  for (let i = 0; i < points.length; i++) {
    if (
      startingPoint.y > points[i].y ||
      (startingPoint.y === points[i].y && startingPoint.x > points[i].x)
    ) {
      startingPoint = points[i];
      startingPointIndex = i;
    }
  }
  return { startingPoint, startingPointIndex };
};
const JarvisMarch = () => {
  const { addLinePoint, points } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    async function jarvisMarch(points: Point[]) {
      const { startingPoint, startingPointIndex } = getPointWithLowestY(points);
      const hull = [startingPoint];
      addLinePoint(startingPoint);
      let currentPoint = startingPoint;
      let currentPointIndex = startingPointIndex;

      do {
        let nextPoint = points[0]; // Initialize next point

        for (let j = 0; j < points.length; j++) {
          if (points[j] === currentPoint) continue; // Skip the current point
          const turn = ccw(currentPoint, nextPoint, points[j]);
          console.log(currentPoint, nextPoint, points[j], turn);
          if (nextPoint === currentPoint || turn === -1) {
            nextPoint = points[j]; // Update next point
          }
        }
        currentPoint = nextPoint; // Update current point
        currentPointIndex = points.indexOf(nextPoint); // Update current point's index
        if (currentPoint !== hull[0]) {
          hull.push(currentPoint);
          addLinePoint(currentPoint);
          await sleep(1000);
        }
      } while (currentPoint !== hull[0]); // Continue until we return to the starting point

      return hull;
    }
    showLoading();
    jarvisMarch(points).then(() => {
      hideLoading();
    });
  }, []);
  return <div>JarvisMarch</div>;
};

export default JarvisMarch;

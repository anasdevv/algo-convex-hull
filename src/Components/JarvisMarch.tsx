import React, { useEffect } from 'react';
import { Point, useDrawingContext } from '../Context.ts/DrawingContext';
import { useLoading } from '../Context.ts/LoadingContext';
import { sleep, Operation } from './Service/Operations';

const JarvisMarch = () => {
  const { addLinePoint, points } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    async function jarvisMarch(points: Point[]) {
      const { startingPoint, startingPointIndex } =
        Operation.getPointWithLowestY(points);
      const hull = [startingPoint];
      addLinePoint(startingPoint);
      let currentPoint = startingPoint;
      let currentPointIndex = startingPointIndex;

      do {
        let nextPoint = points[0]; // Initialize next point

        for (let j = 0; j < points.length; j++) {
          if (points[j] === currentPoint) continue; // Skip the current point
          const turn = Operation.ccw(currentPoint, nextPoint, points[j]);
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

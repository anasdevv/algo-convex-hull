import { Point } from './Service/Operations';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import { useEffect } from 'react';
import {
  chooseInitialPoints,
  isInsideRectangle,
  jarvisMarch,
  sleep,
} from './Service/Operations';

const QuickElimination = () => {
  const { addLinePoint, points, addQuickHullPoints } = useDrawingContext();
  useEffect(() => {
    if (points.length > 0) {
      console.log('quick elimination');
      const initialPoints = chooseInitialPoints(points);
      addQuickHullPoints(initialPoints);
      const remainingPoints = points.filter(
        (point) => !isInsideRectangle(point, initialPoints)
      );

      const hull = [...new Set(jarvisMarch(remainingPoints))];
      async function printRemainingPoints(rm: Point[]) {
        for (let i = 0; i < rm.length; i++) {
          await sleep(1000);
          addLinePoint(rm[i]);
        }
      }
      printRemainingPoints(hull);
    }
  }, [points]);
  return <div>Quick Elimination</div>;
};

export default QuickElimination;

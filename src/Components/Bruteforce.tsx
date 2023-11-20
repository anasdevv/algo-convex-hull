import { useEffect } from 'react';
import { Point, useDrawingContext } from '../Context.ts/DrawingContext';
import { useLoading } from '../Context.ts/LoadingContext';
import { sleep, bruteForceHull, sortByAngle } from './Service/Operations';

export const BaseCaseBruteForce = () => {
  const { addLinePoint, points, linePoints, addLinePoints } =
    useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    showLoading();
    const p = sortByAngle(bruteForceHull(points));
    const printHull = async () => {
      for (let i = 0; i < p.length; i++) {
        await sleep(1000);
        addLinePoint(p[i]);
        console.log(linePoints);
      }
    };
    printHull();
    hideLoading();
  }, [points]);

  return <div>Brute Force </div>;
};

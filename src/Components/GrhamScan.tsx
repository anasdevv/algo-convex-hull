import React, { useEffect } from 'react';
import { Operation, Point, sleep } from './Service/Operations';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import { useLoading } from '../Context.ts/LoadingContext';

const GrhamScan = () => {
  const { addLinePoint, points, addLinePoints } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    const grhamScan = async (points: Point[]) => {
      const { startingPoint: leftmost } = Operation.getPointWithLowestY(points);
      const sortedPoints = points
        .slice()
        .sort(
          (a: Point, b: Point) =>
            Operation.polarAngle(leftmost, a) -
            Operation.polarAngle(leftmost, b)
        );
      const hull = [leftmost, sortedPoints[0], sortedPoints[1]];
      addLinePoints([leftmost, sortedPoints[0], sortedPoints[1]]);
      await sleep(100);
      for (let i = 2; i < sortedPoints.length; i++) {
        console.log('2');
        while (
          Operation.ccw(
            hull[hull.length - 2],
            hull[hull.length - 1],
            sortedPoints[i]
          ) !== 1
        ) {
          hull.pop();
          //   popLinePoint();
          addLinePoints(hull);
          await sleep(100);
        }
        hull.push(sortedPoints[i]);
        addLinePoint(sortedPoints[i]);
        await sleep(100);
        // addLinePoint(sortedPoints[i]);
        // console.log('line points ', linePoints);
      }
      return [...new Set(hull)];
    };
    if (points) {
      showLoading();
      grhamScan(points).then((res) => {
        console.log('final', res);
        hideLoading();
      });
    }
  }, [points]);
  return <div>GrhamScan</div>;
};

export default GrhamScan;

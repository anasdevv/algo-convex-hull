import { useEffect, useCallback } from 'react';
import { Point, useDrawingContext } from '../Context.ts/DrawingContext';
import { useLoading } from '../Context.ts/LoadingContext';
import { Operation, sleep, sortByAngle } from './Service/Operations';

async function findHull(
  a: Point[],
  n: number,
  p1: Point,
  p2: Point,
  side: number,
  hull: Set<Point>
) {
  let ind = -1;
  let max_dist = 0;

  // finding the point with maximum distance
  // from L and also on the specified side of L.
  for (let i = 0; i < n; i++) {
    const temp = Operation.lineDist(p1, p2, a[i]);
    if (Operation.findSide(p1, p2, a[i]) === side && temp > max_dist) {
      ind = i;
      max_dist = temp;
    }
  }

  // of L to the convex hull.
  if (ind === -1) {
    hull.add(p1);
    hull.add(p2);
    return;
  }

  findHull(a, n, a[ind], p1, -Operation.findSide(a[ind], p1, p2), hull);
  findHull(a, n, a[ind], p2, -Operation.findSide(a[ind], p2, p1), hull);
}
const quickHull = (a: Point[], n: number, hull: Set<Point>) => {
  // Finding the point with minimum and
  // maximum x-coordinate
  let min_x = 0,
    max_x = 0;
  for (let i = 1; i < n; i++) {
    if (a[i].x < a[min_x].x) min_x = i;
    if (a[i].x > a[max_x].x) max_x = i;
  }

  findHull(a, n, a[min_x], a[max_x], 1, hull);

  findHull(a, n, a[min_x], a[max_x], -1, hull);
};
// refer to GFG
const QuickHull = () => {
  const { addLinePoint, points } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  const addPoint = useCallback((point: Point) => {
    addLinePoint(point);
  }, []);
  useEffect(() => {
    const hull = new Set<Point>();

    showLoading();
    quickHull(points, points.length, hull);
    const p = sortByAngle([...hull]);
    const printHull = async () => {
      for (let i = 0; i < p.length; i++) {
        await sleep(1000);
        addLinePoint(p[i]);
      }
    };
    printHull();
    hideLoading();
  }, []);

  return <div>QuickHull</div>;
};

export default QuickHull;

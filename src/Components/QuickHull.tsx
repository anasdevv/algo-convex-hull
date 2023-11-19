import { useEffect, useCallback } from 'react';
import { Point, useDrawingContext } from '../Context.ts/DrawingContext';
import { useLoading } from '../Context.ts/LoadingContext';
function findSide(p1: Point, p2: Point, p: Point) {
  const val = (p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x);

  if (val > 0) return 1;
  if (val < 0) return -1;
  return 0;
}

function lineDist(p1: Point, p2: Point, p: Point) {
  return Math.abs((p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x));
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function findHull(
  a: Point[],
  n: number,
  p1: Point,
  p2: Point,
  side: number,
  hull: Set<Point>,
  addPoint: (p: Point) => void
) {
  let ind = -1;
  let max_dist = 0;

  // finding the point with maximum distance
  // from L and also on the specified side of L.
  for (let i = 0; i < n; i++) {
    const temp = lineDist(p1, p2, a[i]);
    if (findSide(p1, p2, a[i]) === side && temp > max_dist) {
      ind = i;
      max_dist = temp;
    }
  }

  // of L to the convex hull.
  if (ind === -1) {
    hull.add(p1);
    addPoint(p1);
    await sleep(2000);
    hull.add(p2);
    addPoint(p2);
    await sleep(2000);
    return;
  }

  findHull(a, n, a[ind], p1, -findSide(a[ind], p1, p2), hull, addPoint);
  await sleep(1000);
  findHull(a, n, a[ind], p2, -findSide(a[ind], p2, p1), hull, addPoint);
}
// refer to GFG
const QuickHull = () => {
  const { addLinePoint, points } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  const addPoint = useCallback((point: Point) => {
    addLinePoint(point);
  }, []);
  useEffect(() => {
    const hull = new Set<Point>();
    function _qucikHull(a: Point[], n: number) {
      // Finding the point with minimum and
      // maximum x-coordinate
      let min_x = 0,
        max_x = 0;
      for (let i = 1; i < n; i++) {
        if (a[i].x < a[min_x].x) min_x = i;
        if (a[i].x > a[max_x].x) max_x = i;
      }

      findHull(a, n, a[min_x], a[max_x], 1, hull, addPoint);

      findHull(a, n, a[min_x], a[max_x], -1, hull, addPoint);
    }
    showLoading();
    _qucikHull(points, points.length);
    hideLoading();
  }, []);

  return <div>QuickHull</div>;
};

export default QuickHull;

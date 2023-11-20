export type Point = { x: number; y: number };

export class Operation {
  static ccw(a: Point, b: Point, c: Point) {
    const area2 = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    if (area2 < 0) return -1;
    else if (area2 > 0) return 1;
    else return 0;
  }
  static getPointWithLowestY(points: Point[]) {
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
  }
  static polarAngle(point1: Point, point2: Point): number {
    const { x: x1, y: y1 } = point1;
    const { x: x2, y: y2 } = point2;
    return Math.atan2(y2 - y1, x2 - x1);
  }
  static findSide(p1: Point, p2: Point, p: Point) {
    const val = (p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x);

    if (val > 0) return 1;
    if (val < 0) return -1;
    return 0;
  }

  static lineDist(p1: Point, p2: Point, p: Point) {
    return Math.abs(
      (p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x)
    );
  }
}
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function findExtremePoint(
  points: Point[],
  direction: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
): Point {
  let extremePoint: Point;

  switch (direction) {
    case 'topLeft':
      extremePoint = points.reduce((prev, curr) =>
        curr.x <= prev.x && curr.y <= prev.y ? curr : prev
      );
      break;
    case 'topRight':
      extremePoint = points.reduce((prev, curr) =>
        curr.x >= prev.x && curr.y <= prev.y ? curr : prev
      );
      break;
    case 'bottomLeft':
      extremePoint = points.reduce((prev, curr) =>
        curr.x <= prev.x && curr.y >= prev.y ? curr : prev
      );
      break;
    case 'bottomRight':
      extremePoint = points.reduce((prev, curr) =>
        curr.x >= prev.x && curr.y >= prev.y ? curr : prev
      );
      break;
    default:
      throw new Error('Invalid direction');
  }

  return extremePoint;
}

export function chooseInitialPoints(points: Point[]): Point[] {
  if (points.length < 4) {
    // Not enough points to form a rectangle
    return points;
  }

  // Choose initial rectangle's corner points based on extreme points
  const topLeft = findExtremePoint(points, 'topLeft');
  const topRight = findExtremePoint(points, 'topRight');
  const bottomLeft = findExtremePoint(points, 'bottomLeft');
  const bottomRight = findExtremePoint(points, 'bottomRight');

  return [topLeft, topRight, bottomLeft, bottomRight];
}

export function isInsideRectangle(point: Point, rectangle: Point[]): boolean {
  const [A, B, C, D] = rectangle;

  // Check if the point is on the right side of each line AB, BC, CD, DA
  return (
    crossProduct(A, B, point) > 0 &&
    crossProduct(B, C, point) > 0 &&
    crossProduct(C, D, point) > 0 &&
    crossProduct(D, A, point) > 0
  );
}

export function crossProduct(A: Point, B: Point, C: Point): number {
  return (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
}
export function jarvisMarch(points: Point[]) {
  const { startingPoint, startingPointIndex } =
    Operation.getPointWithLowestY(points);
  const hull = [startingPoint];
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
    }
  } while (currentPoint !== hull[0]); // Continue until we return to the starting point

  return hull;
}
export function generateUniformRandomPoints(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  count: number
) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    points.push({ x, y });
  }
  return points;
}
export function generateSphericalRandomPoints(
  radius: number,
  count: number,
  screenWidth: number = 50,
  screenHeight: number = 30
) {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const x = screenWidth / 2 + radius * Math.cos(theta); // Adjusted for screen center
    const y = screenHeight / 2 + radius * Math.sin(theta); // Adjusted for screen center
    points.push({ x, y });
  }
  return points;
}
export function generateGaussianRandomPoints(
  meanX: number,
  stdDevX: number,
  meanY: number,
  stdDevY: number,
  count: number
) {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const x = meanX + Math.random() * stdDevX;
    const y = meanY + Math.random() * stdDevY;
    points.push({ x, y });
  }
  return points;
}

export const generateRandomPoints = (n: number): Point[] =>
  Array.from({ length: n }, () => ({
    x: Math.random() * 1000,
    y: Math.random() * 550,
  }));
export const bruteForceHull = (points: Point[]) => {
  const hull: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    if (
      hull.some(
        (hullPoint) =>
          hullPoint.x === points[i].x && hullPoint.y === points[i].y
      )
    )
      continue;
    for (let j = i + 1; j < points.length; j++) {
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[j];
      //For all points above the line, ax + by > c, while for all points below the line, ax + by < c
      const a = y1 - y2;
      const b = x2 - x1;
      const c = x1 * y2 - x2 * y1;
      let lower = 0,
        upper = 0;
      for (let k = 0; k < points.length; k++) {
        if (k === i || k === j) continue;
        if (a * points[k].x + b * points[k].y + c > 0) {
          upper += 1;
        } else if (a * points[k].x + b * points[k].y + c < 0) {
          lower += 1;
        }
        // else break;
      }
      if (upper === points.length - 2 || lower === points.length - 2) {
        hull.push(points[j]);
        hull.push(points[i]);
      }
    }
  }
  return [...new Set(hull)];
};
export function findUpperLeftmostPoint(convexHull: Point[]) {
  // Find the point with the minimum y-coordinate, and if tied, the minimum x-coordinate
  return convexHull.reduce((minPoint, currentPoint) => {
    if (
      currentPoint.y < minPoint.y ||
      (currentPoint.y === minPoint.y && currentPoint.x < minPoint.x)
    ) {
      return currentPoint;
    }
    return minPoint;
  });
}

export function sortByAngle(convexHull: Point[]) {
  // Find the upper-leftmost point as the reference point O
  const pointO = findUpperLeftmostPoint(convexHull);

  // Calculate angles and create an array of objects {point, angle}
  const angles = convexHull.map((pointB) => {
    const angle = Math.atan2(pointB.y - pointO.y, pointB.x - pointO.x);
    return { point: pointB, angle: angle };
  });

  // Sort the array based on angles
  angles.sort((a, b) => a.angle - b.angle);

  // Extract and return the sorted points
  const sortedPoints = angles.map((item) => item.point);
  return sortedPoints;
}

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
}

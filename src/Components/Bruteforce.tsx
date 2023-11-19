import { useEffect, useState } from 'react';
import { Point, useDrawingContext } from '../Context.ts/DrawingContext';
import { useLoading } from '../Context.ts/LoadingContext';

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const BaseCaseBruteForce = () => {
  const { addLinePoint, points } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    const calcConvexHull = async () => {
      const hull: Point[] = [];
      console.log('points ', points);
      for (let i = 0; i < points.length; i++) {
        if (hull.some((hullPoint) => hullPoint === points[i])) continue;
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
            } else break;
          }
          if (upper === points.length - 2 || lower === points.length - 2) {
            hull.push(points[j]);
            hull.push(points[i]);
            addLinePoint(points[j]);
            await sleep(1000);
            addLinePoint(points[i]);
            await sleep(1000);
          }
        }
      }
    };
    showLoading();
    calcConvexHull().then(() => {
      hideLoading();
    });
  }, []);

  console.log('points ', points);

  return <div />;
};

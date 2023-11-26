import { useEffect, useState } from 'react';
import { Point, useDrawingContext } from '../Context.ts/DrawingContext';
import { Operation, sleep } from './Service/Operations';
import Modal from './Modal';
import { useLoading } from '../Context.ts/LoadingContext';
import { LineIntersectionType } from './PointsForm';

const intersectionByOrientation = (points: Point[]) => {
  const test1 =
    Operation.ccw(points[0], points[1], points[2]) *
    Operation.ccw(points[0], points[1], points[3]);
  const test2 =
    Operation.ccw(points[2], points[3], points[0]) *
    Operation.ccw(points[2], points[3], points[1]);
  return test1 <= 0 && test2 <= 0;
};
const intersectionByCrossProduct = (p: Point[]) => {
  const [p1, q1, p2, q2] = p;
  let ac = { x: q1.x - p1.x, y: q1.y - p1.y };
  let ad = { x: p2.x - p1.x, y: p2.y - p1.y };
  let bc = { x: q2.x - p1.x, y: q2.y - p1.y };

  let cross1 = Operation.crossProduct(ac, ad);
  let cross2 = Operation.crossProduct(ac, bc);

  ac = { x: q2.x - p2.x, y: q2.y - p2.y };
  ad = { x: p1.x - p2.x, y: p1.y - p2.y };
  bc = { x: q1.x - p2.x, y: q1.y - p2.y };

  let cross3 = Operation.crossProduct(ac, ad);
  let cross4 = Operation.crossProduct(ac, bc);

  return cross1 * cross2 < 0 && cross3 * cross4 < 0;
};
const intersectionByBoundingBox = (p: Point[]) => {
  const [p1, q1, p2, q2] = p;
  return Operation.boundingBoxIntersect(p1, q1, p2, q2);
};

const LineIntersection = ({ method }: { method: LineIntersectionType }) => {
  const { points, retry, resetSolve } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  const [modalContent, setModalContent] = useState<string>('');
  const hideModal = () => {
    setModalContent('');
    // addPoints([]);
  };

  useEffect(() => {
    const findIntersection = async () => {
      if (points.length > 1 && retry) {
        switch (method) {
          case 'orientation':
            if (points.length !== 4) {
              setModalContent('INVALID_POINTS');
              return;
            }
            showLoading();
            if (intersectionByOrientation(points)) {
              await sleep(1000);

              setModalContent('INTERSECTION');
            } else {
              await sleep(1000);
              setModalContent('DO_NOT_INTERSECT');
            }
            resetSolve();
            hideLoading();
            break;
          case 'boundingBox':
            if (points.length !== 4) {
              setModalContent('INVALID_POINTS');
              return;
            }
            showLoading();
            if (intersectionByBoundingBox(points)) {
              await sleep(1000);

              setModalContent('INTERSECTION');
            } else {
              await sleep(1000);
              setModalContent('DO_NOT_INTERSECT');
            }
            resetSolve();
            hideLoading();
            break;
          case 'crossProduct':
            if (points.length !== 4) {
              setModalContent('INVALID_POINTS');
              return;
            }
            showLoading();
            if (intersectionByCrossProduct(points)) {
              await sleep(1000);

              setModalContent('INTERSECTION');
            } else {
              await sleep(1000);
              setModalContent('DO_NOT_INTERSECT');
            }
            resetSolve();
            hideLoading();
            break;
          default:
            break;
        }
      }
    };
    findIntersection();
  }, [points, retry]);

  return (
    <div>
      {!!modalContent && (
        <Modal modalContent={modalContent} hideModal={hideModal} />
      )}
    </div>
  );
};

export default LineIntersection;

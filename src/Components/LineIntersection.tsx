import { useEffect, useState } from 'react';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import { Operation, sleep } from './Service/Operations';
import Modal from './Modal';
import { useLoading } from '../Context.ts/LoadingContext';

const LineIntersection = () => {
  const { points, retry, resetSolve } = useDrawingContext();
  const { showLoading, hideLoading } = useLoading();
  const [modalContent, setModalContent] = useState<string>('');
  const hideModal = () => {
    setModalContent('');
    // addPoints([]);
  };
  const intersection = () => {
    const test1 =
      Operation.ccw(points[0], points[1], points[2]) *
      Operation.ccw(points[0], points[1], points[3]);
    const test2 =
      Operation.ccw(points[2], points[3], points[0]) *
      Operation.ccw(points[2], points[3], points[1]);
    return test1 <= 0 && test2 <= 0;
  };
  useEffect(() => {
    const findIntersection = async () => {
      if (points.length > 1 && retry) {
        showLoading();
        if (intersection()) {
          await sleep(1000);

          setModalContent('INTERSECTION');
          return;
        } else {
          await sleep(1000);
          setModalContent('DO_NOT_INTERSECT');
        }
        resetSolve();
        hideLoading();
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

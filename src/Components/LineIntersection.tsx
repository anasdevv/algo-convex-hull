import { useEffect, useState } from 'react';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import { Operation } from './Service/Operations';
import Modal from './Modal';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LineIntersection = () => {
  const { points, addPoints } = useDrawingContext();
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
      if (points.length > 1) {
        if (intersection()) {
          await sleep(1000);

          setModalContent('INTERSECTION');
          return;
        } else {
          await sleep(1000);
          setModalContent('DO_NOT_INTERSECT');
        }
      }
    };
    findIntersection();
  }, [points]);

  return (
    <div>
      {!!modalContent && (
        <Modal modalContent={modalContent} hideModal={hideModal} />
      )}
    </div>
  );
};

export default LineIntersection;

import { useActiveState } from '../Context.ts/ActiveContex';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import { BaseCaseBruteForce } from './Bruteforce';
import { useState, useCallback, useRef } from 'react';
import p5 from 'p5';
import JarvisMarch from './JarvisMarch';
import GrhamScan from './GrhamScan';
import QuickHull from './QuickHull';
import {
  Point,
  generateGaussianRandomPoints,
  generateRandomPoints,
  generateSphericalRandomPoints,
  generateUniformRandomPoints,
} from './Service/Operations';
import Spinner from './Spinner';
import { useLoading } from '../Context.ts/LoadingContext';
import LineIntersection from './LineIntersection';
import QuickElimination from './QuickElimination';
import { sleep } from './Service/Operations';

// todo refactor and error handling

const removeLeadingZeros = (input: any) => {
  const sanitizedInput = input.replace(/^0+/, '');
  return sanitizedInput === '' ? undefined : Number(sanitizedInput);
};
type PointsType = 'random' | 'uniform' | 'spherical' | 'gaussain';
export type LineIntersectionType =
  | 'crossProduct'
  | 'orientation'
  | 'boundingBox';

export const PointsForm = ({ p5 }: { p5: p5 | null }) => {
  const [numberOfPoints, setNumberOfPoints] = useState<number | undefined>(
    undefined
  );
  const [lineIntersectionType, setLineIntersectionType] =
    useState<LineIntersectionType>('orientation');
  const [pointsType, setPointsType] = useState<PointsType>('random');
  const [method, setMethod] = useState<boolean>(false);
  const [pointsGenLoading, setPointsGenLoading] = useState<boolean>(false);
  const {
    addPoints,
    resetLinePoints,
    points,
    linePoints,
    addLinePoints,
    addPoint,
    toggleRetry,
    setSolve,
    resetQuickHullPoints,
  } = useDrawingContext();
  // only for lines
  const pX1Ref = useRef<HTMLInputElement>(null);
  const pY1Ref = useRef<HTMLInputElement>(null);
  const pX2Ref = useRef<HTMLInputElement>(null);
  const pY2Ref = useRef<HTMLInputElement>(null);
  const { active } = useActiveState();
  const { loading } = useLoading();
  const getPoints = (pointsType: PointsType, numberOfPoints: number) => {
    if (pointsType === 'uniform')
      return generateUniformRandomPoints(
        10,
        1000,
        10,
        550,
        numberOfPoints as number
      );
    else if (pointsType === 'spherical') {
      const containerElement = document.getElementById('parent'); // Replace with your actual container ID
      const containerWidth = containerElement?.clientWidth! - 10;
      const containerHeight = window.innerHeight - 100;
      return generateSphericalRandomPoints(
        270,
        numberOfPoints as number,
        containerWidth,
        containerHeight
      );
    } else if (pointsType === 'gaussain') {
      const containerElement = document.getElementById('parent'); // Replace with your actual container ID
      const containerWidth = containerElement?.clientWidth! - 10;
      const containerHeight = window.innerHeight - 100;
      return generateGaussianRandomPoints(
        containerWidth / 2 - 500,
        containerWidth / 2 + 500,
        containerHeight / 2 - 250,
        containerHeight / 2 + 200,
        numberOfPoints as number
      );
    } else {
      return generateRandomPoints(numberOfPoints as number);
    }
  };
  const handleGeneratePoints = async () => {
    if (active === 'line') {
      if (
        !pX1Ref.current?.value ||
        !pY1Ref.current?.value ||
        !pX2Ref.current?.value ||
        !pY2Ref.current?.value
      )
        return;
      addPoint({
        x: Number(pX1Ref.current?.value),
        y: Number(pY1Ref.current?.value),
      });
      addPoint({
        x: Number(pX2Ref.current?.value),
        y: Number(pY2Ref.current?.value),
      });
      pX1Ref.current.value = '';
      pY1Ref.current.value = '';
      pX2Ref.current.value = '';
      pY2Ref.current.value = '';
    } else {
      if (numberOfPoints && numberOfPoints > 0) {
        setPointsGenLoading(true);
        handleClear();
        const points = new Set(
          getPoints(pointsType, numberOfPoints) as Point[]
        );
        await sleep(200);
        addPoints([...points]);
        setPointsGenLoading(false);
        console.log('points added');
        // setNumberOfPoints(0);
      }
    }
  };
  console.log('active ', active);
  const renderActiveComponent = useCallback(() => {
    if (active === 'bruteForce') {
      return <BaseCaseBruteForce />;
    } else if (active === 'jarvisMarch') {
      return <JarvisMarch />;
    } else if (active === 'grahamScan') {
      return <GrhamScan />;
    } else if (active === 'quickHull') {
      return <QuickHull />;
    } else if (active === 'quickElimination' && points?.length > 0) {
      return <QuickElimination />;
    } else if (active === 'line') {
      return <LineIntersection method={lineIntersectionType} />;
    }
    // Add more conditions for other components if needed
    return <div />;
  }, [active]);
  const isDisabled = loading || pointsGenLoading;
  const handleSubmit = () => {
    if (method) setMethod(false);
    setMethod(true);
    if (active === 'line') {
      setSolve();
    }
  };
  const handleClear = () => {
    setNumberOfPoints(0);
    addPoints([]);
    if (active === 'quickElimination') resetQuickHullPoints();
    setMethod(() => false);
    if (p5) {
      setTimeout(() => {
        resetLinePoints();
        p5.clear(0, 0, 0, 0);
      }, 0); // You can adjust the delay as needed
    }
  };
  return (
    <div>
      {method && renderActiveComponent()}
      <div className='sm:col-span-4'>
        {active !== 'line' ? (
          <div>
            <label
              htmlFor='no_of_points'
              className='block text-base font-medium leading-6 text-gray-200 '
            >
              Number of random points
            </label>
            <div className='my-2 flex flex-col'>
              <input
                value={numberOfPoints}
                id='no_of_points'
                name='no_of_points'
                type='number'
                onChange={(e) =>
                  setNumberOfPoints(removeLeadingZeros(e.target.value))
                }
                placeholder='Enter number of points'
                required
                className='block w-full rounded-md border-0 py-1.5 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 text-base pl-3 bg-gray-900'
              />
            </div>
          </div>
        ) : (
          <div className='flex flex-col mb-3'>
            <label
              htmlFor='line_points'
              className='block text-base font-medium leading-6 text-gray-200 '
            >
              Enter coordinates for line
            </label>
            <div className='flex space-x-3 mt-1'>
              <div className='flex flex-col space-y-1'>
                <label htmlFor='' className='pl-5 text-gray-200 text-base'>
                  Point 1
                </label>
                <div className='flex space-x-2'>
                  <input
                    type='number'
                    placeholder='x'
                    disabled={active === 'line' && points.length >= 4}
                    ref={pX1Ref}
                    name='p_x_1'
                    id='p_x_1'
                    className='w-2/6 block rounded-md border-0 py-1.5 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 text-base pl-3 bg-gray-900'
                  />
                  <input
                    type='number'
                    placeholder='y'
                    disabled={active === 'line' && points.length >= 4}
                    ref={pY1Ref}
                    name='p_y_1'
                    id='p_y_1'
                    className='w-2/6 block rounded-md border-0 py-1.5 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 text-base pl-3 bg-gray-900'
                  />
                </div>
              </div>
              <div className='flex flex-col space-y-1'>
                <label htmlFor='' className='pl-5 text-gray-200 text-base'>
                  Point 2
                </label>
                <div className='flex space-x-2'>
                  <input
                    type='number'
                    disabled={active === 'line' && points.length >= 4}
                    placeholder='x'
                    ref={pX2Ref}
                    name='p_x_2'
                    id='p_x_2'
                    className='w-2/6 block rounded-md border-0 py-1.5 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 text-base pl-3 bg-gray-900'
                  />
                  <input
                    type='number'
                    disabled={active === 'line' && points.length >= 4}
                    placeholder='y'
                    ref={pY2Ref}
                    name='p_x_2'
                    id='p_x_2'
                    className='w-2/6 block rounded-md border-0 py-1.5 text-slate-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 text-base pl-3 bg-gray-900'
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {active !== 'line' ? (
          <fieldset className='pb-2'>
            <legend className='text-base font-semibold leading-6 text-white'>
              Distribution of generated points
            </legend>
            <div className='mt-2 space-y-3'>
              <div className='flex items-center gap-x-3'>
                <input
                  id='random'
                  name='random'
                  type='radio'
                  checked={pointsType === 'random'}
                  onChange={() => setPointsType('random' as PointsType)}
                  className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                />
                <label
                  htmlFor='random'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Random
                </label>
              </div>
              <div className='flex items-center gap-x-3'>
                <input
                  id='unifrom'
                  name='unifrom'
                  type='radio'
                  checked={pointsType === 'uniform'}
                  onChange={() => setPointsType('uniform' as PointsType)}
                  className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                />
                <label
                  htmlFor='unifrom'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Uniform
                </label>
              </div>
              <div className='flex items-center gap-x-3'>
                <input
                  id='spherical'
                  name='spehrical'
                  type='radio'
                  checked={pointsType === 'spherical'}
                  onChange={() => setPointsType('spherical' as PointsType)}
                  className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                />
                <label
                  htmlFor='spherical'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Spherical
                </label>
              </div>
              <div className='flex items-center gap-x-3'>
                <input
                  id='gaussain'
                  name='gaussain'
                  type='radio'
                  checked={pointsType === 'gaussain'}
                  onChange={() => setPointsType('gaussain' as PointsType)}
                  className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                />
                <label
                  htmlFor='gaussain'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Gaussian
                </label>
              </div>
            </div>
          </fieldset>
        ) : (
          <fieldset className='pb-2'>
            <legend className='text-base font-semibold leading-6 text-white'>
              Type of Line Intersection
            </legend>
            <div className='mt-2 space-y-3'>
              <div className='flex items-center gap-x-3'>
                <input
                  id='crossProduct'
                  name='crossProduct'
                  type='radio'
                  checked={lineIntersectionType === 'crossProduct'}
                  onChange={() => setLineIntersectionType('crossProduct')}
                  className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                />
                <label
                  htmlFor='crossProduct'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Cross Product
                </label>
              </div>
              <div className='flex items-center gap-x-3'>
                <input
                  id='orientation'
                  name='orientation'
                  type='radio'
                  checked={lineIntersectionType === 'orientation'}
                  onChange={() => setLineIntersectionType('orientation')}
                  className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                />
                <label
                  htmlFor='orientation'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Orientation
                </label>
              </div>
              <div className='flex items-center gap-x-3'>
                <input
                  id='boundingBox'
                  name='boundingBox'
                  type='radio'
                  checked={lineIntersectionType === 'boundingBox'}
                  onChange={() => setLineIntersectionType('boundingBox')}
                  className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
                />
                <label
                  htmlFor='boundingBox'
                  className='block text-sm font-medium leading-6 text-white'
                >
                  Bounding Box
                </label>
              </div>
            </div>
          </fieldset>
        )}
        <button
          type='submit'
          disabled={
            pointsGenLoading ||
            loading ||
            (active === 'line' && linePoints.length >= 4)
          }
          onClick={handleGeneratePoints}
          className={`rounded-md flex items-center justify-center w-full bg-[#7E22CE] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-00 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-blue-800 ${
            isDisabled && 'cursor-not-allowed'
          }`}
        >
          {/* #7E22CE */}
          {pointsGenLoading && <Spinner />}
          {active === 'line' ? 'Draw' : 'Generate'}
        </button>
      </div>
      {active === 'line' && (
        <div className='items-center my-5 w-full'>
          <button
            className={`items-center justify-center flex rounded-md w-full bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-00 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-[#6D28D9] ${
              isDisabled && 'cursor-not-allowed'
            }`}
            onClick={() => {
              const points = generateRandomPoints(4);
              addPoints(points);
            }}
          >
            Draw Random Lines
            <svg
              className='rtl:rotate-180 w-3.5 h-3.5 ms-2'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M1 5h12m0 0L9 1m4 4L9 9'
              />
            </svg>
          </button>
          <button
            onClick={() => {
              const p = points;
              const lp = linePoints;
              handleClear();
              addPoints(p);
              addLinePoints(lp);
              console.log('lp ', lp);
              setMethod(true);
              toggleRetry();
            }}
          >
            redraw
          </button>
        </div>
      )}

      <div className='mt-6 flex items-center justify-between gap-x-6 w-full'>
        <button
          type='button'
          disabled={pointsGenLoading || loading || points.length === 0}
          onClick={() => {
            handleClear();
          }}
          className={`w-2/4 text-sm font-semibold leading-6 text-white bg-gray-700 px-3 py-2 rounded-md shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 ${
            isDisabled && points.length === 0 && 'cursor-not-allowed'
          }`}
        >
          Clear
        </button>
        <button
          type='submit'
          onClick={handleSubmit}
          disabled={
            loading ||
            pointsGenLoading ||
            (active !== 'line' && points.length <= 0)
          }
          className={`w-2/4 flex items-center justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 ${
            isDisabled || points.length <= 0 ? 'cursor-not-allowed' : ''
          }`}
        >
          {loading && <Spinner />}
          Solve
        </button>
      </div>
    </div>
  );
};

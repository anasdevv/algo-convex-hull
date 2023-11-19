import { Disclosure, Transition } from '@headlessui/react';
import { useDrawingContext } from '../Context.ts/DrawingContext';
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useActiveState } from '../Context.ts/ActiveContex';

type ConvexHullAlgorithm = {
  id:
    | 'jarvisMarch'
    | 'bruteForce'
    | 'divideAndConquer'
    | 'quickHull'
    | 'grahamScan'
    | 'line';

  name: string;
  description: string;
  complexity: string;
  link: string;
};
const convexHullAlgorithms: ConvexHullAlgorithm[] = [
  {
    id: 'bruteForce',
    name: 'Brute Force',
    description:
      'Also known as the gift wrapping algorithm, it iteratively selects the point with the smallest polar angle with respect to the current point.',
    complexity: 'O(nh)',
    link: 'https://en.wikipedia.org/wiki/Gift_wrapping_algorithm',
  },
  {
    id: 'jarvisMarch',
    name: 'Jarvis March',
    description:
      'Also known as the gift wrapping algorithm, it iteratively selects the point with the smallest polar angle with respect to the current point.',
    complexity: 'O(nh)',
    link: 'https://en.wikipedia.org/wiki/Gift_wrapping_algorithm',
  },
  {
    id: 'grahamScan',
    name: 'Graham Scan',
    description:
      'It first selects the point with the lowest y-coordinate, and then sorts the remaining points by polar angle with respect to that point. It then iterates over the sorted points, keeping only those that form a left turn.',
    complexity: 'O(n log n)',
    link: 'https://en.wikipedia.org/wiki/Graham_scan',
  },
  {
    id: 'quickHull',
    name: 'QuickHull',
    description:
      'It recursively divides the set of points into two subsets, one on each side of a line connecting the two extreme points. It then finds the furthest point from that line, and adds it to the hull. The process is repeated for the two subsets until no more points remain.',
    complexity: 'O(n log n)',
    link: 'https://en.wikipedia.org/wiki/Quickhull',
  },
  {
    id: 'line',
    name: 'Line',
    description:
      'It recursively divides the set of points into two subsets, one on each side of a line connecting the two extreme points. It then finds the furthest point from that line, and adds it to the hull. The process is repeated for the two subsets until no more points remain.',
    complexity: 'O(n log n)',
    link: 'https://en.wikipedia.org/wiki/Quickhull',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
const Card = ({ name, complexity, description, link }: ConvexHullAlgorithm) => {
  return (
    <div className='max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700'>
      <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
        {name}
      </h5>
      <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
        {description}
      </p>
      <a
        href={link}
        target='_blank'
        className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        Read more
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
      </a>
    </div>
  );
};
export default function Navbar() {
  const { addLinePoints, addPoints } = useDrawingContext();

  const { active, setIsActive } = useActiveState();
  console.log(active);
  return (
    <div className='bg-gray-800'>
      <div className='mx-auto px-2 sm:px-6 lg:px-3'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='flex items-center justify-start sm:items-stretch sm:justify-start w-full pt-4'>
            <div className='flex flex-shrink-0 items-center justify-start'>
              <div className='flex items-center ps-2.5 mb-5'>
                <img
                  src='https://flowbite.com/docs/images/logo.svg'
                  className='h-6 me-3 sm:h-7'
                  alt='Flowbite Logo'
                />
                <h1 className='text-slate-300  hover:text-white rounded-md p-2 text-2xl font-medium flex items-center'>
                  Convex Hull
                </h1>
              </div>
            </div>
            <div className='hidden sm:ml-6 sm:block w-full'>
              <div className='flex items-center justify-evenly'>
                {convexHullAlgorithms.map((algorithm) => (
                  <div key={algorithm.id} className='relative'>
                    <Disclosure>
                      {({ open }) => (
                        <div className='flex items-center justify-start pt-2'>
                          <button
                            onClick={() => {
                              setIsActive(algorithm.id);
                              addLinePoints([]);
                              if (algorithm.id === 'line') addPoints([]);
                            }}
                            className={` hover:bg-gray-700 hover:text-white cursor-pointer rounded-md p-2 text-sm font-medium flex items-center ${
                              algorithm.id === active
                                ? 'bg-gray-700 text-white '
                                : 'text-gray-300'
                            }`}
                          >
                            {algorithm.name}
                          </button>
                          <Disclosure.Button className='text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-1 text-sm font-medium flex items-center pl-0'>
                            <ChevronDownIcon
                              className={classNames(
                                open ? 'transform rotate-180' : '',
                                'h-4 w-4 ml-2 text-gray-400 transition-transform duration-200'
                              )}
                            />
                          </Disclosure.Button>
                          <Transition
                            show={open}
                            enter='transition ease-out duration-100 transform'
                            enterFrom='scale-95 opacity-0'
                            enterTo='scale-100 opacity-100'
                            leave='transition ease-in duration-75 transform'
                            leaveFrom='scale-100 opacity-100'
                            leaveTo='scale-95 opacity-0'
                          >
                            <Disclosure.Panel
                              static
                              className='absolute top-7 z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-sm sm:px-0'
                            >
                              {/* <div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden'>
                                <div className='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8'>
                                  <p>{algorithm.description}</p>
                                  <p>Complexity: {algorithm.complexity}</p>
                                  <a
                                    href={algorithm.link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    Learn more
                                  </a>
                                </div>
                              </div> */}
                              <Card {...algorithm} />
                            </Disclosure.Panel>
                          </Transition>
                        </div>
                      )}
                    </Disclosure>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// // import React, { useState } from 'react';
// import { useActiveState } from '../Context.ts/ActiveContex';

// // const navigation = [
// //   { name: 'Dashboard', href: '#', current: true },
// //   { name: 'Team', href: '#', current: false },
// //   { name: 'Projects', href: '#', current: false },
// //   { name: 'Calendar', href: '#', current: false },
// // ];

// // export default function Navbar() {
// //   // const { active, setIsActive } = useActiveState();
// //   return (
// //     <nav className='bg-gray-800'>
// //       <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
// //         <div className='relative flex h-16 items-center justify-between'>
// //           <div className='flex items-center justify-center sm:items-stretch sm:justify-start'>
// //             <div className='flex flex-shrink-0 items-center'>
// //               <img
// //                 className='h-8 w-auto'
// //                 src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
// //                 alt='Your Company'
// //               />
// //             </div>
// //             <div className='hidden sm:ml-6 sm:block'>
// //               <div className='flex space-x-4'>
// //                 {navigation.map((item) => (
// //                   <a
// //                     key={item.name}
// //                     // onClick={}
// //                     className={classNames(
// //                       item.current
// //                         ? 'bg-gray-900 text-white'
// //                         : 'text-gray-300 hover:bg-gray-700 hover:text-white',
// //                       'rounded-md px-3 py-2 text-sm font-medium'
// //                     )}
// //                     aria-current={item.current ? 'page' : undefined}
// //                   >
// //                     {item.name}
// //                   </a>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }
// import { Disclosure, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import {
//   Bars3Icon,
//   BellIcon,
//   ChevronDownIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';

// // const navigation = [
// //   { name: 'Dashboard', href: '#', current: true },
// //   { name: 'Team', href: '#', current: false },
// //   { name: 'Projects', href: '#', current: false },
// //   { name: 'Calendar', href: '#', current: false },
// // ];
// const navigation = [
//   {
//     id: 'jarvisMarch',
//     name: 'Jarvis March',
//     description:
//       'Also known as the gift wrapping algorithm, it iteratively selects the point with the smallest polar angle with respect to the current point.',
//     complexity: 'O(nh)',
//     link: 'https://en.wikipedia.org/wiki/Gift_wrapping_algorithm',
//   },
//   {
//     id: 'grahamScan',
//     name: 'Graham Scan',
//     description:
//       'It first selects the point with the lowest y-coordinate, and then sorts the remaining points by polar angle with respect to that point. It then iterates over the sorted points, keeping only those that form a left turn.',
//     complexity: 'O(n log n)',
//     link: 'https://en.wikipedia.org/wiki/Graham_scan',
//   },
//   {
//     id: 'quickHull',
//     name: 'QuickHull',
//     description:
//       'It recursively divides the set of points into two subsets, one on each side of a line connecting the two extreme points. It then finds the furthest point from that line, and adds it to the hull. The process is repeated for the two subsets until no more points remain.',
//     complexity: 'O(n log n)',
//     link: 'https://en.wikipedia.org/wiki/Quickhull',
//   },
// ];

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(' ');
// }

// export default function Navbar() {
//   const { active, setIsActive } = useActiveState();

//   return (
//     <div className='bg-gray-800'>
//       <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
//         <div className='relative flex h-16 items-center justify-start'>
//           <div className='flex items-center justify-evenly sm:items-stretch sm:justify-start'>
//             <div className='flex flex-shrink-0 items-center'>
//               <img
//                 className='h-8 w-auto'
//                 src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
//                 alt='Your Company'
//               />
//             </div>
//             <div className='hidden sm:ml-6 sm:block'>
//               <div className='flex space-x-4'>
//                 {navigation.map((item) => (
//                   <Disclosure key={item.name} as='div' className='relative'>
//                     {({ open }) => (
//                       <>
//                         <Disclosure.Button
//                           className={classNames(
//                             item.id === active
//                               ? 'bg-gray-900 text-white'
//                               : 'text-gray-300 hover:bg-gray-700 hover:text-white',
//                             'rounded-md px-3 py-2 text-sm font-medium flex items-center'
//                           )}
//                         >
//                           {item.name}
//                           <ChevronDownIcon
//                             className={classNames(
//                               open ? 'transform rotate-180' : '',
//                               'h-4 w-4 ml-2 text-gray-400 transition-transform duration-200'
//                             )}
//                           />
//                         </Disclosure.Button>
//                         <Transition
//                           show={open}
//                           enter='transition ease-out duration-100 transform'
//                           enterFrom='scale-95 opacity-0'
//                           enterTo='scale-100 opacity-100'
//                           leave='transition ease-in duration-75 transform'
//                           leaveFrom='scale-100 opacity-100'
//                           leaveTo='scale-95 opacity-0'
//                         >
//                           <Disclosure.Panel className='absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-sm sm:px-0'>
//                             <div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden'>
//                               <div className='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8'>
//                                 {/* Add content for each disclosure panel */}
//                                 {/* For example, you can add links or other elements here */}
//                               </div>
//                             </div>
//                           </Disclosure.Panel>
//                         </Transition>
//                       </>
//                     )}
//                   </Disclosure>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

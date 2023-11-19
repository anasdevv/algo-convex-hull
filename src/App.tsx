import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { useState } from 'react';
import P5Canvas from './Components/Draw';
import p5 from 'p5';
import { useActiveState } from './Context.ts/ActiveContex';
import Lines from './Components/DrawLine';
import Banner from './Components/Banner';

//
export default function App() {
  const [p5Instance, setP5Instance] = useState<p5 | null>(null);
  const { active } = useActiveState();
  return (
    <>
      <div className='flex flex-col'>
        <Navbar />
        {active === 'line' && <Banner />}
        <div className='bg-gray-900 w-full h-[91vh] flex'>
          <Sidebar p5={p5Instance} />
          <div className='w-3/4 h-full' id='parent'>
            <P5Canvas setP5Instance={setP5Instance} />
          </div>
        </div>
      </div>
    </>
  );
}

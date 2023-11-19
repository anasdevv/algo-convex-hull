import { PointsForm } from './PointsForm';
import p5 from 'p5';
const Sidebar = ({ p5 }: { p5: p5 | null }) => {
  return (
    <div className='flex'>
      <aside
        id='logo-sidebar'
        className='top-0 left-0 w-[45vh] h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 py-4 overflow-y-hidden bg-gray-800 flex flex-col'>
          <PointsForm p5={p5} />
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

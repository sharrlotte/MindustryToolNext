'use client';
import { Stage, Layer, Line, Rect } from 'react-konva';
import Command, { } from './command';

const commands: Command[] = [];
const nowSaveSlot: string | null = null;

function initSaveTest() {
  if (!localStorage.getItem('lgs-test01')) {
    localStorage.setItem('lgs-test01', 'meow');
  }
}

function getAllSaveSlots() {
  const saves: string[] = [];
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.slice(0, 4) === "lgs-") {
      saves.push(key.slice(4));
    }
  });

  return saves;
}





export default function Logic() {
  initSaveTest();

  return (
    <div className='flex w-full h-full'>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 40}
      >
        <Layer>
          {/* Bạn có thể thêm các thành phần Line, Rect, hoặc bất kỳ thứ gì khác vào đây */}
        </Layer>
      </Stage>

      <nav className='flex fixed flex-col top-nav left-0 w-[300px] bg-[#aaaa] backdrop-blur-sm p-2 rounded-xl'>
        {/* Nội dung của thanh điều hướng bên trái */}
      </nav>

      <nav id='rnv' className='flex fixed flex-col top-nav right-0 w-[300px] h-full bg-[#aaaa] backdrop-blur-sm p-2 gap-2 overflow-y-auto	 rounded-xl'>
        <header
          className='flex w-full p-2 bg-[#555] rounded-xl'
          onClick={() => {
            document.getElementById('rnt')?.classList.toggle('hidden');
            document.getElementById('rnv')?.classList.toggle('h-full')
          }}
        >
          <p>Click here to toggle</p>
        </header>

        <div id="rnt" className='w-full'>
          <section className='flex flex-col w-full h-60 p-2 pl-4 pr-4 bg-[#555] rounded-xl'>
            <p className='flex w-full pb-2 justify-center overflow-y-auto'>Working saves</p>
            <ul className='flex w-full list-none'>
              {getAllSaveSlots().map((saveName, index) => (
                <div key={`rss${index}`} className='flex w-full flex-row items-center justify-between'>
                  <p key={`rssn${index}`} >{saveName}</p>
                  <button key={`rssb${index}`} className='bg-[#aaaa] p-1 pl-2 pr-2 rounded-2xl'>{'use save'}</button>
                </div>
              ))}
            </ul>
          </section>

        </div>
      </nav>
    </div>
  )
}



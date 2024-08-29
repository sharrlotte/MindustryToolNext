'use client';
import { Stage, Layer } from 'react-konva';
import Command from './command';

const commands: Command[] = [];
const nowSaveSlot: string | null = null;

function initSaveTest() {
  if (!localStorage.getItem('lgs-test01')) {
    localStorage.setItem('lgs-test01', 'meow');
  }
}

// NOT CLEAN
function getAllSaveSlots() {
  const saves: string[] = [];
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.slice(0, 4) === 'lgs-') {
      saves.push(key.slice(4));
    }
  });

  return saves;
}

// CLEAN

const SAVE_SLOT_KEY_PREFIX = 'save-';

function isSaveData(key: string) {
  return key.startsWith(SAVE_SLOT_KEY_PREFIX);
}

function _getAllSaveSlots() {
  return Object.keys(localStorage).filter(isSaveData);
}

export default function Logic() {
  initSaveTest();

  return (
    <div className="flex h-full w-full">
      <Stage width={window.innerWidth} height={window.innerHeight - 40}>
        <Layer>
          {/* Bạn có thể thêm các thành phần Line, Rect, hoặc bất kỳ thứ gì khác vào đây */}
        </Layer>
      </Stage>

      <nav className="fixed left-0 top-nav flex w-[300px] flex-col rounded-xl bg-[#aaaa] p-2 backdrop-blur-sm">
        {/* Nội dung của thanh điều hướng bên trái */}
      </nav>

      <nav
        id="rnv"
        className="fixed right-0 top-nav flex h-full w-[300px] flex-col gap-2 overflow-y-auto rounded-xl bg-[#aaaa] p-2	 backdrop-blur-sm"
      >
        <header
          className="flex w-full rounded-xl bg-[#555] p-2"
          onClick={() => {
            document.getElementById('rnt')?.classList.toggle('hidden');
            document.getElementById('rnv')?.classList.toggle('h-full');
          }}
        >
          <p>Click here to toggle</p>
        </header>

        <div id="rnt" className="w-full">
          <section className="flex h-60 w-full flex-col rounded-xl bg-[#555] p-2 pl-4 pr-4">
            <p className="flex w-full justify-center overflow-y-auto pb-2">
              Working saves
            </p>
            <ul className="flex w-full list-none">
              {getAllSaveSlots().map((saveName, index) => (
                <div
                  key={`rss${index}`}
                  className="flex w-full flex-row items-center justify-between"
                >
                  <p key={`rssn${index}`}>{saveName}</p>
                  <button
                    key={`rssb${index}`}
                    className="rounded-2xl bg-[#aaaa] p-1 pl-2 pr-2"
                  >
                    {'use save'}
                  </button>
                </div>
              ))}
            </ul>
          </section>
        </div>
      </nav>
    </div>
  );
}

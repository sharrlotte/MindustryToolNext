import IdUserCard from '@/components/user/id-user-card';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="grid h-full overflow-y-auto p-8 pt-10">
      <section className="rounded-2xl bg-zinc-800 bg-opacity-90 p-8">
        <span className="text-2xl text-white">Chào mừng đến với </span>
        <Link
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent"
          href="/"
        >
          MINDUSTRYTOOL
        </Link>
        <section className="flex flex-col gap-4 p-4">
          <b className="text-white">Tải game miễn phí?</b>
          <ul>
            <li>
              <a
                className="text-emerald-500 hover:text-emerald-500"
                href="https://anuke.itch.io/mindustry?fbclid=IwAR2HgdkixMrQEDhcj1an_qtWnnq6YmOlm-c8VoyPsNp5bMtu5aWq_ff7K2M"
                target="_blank"
                rel="noopener noreferrer"
              >
                Itch.io
              </a>
            </li>
            <li>
              <Link
                className="text-emerald-500 hover:text-emerald-500"
                href="/posts/64ca803ea51a933422a49aac"
              >
                Cách tải game miễn phí
              </Link>
            </li>
            <li>
              <Link
                className="text-emerald-500 hover:text-emerald-500"
                href="/posts/6520298fa61f817d3a535be4"
              >
                Cách chơi chung với bạn bè
              </Link>
            </li>
          </ul>
          <b className="text-white">Muốn tìm người chơi game cùng?</b>
          <ul>
            <li>
              <a
                className="text-emerald-500 hover:text-emerald-500"
                href="https://discord.gg/mindustry"
                target="_blank"
                rel="noopener noreferrer"
              >
                Máy chủ discord Mindustry chính chủ
              </a>
            </li>
            <li>
              <a
                className="text-emerald-500 hover:text-emerald-500"
                href="https://discord.gg/DCX5yrRUyp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Máy chủ discord Mindustry Việt Nam
              </a>
            </li>
            <li>
              <a
                className="text-emerald-500 hover:text-emerald-500"
                href="https://www.reddit.com/r/Mindustry"
                target="_blank"
                rel="noopener noreferrer"
              >
                Reddit r/Mindustry
              </a>
            </li>
          </ul>
          <b className="text-white">
            Kênh Youtube về Mindustry dành cho người Việt Nam
          </b>
          <ul>
            <li>
              <a
                className="text-emerald-500 hover:text-emerald-500"
                href="https://www.youtube.com/@FourGamingStudio"
                target="_blank"
                rel="noopener noreferrer"
              >
                Four Gaming Studio
              </a>
            </li>
          </ul>
          <b className="text-white">Tìm kiếm bản thiết kế?</b>
          <ul>
            <li>
              <a
                className="text-emerald-500 hover:text-emerald-500"
                href="/schematic"
              >
                Schematic
              </a>
            </li>
          </ul>
          <b className="text-white">Tìm kiếm bản đồ?</b>
          <ul>
            <li>
              <a
                className="text-emerald-500 hover:text-emerald-500"
                href="/map"
              >
                Map
              </a>
            </li>
          </ul>
          <b> Thông tin về Website</b>
          <ul className="grid grid-cols-1 items-start justify-start gap-y-2 md:grid-cols-2">
            <p className="list-item whitespace-nowrap">Chủ trang web </p>
            <IdUserCard id="64b63239e53d0c354d505733" />
            <p className="list-item whitespace-nowrap">Quản trị viên</p>
            <div className="grid gap-1">
              <IdUserCard id="64b6def5fa35080d51928849" />
              <IdUserCard id="64b8c74b2ab2c664a63d9f0d" />
              <IdUserCard id="64ba2279c92ba71c46dc7355" />
            </div>
            <p className="list-item whitespace-nowrap">Người đóng góp</p>
            <IdUserCard id="64b7f3cf830ef61869872548" />
          </ul>
        </section>
      </section>
    </main>
  );
}

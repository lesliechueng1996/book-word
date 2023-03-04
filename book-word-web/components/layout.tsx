import { Button, Sidebar } from 'flowbite-react';
import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  BookOpenIcon,
  PencilSquareIcon,
  UserGroupIcon,
  BookmarkSquareIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

export default function Layout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="w-full h-screen top-0 left-0 right-0 bottom-0">
      <Head>
        <title>{title ?? 'Book Word'}</title>
        <meta name="description" content="Book Word Web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="w-full h-16 shadow-md flex flex-row justify-between px-10 py-2 items-center z-10">
        <Link href="/">
          <p className="font-bold text-2xl">Book Word</p>
        </Link>
        <div>
          <Button gradientDuoTone="pinkToOrange">登录</Button>
        </div>
      </header>
      <main className="flex flex-row" style={{ height: 'calc(100vh - 4rem)' }}>
        <aside className="shrink-0 w-60 h-full shadow-inne">
          <Sidebar aria-label="Sidebar with content separator example">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  icon={BookOpenIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push('/my/book');
                  }}
                >
                  我的书籍
                </Sidebar.Item>
                <Sidebar.Item
                  icon={PencilSquareIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push('/my/word');
                  }}
                >
                  单词本
                </Sidebar.Item>
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  icon={UserGroupIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push('/users');
                  }}
                >
                  用户管理
                </Sidebar.Item>
                <Sidebar.Item
                  icon={BookmarkSquareIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    router.push('/books');
                  }}
                >
                  书籍管理
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </aside>
        <section
          className="grow px-3 py-2 h-full shadow-private name() {
          
        }"
        >
          {children}
        </section>
      </main>
      {/* <div className="z-50 fixed top-0 left-0 bottom-0 right-0 opacity-50 bg-black">
        <Spinner aria-label="Waiting" />
      </div> */}
    </div>
  );
}

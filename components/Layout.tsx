import React, { ReactNode } from 'react';
// import Link from 'next/link';
import Head from 'next/head';
import Nav from './View/Nav';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <>
    <style jsx>{`
      .nav {
        width: 256px;
        min-width: 256px;
        order: 1;
      }
      .content {
        order: 2;
      }
    `}</style>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <main className="w-full">
      <div className="flex">
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="nav border-r border-gray-300">
          <Nav />
        </div>
        <div className="content w-full">{children}</div>
      </div>
    </main>
  </>
);

export default Layout;

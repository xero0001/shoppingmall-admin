import React from 'react';
import Link from 'next/link';

import NavButton from '../../Button/NavButton';

const Nav = () => {
  return (
    <>
      <style jsx>{`
        .nav {
          width: 255px;
        }
      `}</style>
      <nav className="nav overflow-y-auto h-screen py-4">
        {process.env.SHOP_URL ? (
          <Link href={process.env.SHOP_URL}>
            <a className="px-4">내 상점 바로가기</a>
          </Link>
        ) : (
          <div className="px-4">내 상점 바로가기</div>
        )}
        <div className="text-sm text-gray-500 font-bold px-4 mt-4">
          상점 관리 메뉴
        </div>
        <div className="px-4 py-1">
          <NavButton label="홈" href="/" />
          <NavButton label="주문" href="/orders" />
          <NavButton label="상품" href="/products" />
          <NavButton label="고객" href="/" />
          <NavButton label="매거진" href="/" />
        </div>
      </nav>
    </>
  );
};

export default Nav;

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
        {process.env.NEXT_PUBLIC_SHOP_URL ? (
          <Link href={process.env.NEXT_PUBLIC_SHOP_URL}>
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
          <NavButton label="고객" href="/users" />
          <NavButton label="매거진" href="/magazine" />
          <hr className="mt-1" />
          <NavButton label="메인상품배너" href="/mainproducts" />
          <NavButton label="파트너스" href="/partners" />
          <NavButton label="공지사항" href="/notices" />
          <NavButton label="문의" href="/contacts" />
          <NavButton label="배너" href="/banners" />
          <hr className="mt-1" />
          <NavButton label="리뷰" href="/reviews" />
          <NavButton label="쿠폰/적립금" href="/coupons" />
        </div>
      </nav>
    </>
  );
};

export default Nav;

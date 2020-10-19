import React from 'react';
import Link from 'next/link';

type Props = {
  label?: string;
  href: string;
};

const NavButton = ({ label, href }: Props) => (
  <>
    <style jsx>{`
      .button {
        display: block;
        border-radius: 4px;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 6px;
        padding-right: 6px;
        margin-top: 4px;
      }

      .button:hover {
        background-color: rgb(253, 232, 239);
      }

      .active {
        font-weight: 700;
        color: white;
        background-color: rgb(245, 92, 137) !important;
      }
    `}</style>
    <Link href={href}>
      <a className="button">{label}</a>
    </Link>
  </>
);

export default NavButton;

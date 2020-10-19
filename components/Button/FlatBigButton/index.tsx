import React from 'react';
import Link from 'next/link';

type Props = {
  label?: string;
  href?: string;
  onClick?: Function;
  colored?: Boolean;
};

const NavButton = ({ label, href, onClick, colored = true }: Props) => {
  if (href) {
    if (colored) {
      return (
        <Link href={href}>
          <a className="border border-solid border-magenta-400 bg-magenta-400 text-white py-3 w-48 text-base rounded flex flex-column items-center justify-center font-bold">
            <span>{label}</span>
          </a>
        </Link>
      );
    } else {
      return (
        <Link href={href}>
          <a className="border border-solid border-gray-200 bg-gray-200 text-magenta-400 py-3 w-48 text-base rounded flex flex-column items-center justify-center font-bold">
            <span>{label}</span>
          </a>
        </Link>
      );
    }
  } else {
    return <button onClick={() => onClick}>{label}</button>;
  }
};

export default NavButton;

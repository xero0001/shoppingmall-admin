import React from 'react';
import Link from 'next/link';

type Props = {
  label?: any;
  href?: string;
  onClick?: Function;
  colored?: Boolean;
  disabled?: Boolean;
  size?: string;
  type?: any;
};

const NavButton = ({
  label,
  href,
  onClick = () => {},
  colored = true,
  disabled = false,
  size = 'long',
  type = 'button',
}: Props) => {
  if (disabled) {
    return (
      <div
        className={`border border-solid py-3 w-48 text-base rounded flex flex-column items-center justify-center font-boldr transition duration-100 ease-in-out ${
          colored
            ? 'border-magenta-400 bg-magenta-400 text-white'
            : 'border-gray-100 bg-gray-100 text-white'
        }
            ${size === 'long' && 'w-48'}
            ${size === 'short' && 'w-24'}
            ${size === 'full' && 'w-full'}
          `}
      >
        <span>{label}</span>
      </div>
    );
  } else if (href) {
    return (
      <Link href={href}>
        <a
          className={`border border-solid py-3 w-48 text-base rounded flex flex-column items-center justify-center font-boldr transition duration-100 ease-in-out ${
            colored
              ? 'border-magenta-400 bg-magenta-400 text-white hover:bg-magenta-600 hover:border-magenta-600'
              : 'border-gray-200 bg-gray-200 text-magenta-400 hover:bg-gray-400 hover:border-gray-400'
          }
            ${size === 'long' && 'w-48'}
            ${size === 'short' && 'w-24'}
            ${size === 'full' && 'w-full'}
          `}
          type={type}
        >
          <span>{label}</span>
        </a>
      </Link>
    );
  } else {
    return (
      <button
        onClick={() => {
          onClick();
        }}
        className={`border border-solid py-3 w-48 text-base rounded flex flex-column items-center justify-center font-boldr transition duration-100 ease-in-out ${
          colored
            ? 'border-magenta-400 bg-magenta-400 text-white hover:bg-magenta-600 hover:border-magenta-600'
            : 'border-gray-200 bg-gray-200 text-magenta-400 hover:bg-gray-400 hover:border-gray-400'
        }
          ${size === 'long' && 'w-48'}
          ${size === 'short' && 'w-24'}
          ${size === 'full' && 'w-full'}
        `}
        type={type}
      >
        <span>{label}</span>
      </button>
    );
  }
};

export default NavButton;

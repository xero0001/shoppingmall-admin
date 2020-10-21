import React, { useState } from 'react';
import Link from 'next/link';

const ErrorMessage = ({ message }: any) => {
  return (
    <>
      <style jsx>{`
        .nav {
          width: 255px;
        }
      `}</style>
      <div className="nav overflow-y-auto h-screen py-4">{message}</div>
    </>
  );
};

export default ErrorMessage;

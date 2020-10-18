import React, { ReactNode } from 'react'

// import PropTypes from 'prop-types'

// const Button = ({ label, link }:any) => (
//   <a
//     className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white no-underline bg-pink-600 rounded-md hover:bg-pink-800"
//     href={link}
//   >
//     {label}
//   </a>
// )

// export default Button

// Button.propTypes = {
//   label: PropTypes.string.isRequired,
//   link: PropTypes.string.isRequired,
// }


// import React, { ReactNode } from 'react'
// import Link from 'next/link'
// import Head from 'next/head'

type Props = {
  label?: string
  link?: string
}

const Button = ({ label, link }: Props) => (
  <a
  className="inline-flex items-center justify-center px-6 py-4 font-semibold text-white no-underline bg-pink-600 rounded-md hover:bg-pink-800"
  href={link}
>
  {label}
</a>
  // <div>
  //   <Head>
  //     <title>{title}</title>
  //     <meta charSet="utf-8" />
  //     <meta name="viewport" content="initial-scale=1.0, width=device-width" />
  //   </Head>
  //   <header>
  //     <nav>
  //       <Link href="/">
  //         <a>Home</a>
  //       </Link>{' '}
  //       |{' '}
  //       <Link href="/about">
  //         <a>About</a>
  //       </Link>{' '}
  //       |{' '}
  //       <Link href="/users">
  //         <a>Users List</a>
  //       </Link>{' '}
  //       | <a href="/api/users">Users API</a>
  //     </nav>
  //   </header>
  //   {children}
  //   <footer>
  //     <hr />
  //     <span>I'm here to stay (Footer)</span>
  //   </footer>
  // </div>
)

export default Button

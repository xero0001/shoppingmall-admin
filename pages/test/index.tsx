// import { gql, useQuery, useMutation } from '@apollo/client';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { useState } from 'react';

// import Layout from '../../components/Layout';
// import FlatBigButton from '../../components/Button/FlatBigButton';
// import InputString from '../../components/Input/InputString';
// import InputSwitch from '../../components/Input/InputSwitch';
// import InputCheckBox from '../../components/Input/InputCheckBox';
// import InputImage from '../../components/Input/InputImage';
// import Loader from '../../components/Loader';
// import TextEditor from '../../components/Input/TextEditor';

// // import { PRODUCTS_QUERY } from 'index';
// // import { PRODUCT_CATEGORIES_QUERY } from '../categories/index';

// // const CREATE_ONE_PRODUCT_MUTATION = gql`
// //   mutation mut {
// //     mut
// //   }
// // `;

// export const CREATE_ONE_PRODUCT_MUTATION = gql`
//   mutation createOneProduct(
//     $title: String!
//     $price: Int!
//     $published: Boolean!
//     $recommended: Boolean!
//     $soldOut: Boolean!
//     $thumbnail: String!
//     $content: String!
//     $categories: [Int]!
//     $items: [Json]!
//   ) {
//     createOneProduct(
//       title: $title
//       price: $price
//       published: $published
//       recommended: $recommended
//       soldOut: $soldOut
//       thumbnail: $thumbnail
//       content: $content
//       categories: $categories
//       items: $items
//     )
//   }
// `;

// const TestPage = () => {
//   const [createOneProductMutation, { error }] = useMutation(
//     CREATE_ONE_PRODUCT_MUTATION,
//     {
//       variables: {
//         title: 'test',
//         price: 0,
//         published: true,
//         recommended: true,
//         soldOut: false,
//         thumbnail: '',
//         content: '',
//         categories: [],
//         items: [],
//       },
//       errorPolicy: 'all',
//       // refetchQueries: [{ query: PRODUCTS_QUERY, variables: queryVars }],
//     }
//   );

//   return (
//     <Layout title="Home">
//       <button
//         onClick={() =>
//           createOneProductMutation({
//             update: (_, { data }) => {
//               console.log(data);
//             },
//           })
//         }
//       >
//         test
//       </button>
//     </Layout>
//   );
// };

// export default TestPage;

export default () => <></>;

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/Layout';
// import FlatBigButton from '../../components/Button/FlatBigButton';
import Loader from '../../components/Loader';
// import { initializeApollo } from '../../lib/apolloClient';

export const REVIEW_QUERY = gql`
  query review($where: ReviewWhereUniqueInput!) {
    review(where: $where) {
      id
      isBest
      createdAt
      content
      rate
      user {
        name
        username
      }
      product {
        title
      }
    }
  }
`;

export const REVIEWS_QUERY = gql`
  query reviews(
    $where: ReviewWhereInput
    $skip: Int
    $take: Int
    $orderBy: [ReviewOrderByInput!]
  ) {
    reviews(where: $where, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      isBest
      createdAt
      content
      rate
      user {
        name
        username
      }
      product {
        title
      }
    }
  }
`;

export const REVIEWS_COUNT_QUERY = gql`
  query reviewssCount($where: ReviewWhereInput) {
    reviewsCount(where: $where)
  }
`;

export const reviewsQueryVars = {
  skip: 0,
  take: 10,
  where: null,
  orderBy: [{ createdAt: 'desc' }],
};

const Category = () => {
  return (
    <div className="text-2xl font-bold flex flex-row">
      <span>{'리뷰'}</span>
    </div>
  );
};

const Pagination = ({ count, value, setValue }: any) => {
  const max = count === 0 ? 1 : Math.floor((count - 1) / 10) + 1;

  return (
    <div className="flex flex-row">
      <button
        className="bg-gray-600 text-white w-12 mr-2"
        onClick={() => {
          setValue({ ...value, page: 1, skip: 0 });
        }}
      >
        {'<<'}
      </button>
      <button
        className="bg-gray-600 text-white w-12"
        onClick={() => {
          if ((value.skip - value.take) / value.take + 1 > 0) {
            setValue({
              ...value,
              page: (value.skip - value.take) / value.take + 1,
              skip: value.skip - value.take,
            });
          }
        }}
      >
        {'<'}
      </button>
      <div className="px-4">
        <span>{max}</span>
        <span>의 </span>
        <input
          className="border border-gray-400 w-16 text-center"
          value={value.page}
          onChange={(e: any) => {
            setValue({ ...value, page: parseInt(e.target.value) });
          }}
          onKeyPress={(e: any) => {
            if (e.key === 'Enter') {
              if (0 < value.page && value.page <= max) {
                setValue({
                  ...value,
                  skip: (value.page - 1) * value.take,
                });
              }
            }
          }}
          type="number"
        />
      </div>
      <button
        className="bg-gray-600 text-white w-12"
        onClick={() => {
          if ((value.skip + value.take) / value.take + 1 <= max) {
            setValue({
              ...value,
              page: (value.skip + value.take) / value.take + 1,
              skip: value.skip + value.take,
            });
          }
        }}
      >
        {'>'}
      </button>
      <button
        className="bg-gray-600 text-white w-12 ml-2"
        onClick={() => {
          setValue({ ...value, page: max, skip: (max - 1) * value.take });
        }}
      >
        {'>>'}
      </button>
    </div>
  );
};

const ReviewsList = ({ queryVars }: any) => {
  const { loading, error, data } = useQuery(REVIEWS_QUERY, {
    // variables: queryVariables,
    variables: queryVars,
    fetchPolicy: 'network-only',
  });

  if (error) return <aside>상품 로딩에 문제가 발생하였습니다.</aside>;
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { reviews } = data;

  if (reviews.length == 0) return <div>상품이 존재하지 않습니다.</div>;

  return (
    <>
      {reviews.map((review: any) => {
        return (
          <li key={review.id}>
            <div className="flex h-16 items-center justify-center border-b border-gray-400">
              <span style={{ flex: 1 }}>
                <Link href={'/reviews/edit/' + review.id}>
                  <a>{review.createdAt.substr(0, 16)}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>
                <Link href={'/reviews/edit/' + review.id}>
                  <a>{review.product.title}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>
                <Link href={'/reviews/edit/' + review.id}>
                  <a>{review.user.name}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>
                <Link href={'/reviews/edit/' + review.id}>
                  <a>{review.content}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>
                <Link href={'/reviews/edit/' + review.id}>
                  <a>{review.rate}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>
                {review.isBest ? '베스트 리뷰' : ''}
              </span>
            </div>
          </li>
        );
      })}
    </>
  );
};

const IndexPage = () => {
  const [value, setValue] = useState({
    skip: 0,
    take: 10,
    where: null,
    orderBy: [{ createdAt: 'desc' }],
    // searchInput: '',
    page: 1,
    // categoryId: -1,
    // searchString: '',
  });

  // const countQueryVariables = {
  //   where: {
  //     category: {
  //       some: {
  //         id: {
  //           equals: value.categoryId === -1 ? null : value.categoryId,
  //         },
  //       },
  //     },
  //     title: {
  //       contains: value.searchString,
  //     },
  //   },
  // };

  const { loading, data } = useQuery(REVIEWS_COUNT_QUERY, {
    // variables:,
    fetchPolicy: 'network-only',
  });

  // console.log(productCategories);

  return (
    <Layout title="상품">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Category />
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            {/* <div>
              <input
                className="border border-gray-400 p-2 text-sm round w-64"
                placeholder="상품 이름"
                value={value.searchInput}
                onChange={(e: any) => {
                  setValue({ ...value, searchInput: e.target.value });
                }}
                onKeyPress={(e: any) => {
                  if (e.key === 'Enter') {
                    setValue({
                      ...value,
                      page: 1,
                      skip: 0,
                      searchString: value.searchInput,
                    });
                  }
                }}
              />
            </div> */}
            {/* <div className="ml-2">
              <div
                className="border border-gray-400 p-2 text-sm round flex flex-column
          items-center"
              >
                <span>상태</span>
                <span className="flex flex-column items-center ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996
                12.17z"
                    />
                  </svg>
                </span>
              </div>
            </div> */}
          </div>
        </div>
        <div className="py-4 mt-4">
          <ul>
            <li>
              <div
                className="py-4 border-t border-b-2 border-gray-400 flex flex-row
          items-center"
              >
                <span style={{ flex: 1 }} className="text-gray-500">
                  날짜
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  상품명
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  작성자
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  내용
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  별점
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  베스트 여부
                </span>
              </div>
            </li>
            <ReviewsList
              queryVars={{
                where: value.where,
                skip: value.skip,
                take: value.take,
                orderBy: value.orderBy,
                // searchString: value.searchString,
                // categoryId: value.categoryId,
              }}
            />
          </ul>
        </div>
        {loading && <Loader />}
        {!loading && (
          <Pagination
            count={data.reviewsCount}
            value={value}
            setValue={setValue}
          />
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;

// export async function getServerSideProps(_: any) {
//   const apolloClient = initializeApollo(null);

//   await apolloClient.query({
//     query: PRODUCT_CATEGORIES_QUERY,
//     variables: {
//       where: null,
//       orderBy: [{ parentId: 'desc' }, { order: 'asc' }],
//     },
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }

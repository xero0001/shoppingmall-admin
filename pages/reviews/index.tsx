import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import Loader from '../../components/Loader';
import { initializeApollo } from '../../lib/apolloClient';

export const REVIEW_QUERY = gql`
  query review($where: ReviewWhereUniqueInput!) {
    review(where: $where) {
      id
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

const SubCategory = ({ categories, parentId, depth, value, setValue }: any) => {
  return (
    <ul>
      {categories.map((category: any) => {
        if (category.parentId === parentId) {
          return (
            <li key={category.id}>
              <span className="mx-4 my-2 flex jusity-start items-center flex-row">
                {depth > 1 && (
                  <span className={`pl-${((depth - 1) * 4).toString()}`} />
                )}
                {depth > 0 && (
                  <span className="pr-1">
                    <svg
                      fill="white"
                      width="8px"
                      height="10px"
                      viewBox="0 0 15 17"
                      version="1.1"
                    >
                      <g
                        id="Icons"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Rounded"
                          transform="translate(-716.000000, -3436.000000)"
                        >
                          <g
                            id="Navigation"
                            transform="translate(100.000000, 3378.000000)"
                          >
                            <g
                              id="-Round-/-Navigation-/-subdirectory_arrow_right"
                              transform="translate(612.000000, 54.000000)"
                            >
                              <g transform="translate(0.000000, 0.000000)">
                                <polygon
                                  id="Path"
                                  opacity="0.87"
                                  points="24 24 0 24 0 0 24 0"
                                />
                                <path
                                  d="M18.29,15.71 L13.71,20.29 C13.32,20.68 12.68,20.68 12.29,20.29 C11.9,19.9 11.9,19.26 12.29,18.87 L15.17,16 L5,16 C4.45,16 4,15.55 4,15 L4,5 C4,4.45 4.45,4 5,4 C5.55,4 6,4.45 6,5 L6,14 L15.17,14 L12.29,11.13 C11.9,10.74 11.9,10.1 12.29,9.71 C12.68,9.32 13.32,9.32 13.71,9.71 L18.29,14.29 C18.68,14.68 18.68,15.32 18.29,15.71 Z"
                                  id="🔹-Icon-Color"
                                  fill="black"
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                )}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setValue({
                      ...value,
                      categoryId: parseInt(category.id),
                    });
                  }}
                >
                  {category.name}
                </span>
              </span>
              {category.child.length > 0 && (
                <SubCategory
                  categories={categories}
                  parentId={category.id}
                  depth={depth + 1}
                  value={value}
                  setValue={setValue}
                />
              )}
            </li>
          );
        } else {
          <></>;
        }
      })}
    </ul>
  );
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

const ProductsList = ({ queryVars }: any) => {
  const queryVariables =
    queryVars.categoryId === -1
      ? {
          ...queryVars,
          where: {
            title: {
              contains: queryVars.searchString,
            },
          },
        }
      : {
          ...queryVars,
          where: {
            category: {
              some: {
                id: { equals: queryVars.categoryId },
              },
            },
            title: {
              contains: queryVars.searchString,
            },
          },
        };

  const { loading, error, data } = useQuery(PRODUCTS_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  if (error) return <aside>상품 로딩에 문제가 발생하였습니다.</aside>;
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { products } = data;

  if (products.length == 0) return <div>상품이 존재하지 않습니다.</div>;

  return (
    <>
      {products.map((product: any) => {
        return (
          <li key={product.id}>
            <div className="flex h-16 items-center justify-center border-b border-gray-400">
              <span style={{ flex: 3 }}>
                <Link href={'/reviews/edit/' + product.id}>
                  <a>{product.title}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>{product.price}</span>
              <span
                style={{
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                className="text-xs"
              >
                {product.category.map((category: any) => {
                  return <span className="mr-2">{category.name}</span>;
                })}
              </span>
              <span style={{ flex: 1 }}>{product.published && '공개'}</span>
              <span style={{ flex: 1 }}>{product.recommended && '추천'}</span>
              <span style={{ flex: 1 }}>{product.soldOut && '품절'}</span>
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
    searchInput: '',
    page: 1,
    categoryId: -1,
    searchString: '',
  });

  const productCategoriesQuery = useQuery(PRODUCT_CATEGORIES_QUERY, {
    variables: {
      where: null,
      orderBy: [{ parentId: 'desc' }, { order: 'asc' }],
    },
  });

  const countQueryVariables =
    value.categoryId === -1
      ? {
          where: {
            title: {
              contains: value.searchString,
            },
          },
        }
      : {
          where: {
            category: {
              some: {
                id: {
                  equals: value.categoryId === -1 ? null : value.categoryId,
                },
              },
            },
            title: {
              contains: value.searchString,
            },
          },
        };

  const { loading, data } = useQuery(PRODUCTS_COUNT_QUERY, {
    variables: countQueryVariables,
    fetchPolicy: 'network-only',
  });

  const { productCategories } = productCategoriesQuery.data;

  // console.log(productCategories);

  return (
    <Layout title="상품">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Category />
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <div>
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
            </div>
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
                <span style={{ flex: 3 }} className="text-gray-500">
                  상품 이름
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  가격
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  카테고리
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  공개
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  추천
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  품절
                </span>
              </div>
            </li>
            <ProductsList
              queryVars={{
                where: value.where,
                skip: value.skip,
                take: value.take,
                orderBy: value.orderBy,
                searchString: value.searchString,
                categoryId: value.categoryId,
              }}
            />
          </ul>
        </div>
        {loading && <Loader />}
        {!loading && (
          <Pagination
            count={data.productsCount}
            value={value}
            setValue={setValue}
          />
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;

export async function getServerSideProps(_: any) {
  const apolloClient = initializeApollo(null);

  await apolloClient.query({
    query: PRODUCT_CATEGORIES_QUERY,
    variables: {
      where: null,
      orderBy: [{ parentId: 'desc' }, { order: 'asc' }],
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

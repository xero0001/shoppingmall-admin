import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import Loader from '../../components/Loader';
import { initializeApollo } from '../../lib/apolloClient';
import { POST_CATEGORIES_QUERY } from './categories';

export const POST_QUERY = gql`
  query post($where: PostWhereUniqueInput!) {
    post(where: $where) {
      id
      createdAt
      published

      title
      thumbnail
      content

      categoryId
    }
  }
`;

export const POSTS_QUERY = gql`
  query posts(
    $where: PostWhereInput
    $skip: Int
    $take: Int
    $orderBy: [PostOrderByInput!]
  ) {
    posts(where: $where, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      createdAt
      published

      title
      thumbnail
      content

      category {
        id
        name
        slug
      }
    }
  }
`;

export const POSTS_COUNT_QUERY = gql`
  query postsCount($where: PostWhereInput) {
    postsCount(where: $where)
  }
`;

export const postsQueryVars = {
  skip: 0,
  take: 10,
  where: null,
  orderBy: [{ createdAt: 'desc' }],
};

const Category = ({ categories, value, setValue }: any) => {
  const [show, setShow] = useState(false);

  return (
    <div className="text-2xl font-bold flex flex-row">
      {value.categoryId === -1 && <span>전체 매거진</span>}
      {value.categoryId !== -1 &&
        categories.map((category: any) => {
          if (category.id === value.categoryId) {
            return <span key={category.id}>{category.name}</span>;
          } else {
            return <></>;
          }
        })}
      <span
        className="flex flex-column items-center ml-2 cursor-pointer"
        onClick={() => {
          if (show) {
            setShow(false);
          } else {
            setShow(true);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          transform={`${show && 'rotate(180)'}`}
          viewBox="0 0 24 24"
        >
          <path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
        </svg>
      </span>
      {show && (
        <div className="absolute mt-8">
          <ul className="text-sm bg-white border rounded border-gray-400 font-normal overflow-y-scroll h-64">
            <li className="py-2">
              <span
                className="mx-4 cursor-pointer"
                onClick={() => {
                  setValue({
                    ...value,
                    categoryId: -1,
                  });
                }}
              >
                전체 매거진
              </span>
            </li>
            {categories.map((category: any) => {
              return (
                <li key={category.id} className="py-2">
                  <span
                    className="mx-4 cursor-pointer"
                    onClick={() => {
                      setValue({
                        ...value,
                        categoryId: parseInt(category.id),
                      });
                    }}
                  >
                    {category.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
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

const PostsList = ({ queryVars }: any) => {
  const queryVariables =
    queryVars.categoryId === -1
      ? {
          where: {
            title: {
              contains: queryVars.searchString,
            },
          },
          take: queryVars.take,
          skip: queryVars.skip,
          orderBy: queryVars.orderBy,
        }
      : {
          where: {
            categoryId: {
              equals: queryVars.categoryId,
            },
            title: {
              contains: queryVars.searchString,
            },
          },
          take: queryVars.take,
          skip: queryVars.skip,
          orderBy: queryVars.orderBy,
        };

  const { loading, error, data } = useQuery(POSTS_QUERY, {
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

  const { posts } = data;

  if (posts.length == 0) return <div>상품이 존재하지 않습니다.</div>;

  return (
    <>
      {posts.map((post: any) => {
        return (
          <li key={post.id}>
            <div className="flex h-16 items-center justify-center border-b border-gray-400">
              <span style={{ flex: 3 }}>
                <Link href={'/magazine/edit/' + post.id}>
                  <a>{post.title}</a>
                </Link>
              </span>
              <span
                style={{
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                className="text-xs"
              >
                {post.category.name}
              </span>
              <span style={{ flex: 1 }}>{post.published && '공개'}</span>
              <span style={{ flex: 1 }} className="text-sm">
                {post.createdAt.substr(0, 10)}
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
    searchInput: '',
    page: 1,
    categoryId: -1,
    searchString: '',
  });

  const postCategoriesQuery = useQuery(POST_CATEGORIES_QUERY, {
    variables: {
      where: {},
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
            categoryId: {
              equals: value.categoryId === -1 ? null : value.categoryId,
            },
            title: {
              contains: value.searchString,
            },
          },
        };

  const { loading, data } = useQuery(POSTS_COUNT_QUERY, {
    variables: countQueryVariables,
    fetchPolicy: 'network-only',
  });

  const { postCategories } = postCategoriesQuery.data;

  return (
    <Layout title="매거진">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Category
            categories={postCategories}
            value={value}
            setValue={setValue}
          />
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <div>
              <input
                className="border border-gray-400 p-2 text-sm round w-64"
                placeholder="매거진 제목"
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
          </div>
          <div className="flex">
            <div>
              <FlatBigButton
                label="카테고리 수정"
                colored={false}
                href="/magazine/categories"
              />
            </div>
            <div className="ml-2">
              <FlatBigButton
                label="+ 새 매거진"
                href="/magazine/add"
                colored={true}
              />
            </div>
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
                  제목
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  카테고리
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  공개
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  작성일자
                </span>
              </div>
            </li>
            <PostsList
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
            count={data.postsCount}
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
    query: POST_CATEGORIES_QUERY,
    variables: {
      where: {},
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

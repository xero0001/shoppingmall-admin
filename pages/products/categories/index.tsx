import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

import Layout from '../../../components/Layout';
import FlatBigButton from '../../../components/Button/FlatBigButton';
import Loader from '../../../components/Loader';

export const PRODUCTS_QUERY = gql`
  query productCategories($where: Product_CategoryWhereInput) {
    productCategories(where: $where) {
      id
      name
      slug
      order
      parentId
      child {
        id
      }
    }
  }
`;

export const queryVars = {
  where: {
    parentId: {
      equals: null,
    },
  },
};

const CategoriesList = () => {
  const { loading, error, data } = useQuery(PRODUCTS_QUERY, {
    variables: queryVars,
  });

  if (error) return <aside>카테고리 로딩에 문제가 발생하였습니다.</aside>;
  // if (loading && !loadingMorePosts) return <div>Loading</div>;
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { productCategories } = data;

  if (productCategories.length == 0)
    return <div>상품이 존재하지 않습니다.</div>;

  return (
    <>
      {productCategories.map((category: any) => (
        <li key={category.id}>
          <div className="flex h-16 items-center justify-center border-b border-gray-400">
            <span style={{ flex: 3 }}>{category.name}</span>
            <span style={{ flex: 1 }}>{category.slug}</span>
            <span style={{ flex: 1 }}>
              {category.child.length ? (
                <a href={'categories/' + category.id}>
                  <div
                    className="bg-gray-200 rounded-md text-magenta-400 font-bold py-3
                  text-center"
                  >
                    하위 카테고리 보기
                    <span
                      className="text-xs rounded-full bg-gray-500 px-2 py-1 ml-2
                    inline-block text-white"
                    >
                      {category.child.length}
                    </span>
                  </div>
                </a>
              ) : (
                <></>
              )}
            </span>
          </div>
        </li>
      ))}
    </>
  );
};

const IndexPage = () => (
  <Layout title="상품 - 카테고리">
    <div className="px-4 py-8">
      <div className="w-full items-center mb-4">
        <Link href="/products">
          <a>
            <div className="text-base font-bold text-gray-500 mb-2">
              {'<'} 뒤로가기
            </div>
          </a>
        </Link>
        <div className="text-2xl font-bold flex flex-row">
          <span>상품 {'>'} 카테고리</span>
        </div>
      </div>
      <div className="flex flex-row justify-end items-center">
        <div>
          <FlatBigButton
            label="순서 변경"
            colored={false}
            href="/products/categories/order"
          />
        </div>
        <div className="ml-2">
          <FlatBigButton
            label="+ 새 카테고리"
            colored={true}
            href="/products/categories/add"
          />
        </div>
      </div>
      <div className="py-4 mt-4">
        <ul>
          <li>
            <div className="py-4 border-t border-b border-gray-400 flex flex-row items-center">
              <span style={{ flex: 3 }} className="text-gray-500">
                카테고리 이름
              </span>
              <span style={{ flex: 1 }} className="text-gray-500">
                slug
              </span>
              <span style={{ flex: 1 }} className="text-gray-500">
                하위 카테고리
              </span>
            </div>
          </li>
          <CategoriesList />
        </ul>
      </div>
    </div>
  </Layout>
);

export default IndexPage;

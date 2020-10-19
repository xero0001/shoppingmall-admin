import { gql, useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import Loader from '../../components/Loader';

export const PRODUCTS_QUERY = gql`
  query products($where: ProductWhereInput, $skip: Int!, $take: Int!) {
    products(where: $where, skip: $skip, take: $take) {
      id
      title
      price
      published
      recommended
      thumbnail
      category {
        id
      }
    }
  }
`;

export const queryVars = {
  skip: 0,
  take: 10,
  where: null,
};

const ProductsList = () => {
  const { loading, error, data } = useQuery(PRODUCTS_QUERY, {
    variables: queryVars,
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
      {products.map((product: any) => (
        <li key={product.id}>
          <div className="flex h-16 items-center justify-center border-b border-gray-400">
            <span style={{ flex: 3 }}>{product.title}</span>
            <span style={{ flex: 1 }}>{product.price}</span>
            <span style={{ flex: 1 }}>{product.published}</span>
          </div>
        </li>
      ))}
    </>
  );
};

const IndexPage = () => (
  <Layout title="상품">
    <div className="px-4 py-8">
      <div className="w-full items-center mb-4">
        <div className="text-2xl font-bold flex flex-row">
          <span>전체상품</span>
          <span className="flex flex-column items-center ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996
            12.17z"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center">
          <div>
            <input
              className="border border-gray-400 p-2 text-sm round w-64"
              placeholder="상품 이름"
            />
          </div>
          <div className="ml-2">
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
          </div>
        </div>
        <div className="flex">
          <div>
            <FlatBigButton
              label="카테고리 수정"
              colored={false}
              href="/products/categories"
            />
          </div>
          <div className="ml-2">
            <FlatBigButton
              label="+ 새 상품"
              href="/products/categories/add"
              colored={true}
            />
          </div>
        </div>
      </div>
      <div className="py-4 mt-4">
        <ul>
          <li>
            <div
              className="py-4 border-t border-b border-gray-400 flex flex-row
          items-center"
            >
              <span style={{ flex: 3 }} className="text-gray-500">
                상품 이름
              </span>
              <span style={{ flex: 1 }} className="text-gray-500">
                가격
              </span>
              <span style={{ flex: 1 }} className="text-gray-500">
                상태
              </span>
            </div>
          </li>
          <ProductsList />
        </ul>
      </div>
    </div>
  </Layout>
);

export default IndexPage;

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';

import Layout from '../../../../components/Layout';
import FlatBigButton from '../../../../components/Button/FlatBigButton';
import InputString from '../../../../components/Input/InputString';
import Loader from '../../../../components/Loader';

export const PRODUCT_CATEGORY_MUTATION = gql`
  query createOneProduct_Category($data: ProductCreateInput!) {
    createOneProduct_Category(data: $data) {
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

export const PRODUCT_CATEGORIES_QUERY = gql`
  query productCategories($orderBy: [Product_CategoryOrderByInput!]) {
    productCategories(orderBy: $orderBy) {
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

// export const queryVars = {
//   where: null,
// };

// type User = {
//   id: number;
//   name: string;
// };

const CategoryItems = ({
  value,
  categories,
  parentId,
  depth,
  name,
  handleChange,
}: any) => {
  // var space = ((depth - 1) * 4).toString();
  // var spaceString = space.toString();
  return (
    <>
      {categories.map((category: any) => {
        if (category.parentId === parentId) {
          return (
            <li key={category.id}>
              <div
                className={`flex py-2 px-4 items-center justify-start border-b
                  border-gray-400 cursor-pointer ${
                    value === category.id && 'text-white bg-gray-600 font-bold'
                  }`}
                onClick={() => {
                  handleChange('parentId', category.id);
                }}
              >
                {depth > 1 && (
                  <span className={`pl-${((depth - 1) * 4).toString()}`} />
                )}
                {/* {depth > 0 && <span>┕ </span>} */}
                {depth > 0 && (
                  <span className="pr-1">
                    <svg
                      fill="white"
                      width="15px"
                      height="17px"
                      viewBox="0 0 15 17"
                      version="1.1"
                    >
                      <g
                        id="Icons"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
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
                                  // fill="#1D1D1D"
                                  fill={`${
                                    value === category.id ? 'white' : 'black'
                                  }`}
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                )}
                <span>{category.name + depth}</span>
              </div>
              {category.child.length > 0 && (
                <ul>
                  <CategoryItems
                    value={value}
                    categories={categories}
                    parentId={category.id}
                    depth={depth + 1}
                    name={name}
                    handleChange={handleChange}
                  />
                </ul>
              )}
            </li>
          );
        } else {
          return;
        }
      })}
    </>
  );
};

const CategoryList = ({
  value,
  handleChange,
  name,
  label,
  categories,
}: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <div
        className="block rounded-md border border-gray-400 overflow-hidden
    overflow-y-scroll"
        style={{ height: '384px' }}
      >
        <ul>
          <li>
            <div
              className={`flex py-2 px-4 items-center justify-start border-b
          border-gray-400 cursor-pointer ${
            value === -1 && 'text-white bg-gray-600 font-bold'
          }`}
              onClick={() => {
                handleChange(name, -1);
              }}
            >
              <span>없음</span>
            </div>
          </li>
          <CategoryItems
            value={value}
            categories={categories}
            parentId={null}
            depth={0}
            name={name}
            handleChange={handleChange}
          />
        </ul>
      </div>
    </>
  );
};

const CategoryForm = () => {
  const queryVars = {
    orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
  };

  const { loading, error, data } = useQuery(PRODUCT_CATEGORIES_QUERY, {
    variables: queryVars,
  });

  const [state, setState] = useState({
    name: '',
    slug: '',
    parentId: -1,
  });

  const handleChange = (name: string, value: any) => {
    interface ComponentState {
      name: string;
      slug: string;
      parentId: number;
    }

    setState({
      ...state,
      [name]: value,
    } as ComponentState);
  };

  if (error) return <aside>데이터 로딩에 문제가 발생하였습니다.</aside>;
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { productCategories } = data;

  return (
    <div className="py-4 mt-4">
      <div className="max-w-sm mx-auto block">
        <div className="block">
          <InputString
            label="카테고리 이름"
            value={state.name}
            handleChange={handleChange}
            name="name"
          />
        </div>
        <div className="block mt-4">
          <InputString
            label="슬러그"
            value={state.slug}
            handleChange={handleChange}
            name="slug"
          />
          <div className="text-xs">
            *슬러그는 url에 표시되는 영어 소문자로 이루어진 짧은 단어입니다.
          </div>
        </div>
        <div className="block mt-4">
          <CategoryList
            value={state.parentId}
            handleChange={handleChange}
            name="parentId"
            label="상위 카테고리"
            categories={productCategories}
          />
        </div>
      </div>
    </div>
  );
};

const IndexPage = () => {
  return (
    <Layout title="상품 - 카테고리">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/products/categories">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>
              상품 {'>'} 카테고리 {'>'} 추가하기
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-end items-center">
          <div>
            <FlatBigButton
              label="취소"
              colored={false}
              href="/products/categories"
            />
          </div>
          <div className="ml-2">
            <FlatBigButton
              label="생성"
              colored={true}
              onClick={() => {
                // createProductCategory();
              }}
            />
          </div>
        </div>
        <CategoryForm />
      </div>
    </Layout>
  );
};

export default IndexPage;

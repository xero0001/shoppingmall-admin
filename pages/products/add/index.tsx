import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../../components/Layout';
import FlatBigButton from '../../../components/Button/FlatBigButton';
import InputString from '../../../components/Input/InputString';
import InputSwitch from '../../../components/Input/InputSwitch';
import InputCheckBox from '../../../components/Input/InputCheckBox';
import InputImage from '../../../components/Input/InputImage';
import Loader from '../../../components/Loader';
import TextEditor from '../../../components/Input/TextEditor';

import { PRODUCTS_QUERY, productsQueryVars } from '../index';
import { PRODUCT_CATEGORIES_QUERY } from '../categories/index';

export const CREATE_ONE_PRODUCT_MUTATION = gql`
  mutation createOneProduct(
    $title: String!
    $price: Int!
    $published: Boolean!
    $recommended: Boolean!
    $soldOut: Boolean!
    $thumbnail: String!
    $content: String!
    $categories: [Int]!
    $items: [Json]!
  ) {
    createOneProduct(
      title: $title
      price: $price
      published: $published
      recommended: $recommended
      soldOut: $soldOut
      thumbnail: $thumbnail
      content: $content
      categories: $categories
      items: $items
    ) {
      id
      title
    }
  }
`;

const CategoryItems = ({
  value,
  categories,
  parentId,
  depth,
  name,
  handleChange,
}: any) => {
  return (
    <>
      {categories.map((category: any) => {
        const checked = value.some(
          (categoryId: any) => categoryId === category.id
        );

        if (category.parentId === parentId) {
          return (
            <li key={category.id}>
              <div
                className={`flex py-2 px-4 items-center justify-start border-b
                  border-gray-400 cursor-pointer ${
                    checked && 'text-white bg-gray-600 font-bold'
                  }`}
                onClick={() => {
                  let newValue = [...value];
                  let found = -1;

                  for (let i = 0; i < newValue.length; i++) {
                    if (newValue[i] === category.id) {
                      found = i;
                      break;
                    }
                  }

                  if (found === -1) {
                    newValue.push(category.id);
                  } else {
                    newValue.splice(found, 1);
                  }
                  handleChange(name, newValue);
                }}
              >
                {depth > 1 && (
                  <span className={`pl-${((depth - 1) * 4).toString()}`} />
                )}
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
                                  // fill="#1D1D1D"
                                  fill={`${checked ? 'white' : 'black'}`}
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                )}
                <span>{category.name + ' [' + category.slug + ']'}</span>
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

const CategoriesMultiple = ({
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
        style={{ height: '320px' }}
      >
        <ul>
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

const InputProducts = ({ value, handleChange, name, label }: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <div className="block rounded-md">
        <ul>
          <li>
            <div className="py-4 border-t border-b-2 border-gray-400 flex flex-row items-center">
              <span style={{ flex: 3 }} className="text-gray-500">
                상품 이름
              </span>
              <span style={{ flex: 1 }} className="text-gray-500">
                추가 금액
              </span>
              <span style={{ flex: 1 }} className="text-gray-500">
                이미지
              </span>
              <span style={{ flex: 'none' }} className="text-gray-500  w-16">
                {value.some((item: any) => item.delete === true) ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current text-red-400 hover:text-red-600 cursor-pointer transition duration-100 ease-in-out"
                    onClick={() => {
                      let newValue = value.filter(
                        (item: any) => item.delete === false
                      );
                      handleChange(name, newValue);
                    }}
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z" />
                  </svg>
                ) : (
                  '삭제'
                )}
              </span>
            </div>
          </li>
          {value.map((item: any, i: number) => {
            return (
              <li key={i}>
                <div className="py-4 border-b border-gray-400 flex flex-row items-center">
                  <span style={{ flex: 3 }} className="text-gray-500">
                    {item.name}
                  </span>
                  <span style={{ flex: 1 }} className="text-gray-500">
                    {item.price}
                  </span>
                  <span style={{ flex: 1 }} className="text-gray-500">
                    {item.image}
                  </span>
                  <span style={{ flex: 'none' }} className="text-gray-500 w-16">
                    <InputCheckBox
                      name="delete"
                      value={item.delete}
                      handleChange={() => {
                        if (item.delete === true) {
                          const newValue = [...value];
                          newValue.splice(i, 1, {
                            ...item,
                            delete: false,
                          });
                          handleChange(name, newValue);
                        } else {
                          const newValue = [...value];
                          newValue.splice(i, 1, {
                            ...item,
                            delete: true,
                          });
                          handleChange(name, newValue);
                        }
                      }}
                    />
                  </span>
                </div>
              </li>
            );
          })}
          <li>
            <div className="flex justify-center items-center mt-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                className="fill-current text-gray-400 hover:text-gray-600 cursor-pointer transition duration-100 ease-in-out"
                onClick={() => {
                  handleChange(name, [
                    ...value,
                    {
                      name: '',
                      price: 0,
                      stock: 0,
                      image: '',
                      delete: false,
                    },
                  ]);
                }}
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
              </svg>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

const ProductForm = ({ router }: any) => {
  const [state, setState] = useState({
    title: '',
    price: 0,
    published: false,
    recommended: false,
    soldOut: false,
    thumbnail: '',
    content: '',
    categories: [],
    items: [],
  });

  console.log(state);

  const queryVars = {
    orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
  };

  const query = useQuery(PRODUCT_CATEGORIES_QUERY, {
    variables: queryVars,
  });

  const [createOneProductMutation, { error }] = useMutation(
    CREATE_ONE_PRODUCT_MUTATION,
    {
      variables: {
        ...state,
      },
      errorPolicy: 'all',
      refetchQueries: [{ query: PRODUCTS_QUERY, variables: productsQueryVars }],
    }
  );

  interface ComponentState {
    title: string;
    price: number;
    published: boolean;
    recommended: boolean;
    thumbnail: string;
    content: '';
    categories: any;
    soldOut: boolean;
    items: any;
  }

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as ComponentState);
  };

  if (query.error) return <aside>데이터 로딩에 문제가 발생하였습니다.</aside>;
  if (query.loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { productCategories } = query.data;

  const handleSubmit = () => {
    createOneProductMutation({
      update: (_, __) => {
        router.push('/products');
      },
    });
  };

  return (
    <form
      onSubmit={async (e: any) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex flex-row justify-end items-center">
        <div>
          <FlatBigButton label="취소" colored={false} href="/products" />
        </div>
        <div className="ml-2">
          <FlatBigButton label="생성" colored={true} type="submit" />
        </div>
      </div>
      {error &&
        error.graphQLErrors.map(({ message }, i) => {
          if (message === 'duplicate') {
            return (
              <div key={i} className="text-red-700 text-center block mt-8">
                *중복되는 슬러그가 있습니다. 다른 슬러그를 입력해주세요.
              </div>
            );
          } else {
            return <></>;
          }
        })}
      <div className="py-4 mt-4">
        <div className="max-w-3xl mx-auto block">
          <div className="block">
            <InputString
              label="상품 이름"
              value={state.title}
              handleChange={handleChange}
              name="title"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="상품 가격"
              value={state.price}
              handleChange={handleChange}
              name="price"
              type="number"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <InputSwitch
              value={state.published}
              handleChange={handleChange}
              name="published"
              label="공개 여부"
              color="green"
            />
          </div>
          <div className="block mt-4">
            <InputSwitch
              value={state.recommended}
              handleChange={handleChange}
              name="recommended"
              label="추천 여부"
              color="blue"
            />
          </div>
          <div className="block mt-4">
            <InputSwitch
              value={state.soldOut}
              handleChange={handleChange}
              name="soldOut"
              label="품절 여부"
              color="red"
            />
          </div>
          <div className="block mt-4">
            <CategoriesMultiple
              value={state.categories}
              handleChange={handleChange}
              name="categories"
              label="카테고리"
              categories={productCategories}
            />
          </div>
          <div className="block mt-4">
            <InputImage
              label="상품 이미지"
              value={state.thumbnail}
              handleChange={handleChange}
              name="thumbnail"
            />
          </div>
          <div className="block mt-4">
            <InputProducts
              value={state.items}
              handleChange={handleChange}
              name="items"
              label="옵션 상품"
            />
          </div>
          <div className="block mt-4">
            <TextEditor label="상품설명" initValue="" />
          </div>
        </div>
      </div>
    </form>
  );
};

const IndexPage = () => {
  const router = useRouter();

  return (
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
            <span>상품 {'>'} 추가하기</span>
          </div>
        </div>
        <ProductForm router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

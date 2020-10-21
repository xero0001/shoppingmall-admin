import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../../../../components/Layout';
import FlatBigButton from '../../../../../components/Button/FlatBigButton';
import InputString from '../../../../../components/Input/InputString';
import Loader from '../../../../../components/Loader';

import { PRODUCT_CATEGORY_QUERY, PRODUCT_CATEGORIES_QUERY } from '../../index';

export const DELETE_ONE_PRODUCT_CATEGORY_MUTATION = gql`
  mutation deleteOneProduct_Category($where: IdCustomWhere!) {
    deleteOneProduct_Category(where: $where) {
      id
      name
      slug
      order
      parentId
    }
  }
`;

export const UPDATE_ONE_PRODUCT_CATEGORY_MUTATION = gql`
  mutation updateOneProduct_Category(
    $where: IdCustomWhere!
    $name: String!
    $slug: String!
    $parentId: Int!
  ) {
    updateOneProduct_Category(
      name: $name
      slug: $slug
      parentId: $parentId
      where: $where
    ) {
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

const CategoryItems = ({
  value,
  categories,
  parentId,
  depth,
  name,
  handleChange,
  self,
}: any) => {
  return (
    <>
      {categories.map((category: any) => {
        if (category.parentId === parentId) {
          return (
            <li key={category.id}>
              <div
                className={`flex py-2 px-4 items-center justify-start border-b border-gray-400 
                    ${
                      value === category.id &&
                      'text-white bg-gray-600 font-bold'
                    }
                    ${
                      self === category.id
                        ? 'bg-gray-200 text-gray-400 cursor-default'
                        : 'cursor-pointer'
                    }
                  `}
                onClick={() => {
                  if (self !== category.id) {
                    handleChange('parentId', category.id);
                  }
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
                                  fill={`${
                                    self === category.id
                                      ? '#cbd5e0'
                                      : value === category.id
                                      ? 'white'
                                      : 'black'
                                  }
                                  `}
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
                    self={self}
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
  self,
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
            self={self}
          />
        </ul>
      </div>
    </>
  );
};

const CategoryForm = ({ router, constructor }: any) => {
  const [state, setState] = useState({
    name: constructor.name,
    slug: constructor.slug,
    parentId: constructor.parentId === null ? -1 : constructor.parentId,
  });

  const queryVars = {
    orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
  };

  const [deleteOneProductCategoryMutation] = useMutation(
    DELETE_ONE_PRODUCT_CATEGORY_MUTATION,
    {
      variables: {
        where: {
          id: constructor.id,
        },
      },
      errorPolicy: 'all',
      refetchQueries: [
        {
          query: PRODUCT_CATEGORIES_QUERY,
          variables: queryVars,
        },
        {
          query: PRODUCT_CATEGORIES_QUERY,
          variables: {
            where: {
              parentId: {
                equals: constructor.parentId,
              },
            },
            orderBy: [{ order: 'asc' }],
          },
        },
      ],
    }
  );

  const [updateOneProductCategoryMutation] = useMutation(
    UPDATE_ONE_PRODUCT_CATEGORY_MUTATION,
    {
      errorPolicy: 'all',
      refetchQueries: [
        {
          query: PRODUCT_CATEGORIES_QUERY,
          variables: queryVars,
        },
        {
          query: PRODUCT_CATEGORIES_QUERY,
          variables: {
            where: {
              parentId: {
                equals: constructor.parentId,
              },
            },
            orderBy: [{ order: 'asc' }],
          },
        },
        {
          query: PRODUCT_CATEGORIES_QUERY,
          variables: {
            where: {
              parentId: {
                equals: state.parentId === -1 ? null : state.parentId,
              },
            },
            orderBy: [{ order: 'asc' }],
          },
        },
      ],
    }
  );

  const query = useQuery(PRODUCT_CATEGORIES_QUERY, {
    variables: queryVars,
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

  if (query.error) return <aside>데이터 로딩에 문제가 발생하였습니다.</aside>;
  if (query.loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { productCategories } = query.data;

  const handleDelete = () => {
    deleteOneProductCategoryMutation({
      update: (_, { data: { deleteOneProduct_Category } }) => {
        if (deleteOneProduct_Category.parentId === null) {
          router.push('/products/categories/');
        } else {
          router.push(
            '/products/categories/' + deleteOneProduct_Category.parentId
          );
        }
      },
    });
  };

  const handleSubmit = () => {
    const mutationVars = {
      where: {
        id: constructor.id,
      },
      ...state,
    };

    console.log(mutationVars);

    updateOneProductCategoryMutation({
      variables: mutationVars,
      // update: (cache, { data: { updateOneProduct_Category } }) => {
      //   console.log('Success');
      //   console.log(updateOneProduct_Category);
      //   // if (deleteOneProduct_Category.parentId === null) {
      //   //   router.push('/products/categories/');
      //   // } else {
      //   //   router.push(
      //   //     '/products/categories/' + deleteOneProduct_Category.parentId
      //   //   );
      //   // }
      // },
    });
  };
  // console.log(error);

  return (
    <form
      onSubmit={async (e: any) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex flex-row justify-end items-center">
        <div className="mr-auto">
          <FlatBigButton label="삭제" colored={true} onClick={handleDelete} />
        </div>
        <div>
          <FlatBigButton
            label="취소"
            colored={false}
            href="/products/categories"
          />
        </div>
        <div className="ml-2">
          <FlatBigButton label="수정" colored={true} type="submit" />
        </div>
      </div>
      <div className="py-4 mt-4">
        <div className="max-w-sm mx-auto block">
          <div className="block">
            <InputString
              label="카테고리 이름"
              value={state.name}
              handleChange={handleChange}
              name="name"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="슬러그"
              value={state.slug}
              handleChange={handleChange}
              name="slug"
              required={true}
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
              self={constructor.id}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const QueryWrap = ({ args, router }: any) => {
  const queryVars = args;

  const query = useQuery(PRODUCT_CATEGORY_QUERY, {
    variables: queryVars,
    errorPolicy: 'all',
  });

  if (Object.keys(router.query).length === 0) {
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );
  }

  if (query.error) return <aside>데이터 로딩에 문제가 발생하였습니다.</aside>;
  if (query.loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { productCategory } = query.data;

  return <CategoryForm router={router} constructor={productCategory} />;
};

const ParentLocation = (id: string) => {
  const queryVars = {
    where: {
      id: parseInt(id),
    },
  };

  const { loading, error, data } = useQuery(PRODUCT_CATEGORY_QUERY, {
    variables: queryVars,
  });

  if (error) return '';
  if (loading) return '';

  const { productCategory } = data;

  if (!productCategory || productCategory.parentId === null) {
    return '';
  }

  return productCategory.parentId.toString();
};

const CurrentLocation = ({ id }: any) => {
  const queryVars = {
    where: {
      id: parseInt(id as string),
    },
  };

  const { loading, error, data } = useQuery(PRODUCT_CATEGORY_QUERY, {
    variables: queryVars,
  });

  if (error) return <></>;
  if (loading) return <></>;

  const { productCategory } = data;

  return <>{productCategory.name}</>;
};

const IndexPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const args = {
    where: {
      id: parseInt(id as string),
    },
  };

  return (
    <Layout title="상품 - 카테고리">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href={'/products/categories/' + ParentLocation(id as string)}>
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>
              상품 {'>'} 카테고리 {'>'} 수정하기:{' '}
              {id && <CurrentLocation id={id as string} />}
            </span>
          </div>
        </div>
        <QueryWrap args={args} router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

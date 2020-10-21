import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../../../../components/Layout';
import FlatBigButton from '../../../../../components/Button/FlatBigButton';
import Loader from '../../../../../components/Loader';
import { ArrowUp, ArrowDown } from '../../../../../components/Icons/Arrow';
import { PRODUCT_CATEGORY_QUERY, PRODUCT_CATEGORIES_QUERY } from '../../index';

export const REORDER_PRODUCT_CATEGORY_MUTATION = gql`
  mutation reorderProduct_Category(
    $where: ParentIdCustomWhere!
    $order: [Int]!
  ) {
    reorderProduct_Category(where: $where, order: $order)
  }
`;

const CategoriesOrderForm = ({ router, constructor }: any) => {
  const [state, setState] = useState([...constructor]);
  const { parentId } = router.query;
  const pid = parseInt(parentId);

  const queryVars = {
    where: {
      parentId: {
        equals: pid,
      },
    },
    orderBy: [{ order: 'asc' }],
  };

  const [reorderProductCategoryMutation] = useMutation(
    REORDER_PRODUCT_CATEGORY_MUTATION,
    {
      errorPolicy: 'all',
      refetchQueries: [
        {
          query: PRODUCT_CATEGORIES_QUERY,
          variables: queryVars,
        },
      ],
    }
  );

  const reOrder = (array: Array<any>, from: number, to: number) => {
    array[from] = array.splice(to, 1, array[from])[0];
  };

  const orderUp = (index: number) => {
    if (index > 0) {
      let ar = state;
      reOrder(ar, index, index - 1);
      setState([...ar]);
    }
  };

  const orderDown = (index: number) => {
    if (index < state.length - 1) {
      let ar = state;
      reOrder(ar, index, index + 1);
      setState([...ar]);
    }
  };

  const handleSubmit = () => {
    let order: number[] = [];
    state.forEach((category: any) => {
      order.push(category.id);
    });

    reorderProductCategoryMutation({
      variables: {
        where: {
          parentId: pid,
        },
        order: order,
      },
      update: (_, { data: { reorderProduct_Category } }) => {
        if (reorderProduct_Category === 0) {
          router.push('/products/categories/' + pid);
        }
      },
    });
  };

  return (
    <>
      <div className="flex flex-row justify-end items-center">
        <div>
          <FlatBigButton
            label="취소"
            colored={false}
            href="/products/categories"
          />
        </div>
        <div className="ml-2">
          <FlatBigButton label="적용" colored={true} onClick={handleSubmit} />
        </div>
      </div>
      <div className="py-4 mt-4">
        <ul>
          <li>
            <div className="py-4 border-t border-b border-gray-400 flex flex-row items-center">
              <span style={{ width: '200px' }} className="text-gray-500">
                순서 편집
              </span>
              <span style={{ flex: 3 }} className="text-gray-500 pl-4">
                카테고리 이름
              </span>
              <span style={{ flex: 1 }} className="text-gray-500">
                slug
              </span>
            </div>
          </li>
          {state.map((category: any, i: number) => (
            <li key={category.id}>
              <div className="flex h-16 items-center justify-center border-b border-gray-400">
                <span style={{ width: '200px' }}>
                  <div className="flex flex-row justify-end items-center">
                    <FlatBigButton
                      label={i === 0 ? <ArrowUp fill="white" /> : <ArrowUp />}
                      colored={false}
                      size="short"
                      onClick={() => orderUp(i)}
                      disabled={i === 0}
                    />
                    <div className="ml-2"></div>
                    <FlatBigButton
                      label={
                        i === state.length - 1 ? (
                          <ArrowDown fill="white" />
                        ) : (
                          <ArrowDown />
                        )
                      }
                      colored={false}
                      size="short"
                      onClick={() => orderDown(i)}
                      disabled={i === state.length - 1}
                    />
                  </div>
                </span>
                <span style={{ flex: 3 }}>
                  <Link href={'/products/categories/edit/' + category.id}>
                    <a className="pl-4">{category.name}</a>
                  </Link>
                </span>
                <span style={{ flex: 1 }}>{category.slug}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const QueryWrap = ({ args, router }: any) => {
  const queryVars = args;

  const query = useQuery(PRODUCT_CATEGORIES_QUERY, {
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

  const { productCategories } = query.data;

  return (
    <CategoriesOrderForm router={router} constructor={productCategories} />
  );
};

const ParentCategory = ({ parentId }: any) => {
  const queryVars = {
    where: {
      id: parseInt(parentId),
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
  const { parentId } = router.query;

  const args = {
    where: {
      parentId: {
        equals: parseInt(parentId as string),
      },
    },
    orderBy: [{ order: 'asc' }],
  };

  return (
    <Layout title="상품 - 카테고리">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href={'/products/categories/' + parentId}>
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>
              상품 {'>'} 카테고리 {'>'} 순서변경 :{' '}
              {parentId && <ParentCategory parentId={parentId} />}
            </span>
          </div>
        </div>
        <QueryWrap args={args} router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

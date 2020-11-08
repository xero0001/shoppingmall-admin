import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../../../components/Layout';
import FlatBigButton from '../../../../components/Button/FlatBigButton';
import InputString from '../../../../components/Input/InputString';

import Loader from '../../../../components/Loader';

// import { ORDERS_QUERY, ordersQueryVars, ORDER_QUERY } from '../../';
import { ORDER_QUERY } from '../../';
import { PRODUCTS_QUERY } from '../../../products';
// import { PRODUCT_CATEGORIES_QUERY } from '../../categories/index';

export const UPDATE_ONE_ORDER_MUTATION = gql`
  mutation updateOneOrder(
    $where: OrderWhereUniqueInput!
    $data: OrderUpdateInput!
  ) {
    updateOneOrder(where: $where, data: $data) {
      id
    }
  }
`;

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProductOptionItems = ({ cartProduct, products }: any) => {
  const product = products.find((product: any) => {
    return product.id === cartProduct.id;
  });

  return cartProduct.items.map((optionItem: any) => {
    return (
      <ul
        key={optionItem.idx}
        className="flex flex-row py-8 border-b border-gray-200"
      >
        <li className="flex flex-row items-center" style={{ flex: 3 }}>
          <Link href={'/products/edit/' + product.id}>
            <a>
              <div
                className="w-32 h-32 bg-center bg-cover"
                style={{
                  backgroundImage:
                    'url(' + product.items.list[optionItem.idx].image + ')',
                }}
              />
            </a>
          </Link>
          <div>
            <Link href={'/products/edit/' + product.id}>
              <a>{product.title}</a>
            </Link>
            <div className="block text-gray-600 text-xs">
              {product.items.list[optionItem.idx].name}
            </div>
          </div>
        </li>
        <li className="flex flex-row items-center" style={{ flex: 1 }}>
          {numberWithCommas(
            product.price + product.items.list[optionItem.idx].price
          ) + '원'}
        </li>
        <li className="flex flex-row items-center" style={{ flex: 2 }}>
          {optionItem.quantity}
        </li>
        <li
          className="flex flex-row items-center justify-between"
          style={{ flex: 1 }}
        >
          <span>
            {numberWithCommas(
              (product.price + product.items.list[optionItem.idx].price) *
                optionItem.quantity
            ) + '원'}
          </span>
        </li>
      </ul>
    );
  });
};

const ProductSingleItem = ({ cartProduct, products }: any) => {
  const product = products.find((product: any) => {
    return product.id === cartProduct.id;
  });

  return (
    <ul className="flex flex-row py-8 border-b border-gray-200">
      <li className="flex flex-row items-center" style={{ flex: 3 }}>
        <Link href={'/products/edit/' + product.id}>
          <a>
            <div
              className="w-32 h-32 bg-center bg-cover"
              style={{ backgroundImage: 'url(' + product.thumbnail + ')' }}
            />
          </a>
        </Link>
        <Link href={'/products/edit/' + product.id}>
          <a>{product.title}</a>
        </Link>
      </li>
      <li className="flex flex-row items-center" style={{ flex: 1 }}>
        {numberWithCommas(product.price) + '원'}
      </li>
      <li className="flex flex-row items-center" style={{ flex: 2 }}>
        {cartProduct.quantity}
      </li>
      <li
        className="flex flex-row items-center justify-between"
        style={{ flex: 1 }}
      >
        <span>
          {numberWithCommas(product.price * cartProduct.quantity) + '원'}
        </span>
      </li>
    </ul>
  );
};

const ProductForm = ({ router, constructor, queryVars }: any) => {
  const [state, setState] = useState({
    tracking: constructor.tracking,
    // amount: constructor.amount,
  });

  const [updateOneOrderMutation] = useMutation(UPDATE_ONE_ORDER_MUTATION, {
    errorPolicy: 'all',
    refetchQueries: [{ query: ORDER_QUERY, variables: queryVars }],
  });

  interface ComponentState {
    tracking: string;
  }

  const handleChange = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    } as ComponentState);
  };

  const handleSubmit = () => {
    updateOneOrderMutation({
      variables: {
        where: {
          id: constructor.id,
        },
        data: {
          tracking: { set: state.tracking },
          status: { set: 'delivery' },
        },
      },
      update: (_, __) => {
        router.push('/orders');
      },
    });
  };

  const status =
    constructor.status === 'pending'
      ? '결제전'
      : constructor.status === 'success'
      ? '결제완료'
      : constructor.status === 'cancelled'
      ? '결제취소'
      : constructor.status === 'delivery'
      ? '배송처리'
      : '';

  const type = constructor.type === 'nonmember' ? '비회원' : '회원';

  const productIds = constructor.data.products.map((product: any) => {
    return product.id;
  });

  const { data, loading, error } = useQuery(PRODUCTS_QUERY, {
    variables: {
      where: {
        id: {
          in: productIds,
        },
      },
      orderBy: [],
    },
  });

  if (error) return <aside>상품 로딩에 문제가 발생하였습니다.</aside>;
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  return (
    <form
      onSubmit={async (e: any) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex flex-row justify-end items-center">
        {/* <div className="mr-auto">
          <FlatBigButton label="삭제" colored={true} onClick={handleDelete} />
        </div> */}
        <div>
          <FlatBigButton label="취소" colored={false} href="/orders" />
        </div>
        <div className="ml-2">
          <FlatBigButton label="배송처리" colored={true} type="submit" />
        </div>
      </div>
      <div className="py-4 mt-4">
        <div className="max-w-4xl mx-auto block">
          <div className="block">
            <InputString
              label="배송추적"
              value={state.tracking}
              name="tracking"
              onChange={handleChange}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="주문 이름"
              value={constructor.title}
              name="title"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="주문 금액"
              value={numberWithCommas(constructor.amount) + '원'}
              name="price"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="상태"
              value={status}
              name="status"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="구분"
              value={type}
              name="type"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="주문자"
              value={constructor.buyerName}
              name="buyerName"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="주문자 이메일"
              value={constructor.buyerEmail}
              name="buyerEmail"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="주문자 전화번호"
              value={constructor.data.buyer_tel}
              name="buyerTel"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="주소"
              value={constructor.data.buyer_addr}
              name="buyerAddr"
              disabled={true}
            />
          </div>
          <div className="block mt-4 text-sm">
            <div className="font-bold text-gray-600 text-sm">상품 목록</div>
            <ul className="block flex flex-row border-b border-gray-200 pb-2">
              <li style={{ flex: 3 }}>상품</li>
              <li style={{ flex: 1 }}>가격</li>
              <li style={{ flex: 2 }}>수량</li>
              <li style={{ flex: 1 }}>소계</li>
            </ul>
            {constructor.data.products.map((product: any) => {
              if (product.type === 'single') {
                return (
                  <ProductSingleItem
                    key={product.id}
                    cartProduct={product}
                    products={data.products}
                  />
                );
              } else if (product.type === 'option') {
                return (
                  <ProductOptionItems
                    key={product.id}
                    cartProduct={product}
                    products={data.products}
                  />
                );
              }
            })}
          </div>
          <div className="block mt-4">
            <InputString
              label="배송비"
              value={numberWithCommas(3000) + '원'}
              name="logistic"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="총 주문 금액"
              value={numberWithCommas(constructor.amount) + '원'}
              name="price"
              disabled={true}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

// const QueryWrap = ({ args, router }: any) => {
const QueryWrap = ({ router, args }: any) => {
  const queryVars = args;

  const query = useQuery(ORDER_QUERY, {
    variables: queryVars,
    errorPolicy: 'all',
  });

  if (query.error) return <aside>데이터 로딩에 문제가 발생하였습니다.</aside>;
  if (query.loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { order } = query.data;

  return (
    <ProductForm router={router} constructor={order} queryVars={queryVars} />
  );
};

const IndexPage = ({ id }: any) => {
  const router = useRouter();

  const args = {
    where: {
      id,
    },
  };

  return (
    <Layout title="주문 - 배송하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/orders">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>주문 {'>'} 배송하기</span>
          </div>
        </div>
        {/* <QueryWrap args={args} router={router} /> */}
        <QueryWrap router={router} args={args} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}

export default IndexPage;

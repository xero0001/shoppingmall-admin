import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/Layout';
// import FlatBigButton from '../../components/Button/FlatBigButton';
import Loader from '../../components/Loader';
// import { initializeApollo } from '../../lib/apolloClient';
// import { PRODUCT_CATEGORIES_QUERY } from './categories';

export const ORDER_QUERY = gql`
  query order($where: OrderWhereUniqueInput!) {
    order(where: $where) {
      id
      createdAt
      amount
      title
      status
      type
      buyerName
      buyerEmail
      data
    }
  }
`;

export const ORDERS_QUERY = gql`
  query orders(
    $where: OrderWhereInput
    $skip: Int
    $take: Int
    $orderBy: [OrderOrderByInput!]
  ) {
    orders(where: $where, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      createdAt
      amount
      title
      status
      type
      buyerName
      buyerEmail
    }
  }
`;

export const ORDERS_COUNT_QUERY = gql`
  query ordersCount($where: OrderWhereInput) {
    ordersCount(where: $where)
  }
`;

const Status = ({ statusList, value, setValue }: any) => {
  const [show, setShow] = useState(false);

  return (
    <div className="text-2xl font-bold flex flex-row">
      {value.statusId === 'all' && <span>전체주문</span>}
      {value.statusId !== 'all' &&
        statusList.map((status: any) => {
          if (status.id === value.statusId) {
            return <span key={status.name}>{status.name}</span>;
          } else {
            return;
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
          transform={`${show === true ? 'rotate(180)' : 'rotate(0)'}`}
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
                    statusId: 'all',
                  });
                }}
              >
                전체주문
              </span>
            </li>
            {statusList.map((status: any) => {
              return (
                <li key={status.id} className="py-2">
                  <span
                    className="mx-4 cursor-pointer"
                    onClick={() => {
                      setValue({
                        ...value,
                        statusId: status.id,
                      });
                    }}
                  >
                    {status.name}
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

export const ordersQueryVars = {
  skip: 0,
  take: 10,
  where: null,
  orderBy: [{ createdAt: 'desc' }],
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

const OrdersList = ({ queryVars }: any) => {
  const status =
    queryVars.statusId == 'all'
      ? {}
      : {
          equals: queryVars.statusId,
        };

  const queryVariables = {
    where: {
      status,
    },
    take: queryVars.take,
    skip: queryVars.skip,
    orderBy: queryVars.orderBy,
  };

  // console.log(queryVariables);

  const { loading, error, data } = useQuery(ORDERS_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  if (error)
    return (
      <aside className="py-16 text-center">
        주문 로딩에 문제가 발생하였습니다.
      </aside>
    );
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { orders } = data;

  if (orders.length == 0)
    return <div className="py-16 text-center">주문이 존재하지 않습니다.</div>;

  return (
    <>
      {orders.map((order: any) => {
        return (
          <li key={order.id}>
            <div className="flex h-16 items-center justify-center border-b border-gray-400">
              <span style={{ flex: 3 }}>
                <Link href={'/orders/edit/' + order.id}>
                  <a>{order.title}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>{order.amount}</span>
              <span style={{ flex: 1 }}>
                {order.status === 'pending' && '결제전'}
                {order.status === 'success' && '결제완료'}
                {order.status === 'cancelled' && '결제취소'}
              </span>
              <span style={{ flex: 1 }}>
                {order.type === 'nonmember' && '비회원'}
                {order.type === 'member' && '회원'}
              </span>
              <span style={{ flex: 1 }}>{order.buyerName}</span>
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
    statusId: 'all',
    searchInput: '',
    page: 1,
    searchString: '',
  });

  const countQueryVariables = {
    where: {},
  };

  const { loading, data } = useQuery(ORDERS_COUNT_QUERY, {
    variables: countQueryVariables,
    fetchPolicy: 'network-only',
  });

  const statusList = [
    { id: 'pending', name: '결제전' },
    { id: 'success', name: '결제완료' },
    { id: 'cancelled', name: '취소' },
  ];

  return (
    <Layout title="상품">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Status statusList={statusList} value={value} setValue={setValue} />
        </div>
        {/* <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <div>
              <input
                className="border border-gray-400 p-2 text-sm round w-64"
                placeholder="주문 검색"
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
        </div> */}
        <div className="py-4 mt-4">
          <ul>
            <li>
              <div
                className="py-4 border-t border-b-2 border-gray-400 flex flex-row
          items-center"
              >
                <span style={{ flex: 3 }} className="text-gray-500">
                  주문 이름
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  금액
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  상태
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  구분
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  주문자
                </span>
              </div>
            </li>
            <OrdersList
              queryVars={{
                where: value.where,
                skip: value.skip,
                take: value.take,
                orderBy: value.orderBy,
                statusId: value.statusId,
                searchString: value.searchString,
              }}
            />
          </ul>
        </div>
        {loading && <Loader />}
        {!loading && (
          <Pagination
            count={data.ordersCount}
            value={value}
            setValue={setValue}
          />
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;

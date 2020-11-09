import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import Loader from '../../components/Loader';
// import { initializeApollo } from '../../lib/apolloClient';
// import { PRODUCT_CATEGORIES_QUERY } from './categories';

export const NOTICE_QUERY = gql`
  query notice($where: NoticeWhereUniqueInput!) {
    notice(where: $where) {
      id
      createdAt
      title
      content
      category
    }
  }
`;

export const NOTICES_QUERY = gql`
  query notices(
    $where: NoticeWhereInput
    $skip: Int
    $take: Int
    $orderBy: [NoticeOrderByInput!]
  ) {
    notices(where: $where, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      createdAt
      title
      content
      category
    }
  }
`;

export const NOTICES_COUNT_QUERY = gql`
  query noticesCount($where: NoticeWhereInput) {
    noticesCount(where: $where)
  }
`;

const Category = ({ categoryList, value, setValue }: any) => {
  const [show, setShow] = useState(false);

  return (
    <div className="text-2xl font-bold flex flex-row">
      {value.categoryId === 'all' && <span>전체공지</span>}
      {value.categoryId !== 'all' &&
        categoryList.map((category: any) => {
          if (category.id === value.categoryId) {
            return <span key={category.name}>{category.name}</span>;
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
                    categoryId: 'all',
                  });
                }}
              >
                전체공지
              </span>
            </li>
            {categoryList.map((category: any) => {
              return (
                <li key={category.id} className="py-2">
                  <span
                    className="mx-4 cursor-pointer"
                    onClick={() => {
                      setValue({
                        ...value,
                        categoryId: category.id,
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

export const noticesQueryVars = {
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

const NoticesList = ({ queryVars }: any) => {
  const category =
    queryVars.categoryId == 'all'
      ? {}
      : {
          equals: queryVars.categoryId,
        };

  const queryVariables = {
    where: {
      category,
    },
    take: queryVars.take,
    skip: queryVars.skip,
    orderBy: queryVars.orderBy,
  };

  const { loading, error, data } = useQuery(NOTICES_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  if (error)
    return (
      <aside className="py-16 text-center">
        공지 로딩에 문제가 발생하였습니다.
      </aside>
    );
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { notices } = data;

  if (notices.length == 0)
    return <div className="py-16 text-center">공지가 존재하지 않습니다.</div>;

  return (
    <>
      {notices.map((notice: any) => {
        return (
          <li key={notice.id}>
            <div className="flex h-16 items-center justify-center border-b border-gray-400">
              <span style={{ flex: 3 }}>
                <Link href={'/notices/edit/' + notice.id}>
                  <a>{notice.title}</a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>
                {notice.category === 'notice' && '공지'}
                {notice.category === 'event' && '이벤트'}
              </span>
              <span style={{ flex: 1 }} className="text-sm">
                {notice.createdAt.substr(0, 10) +
                  ' ' +
                  notice.createdAt.substr(11, 5)}
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
    categoryId: 'all',
    page: 1,
  });

  const countQueryVariables = {
    where: {},
  };

  const { loading, data } = useQuery(NOTICES_COUNT_QUERY, {
    variables: countQueryVariables,
    fetchPolicy: 'network-only',
  });

  const categoryList = [
    { id: 'notice', name: '공지' },
    { id: 'event', name: '이벤트' },
  ];

  return (
    <Layout title="공지">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Category
            categoryList={categoryList}
            value={value}
            setValue={setValue}
          />
        </div>
        <div className="flex flex-row justify-end items-center">
          <div className="ml-2">
            <FlatBigButton
              label="+ 새 공지"
              href="/notices/add"
              colored={true}
            />
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
                  구분
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  작성일자
                </span>
              </div>
            </li>
            <NoticesList
              queryVars={{
                where: value.where,
                skip: value.skip,
                take: value.take,
                orderBy: value.orderBy,
                categoryId: value.categoryId,
              }}
            />
          </ul>
        </div>
        {loading && <Loader />}
        {!loading && (
          <Pagination
            count={data.noticesCount}
            value={value}
            setValue={setValue}
          />
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;

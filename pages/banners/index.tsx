import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import Loader from '../../components/Loader';
// import { initializeApollo } from '../../lib/apolloClient';
// import { PRODUCT_CATEGORIES_QUERY } from './categories';

export const BANNER_QUERY = gql`
  query banner($where: BannerWhereUniqueInput!) {
    banner(where: $where) {
      id
      imgUrl
      order
      linkUrl
      caption
    }
  }
`;

export const BANNERS_QUERY = gql`
  query banners(
    $where: BannerWhereInput
    $skip: Int
    $take: Int
    $orderBy: [BannerOrderByInput!]
  ) {
    banners(where: $where, skip: $skip, take: $take, orderBy: $orderBy) {
      id
      imgUrl
      order
      linkUrl
      caption
    }
  }
`;

export const BANNERS_COUNT_QUERY = gql`
  query bannersCount($where: BannerWhereInput) {
    bannersCount(where: $where)
  }
`;

export const bannersQueryVars = {
  skip: 0,
  take: 10,
  where: null,
  orderBy: [{ order: 'desc' }],
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

const BannersList = ({ queryVars }: any) => {
  const queryVariables = {
    where: {},
    take: queryVars.take,
    skip: queryVars.skip,
    orderBy: queryVars.orderBy,
  };

  const { loading, error, data } = useQuery(BANNERS_QUERY, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  if (error)
    return (
      <aside className="py-16 text-center">
        배너 로딩에 문제가 발생하였습니다.
      </aside>
    );
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { banners } = data;

  if (banners.length == 0)
    return <div className="py-16 text-center">배너가 존재하지 않습니다.</div>;

  return (
    <>
      {banners.map((banner: any) => {
        return (
          <li key={banner.id}>
            <div className="flex h-16 items-center justify-center border-b border-gray-400">
              <span style={{ flex: 3 }}>
                <Link href={'/banners/edit/' + banner.id}>
                  <a>
                    <div
                      style={{ backgroundImage: `url(${banner.imgUrl})` }}
                      className="w-48 h-16 bg-center bg-cover"
                    />
                  </a>
                </Link>
              </span>
              <span style={{ flex: 1 }}>{banner.order}</span>
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
    orderBy: [{ order: 'asc' }],
    categoryId: 'all',
    page: 1,
  });

  const countQueryVariables = {
    where: {},
  };

  const { loading, data } = useQuery(BANNERS_COUNT_QUERY, {
    variables: countQueryVariables,
    fetchPolicy: 'network-only',
  });

  return (
    <Layout title="배너">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <div className="text-2xl font-bold flex flex-row">
            <span>배너</span>
          </div>
        </div>
        <div className="flex flex-row justify-end items-center">
          <div className="ml-2">
            <FlatBigButton
              label="+ 새 배너"
              href="/banners/add"
              colored={true}
            />
          </div>
        </div>
        <div className="py-4 mt-4">
          <ul>
            <li>
              <div className="py-4 border-t border-b-2 border-gray-400 flex flex-row items-center">
                <span style={{ flex: 3 }} className="text-gray-500">
                  배너 이미지
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  순서
                </span>
              </div>
            </li>
            <BannersList
              queryVars={{
                where: value.where,
                skip: value.skip,
                take: value.take,
                orderBy: value.orderBy,
              }}
            />
          </ul>
        </div>
        {loading && <Loader />}
        {!loading && (
          <Pagination
            count={data.bannersCount}
            value={value}
            setValue={setValue}
          />
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;

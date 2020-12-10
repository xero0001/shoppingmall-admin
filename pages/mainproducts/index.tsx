import { gql, useQuery, useMutation } from '@apollo/client';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import InputString from '../../components/Input/InputString';
import InputImage from '../../components/Input/InputImage';
import InputCheckBox from '../../components/Input/InputCheckBox';

import Loader from '../../components/Loader';

// import { ORDERS_QUERY, ordersQueryVars, ORDER_QUERY } from '../../';
// import { PRODUCT_CATEGORIES_QUERY } from '../../categories/index';

export const META = gql`
  query meta($where: MetaWhereUniqueInput!) {
    meta(where: $where) {
      id
      jsonData
    }
  }
`;

export const UPDATE_ONE_META = gql`
  mutation updateOneMeta(
    $where: MetaWhereUniqueInput!
    $data: MetaUpdateInput!
  ) {
    updateOneMeta(where: $where, data: $data) {
      id
      jsonData
    }
  }
`;

const InputMainproducts = ({ value, handleChange, name, label }: any) => {
  return (
    <>
      <div className="font-bold text-gray-600 text-sm">{label}</div>
      <div className="block rounded-md">
        <ul>
          <li>
            <div className="py-4 border-t border-b-2 border-gray-400 flex flex-row items-center">
              <span style={{ flex: 3 }} className="text-gray-500 mr-4">
                메인상품 이름
              </span>
              <span style={{ flex: 1 }} className="text-gray-500 mr-4">
                메인상품 이미지
              </span>
              <span style={{ flex: 1 }} className="text-gray-500 mr-4">
                메인상품 모바일 이미지
              </span>
            </div>
          </li>
          {value.list.map((item: any, i: number) => {
            return (
              <li key={i}>
                <div className="py-4 border-b border-gray-400 flex flex-row items-center">
                  <span style={{ flex: 3 }} className="text-gray-500 mr-4">
                    <InputString
                      name="name"
                      value={item.name}
                      onChange={(e: any) => {
                        const newName = e.target.value;
                        value.list.splice(i, 1, {
                          ...item,
                          name: newName,
                        });
                        handleChange(name, value);
                      }}
                    />
                  </span>
                  <span style={{ flex: 1 }} className="text-gray-500 mr-4">
                    <InputImage
                      label=""
                      value={item.image}
                      onChange={(url: any) => {
                        value.list.splice(i, 1, {
                          ...item,
                          image: url,
                        });
                        handleChange(name, value);
                      }}
                      size="small"
                      name="image"
                    />
                  </span>
                  <span style={{ flex: 1 }} className="text-gray-500 mr-4">
                    <InputImage
                      label=""
                      value={item.mobileImage}
                      onChange={(url: any) => {
                        value.list.splice(i, 1, {
                          ...item,
                          mobileImage: url,
                        });
                        handleChange(name, value);
                      }}
                      size="small"
                      name="mobileImage"
                    />
                  </span>
                </div>
              </li>
            );
          })}
          {/* <li>
            <div className="flex justify-center items-center mt-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                className="fill-current text-gray-400 hover:text-gray-600 cursor-pointer transition duration-100 ease-in-out"
                onClick={() => {
                  handleChange(name, {
                    list: [
                      ...value.list,
                      {
                        image: '',
                        mobileImage:'',
                        delete: false,
                      },
                    ],
                  });
                }}
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
              </svg>
            </div>
          </li> */}
        </ul>
      </div>
    </>
  );
};

const MetaForm = ({ constructor, queryVars }: any) => {
  const [state, setState] = useState({
    jsonData: {
      list: constructor.jsonData.list.map((item: any) => ({
        name: item.name,
        image: item.image,
        mobileImage: item.mobileImage,
        delete: false,
      })),
    },
  });

  const [updateOneMeta] = useMutation(UPDATE_ONE_META, {
    errorPolicy: 'all',
    refetchQueries: [{ query: META, variables: queryVars }],
  });

  interface ComponentState {
    jsonData: any;
  }

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as ComponentState);
  };

  const handleSubmit = () => {
    updateOneMeta({
      variables: {
        where: {
          id: constructor.id,
        },
        data: {
          jsonData: {
            list: state.jsonData.list.map((item: any) => ({
              name: item.name,
              image: item.image,
              mobileImage: item.mobileImage,
            })),
          },
        },
      },
      update: (_: any, __: any) => {
        alert('수정 완료.');
        // router.push('/orders');
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
        <div className="ml-2">
          <FlatBigButton label="적용" colored={true} type="submit" />
        </div>
      </div>
      <div className="py-4 mt-4">
        <div className="max-w-4xl mx-auto block">
          <div className="block">
            <InputMainproducts
              value={state.jsonData}
              handleChange={handleChange}
              name="jsonData"
              label="메인상품배너 목록"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const QueryWrap = ({ args }: any) => {
  const queryVars = args;

  const query = useQuery(META, {
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

  const { meta } = query.data;

  return <MetaForm constructor={meta} queryVars={queryVars} />;
};

const IndexPage = () => {
  const args = {
    where: {
      id: 'mainproducts',
    },
  };

  const title = '메인상품배너';
  const action = '수정하기';

  return (
    <Layout title={`${title} - ${action}`}>
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <div className="text-2xl font-bold flex flex-row">
            <span>{title + ' > ' + action}</span>
          </div>
        </div>
        <QueryWrap args={args} />
      </div>
    </Layout>
  );
};

export default IndexPage;

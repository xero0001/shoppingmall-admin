import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../../../components/Layout';
import FlatBigButton from '../../../../components/Button/FlatBigButton';
import InputString from '../../../../components/Input/InputString';

export const CREATE_ONE_POST_CATEGORY_MUTATION = gql`
  mutation createOnePost_Category($data: Post_CategoryCreateInput!) {
    createOnePost_Category(data: $data) {
      id
      name
      slug
    }
  }
`;

const CategoryForm = ({ router }: any) => {
  const [state, setState] = useState({
    name: '',
    slug: '',
  });

  const [createOneProductCategoryMutation, { loading, error }] = useMutation(
    CREATE_ONE_POST_CATEGORY_MUTATION,
    {
      variables: {
        data: {
          ...state,
        },
      },
      errorPolicy: 'all',
    }
  );

  const handleChange = (name: string, value: any) => {
    interface ComponentState {
      name: string;
      slug: string;
    }

    setState({
      ...state,
      [name]: value,
    } as ComponentState);
  };

  const handleSubmit = () => {
    createOneProductCategoryMutation({
      update: (_, __) => {
        router.push('/magazine/categories');
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
            type="submit"
            loading={loading}
          />
        </div>
      </div>
      {error && (
        <div className="text-red-700 text-center block mt-8">
          *중복되는 슬러그가 있습니다. 다른 슬러그를 입력해주세요.
        </div>
      )}
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
        </div>
      </div>
    </form>
  );
};

const IndexPage = () => {
  const router = useRouter();

  return (
    <Layout title="매거진 - 카테고리 - 추가하기">
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
              매거진 {'>'} 카테고리 {'>'} 추가하기
            </span>
          </div>
        </div>
        <CategoryForm router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Layout from '../../../../../components/Layout';
import FlatBigButton from '../../../../../components/Button/FlatBigButton';
import InputString from '../../../../../components/Input/InputString';
import Loader from '../../../../../components/Loader';

import { POST_CATEGORY_QUERY } from '../../index';

export const DELETE_ONE_POST_CATEGORY_MUTATION = gql`
  mutation deleteOnePost_Category($where: Post_CategoryWhereUniqueInput!) {
    deleteOnePost_Category(where: $where) {
      id
      name
      slug
    }
  }
`;

export const UPDATE_ONE_POST_CATEGORY_MUTATION = gql`
  mutation updateOnePost_Category(
    $data: Post_CategoryUpdateInput!
    $where: Post_CategoryWhereUniqueInput!
  ) {
    updateOnePost_Category(data: $data, where: $where) {
      id
      name
      slug
    }
  }
`;

const CategoryForm = ({ router, constructor }: any) => {
  const [state, setState] = useState({
    name: constructor.name,
    slug: constructor.slug,
  });

  const [deleteOnePostCategoryMutation] = useMutation(
    DELETE_ONE_POST_CATEGORY_MUTATION,
    {
      variables: {
        where: {
          id: constructor.id,
        },
      },
      errorPolicy: 'all',
    }
  );

  const [updateOnePostCategoryMutation] = useMutation(
    UPDATE_ONE_POST_CATEGORY_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

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

  const handleDelete = () => {
    deleteOnePostCategoryMutation({
      update: (_, __) => {
        router.push('/magazine/categories');
      },
    });
  };

  const handleSubmit = () => {
    const mutationVars = {
      where: {
        id: constructor.id,
      },
      data: {
        name: {
          set: state.name,
        },
        slug: {
          set: state.slug,
        },
      },
    };

    updateOnePostCategoryMutation({
      variables: mutationVars,
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
        <div className="mr-auto">
          <FlatBigButton label="삭제" colored={true} onClick={handleDelete} />
        </div>
        <div>
          <FlatBigButton
            label="취소"
            colored={false}
            href="/magazine/categories"
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
        </div>
      </div>
    </form>
  );
};

const QueryWrap = ({ args, router }: any) => {
  const queryVars = args;

  const query = useQuery(POST_CATEGORY_QUERY, {
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

  const { postCategory } = query.data;

  return <CategoryForm router={router} constructor={postCategory} />;
};

const CurrentLocation = ({ id }: any) => {
  const queryVars = {
    where: {
      id: parseInt(id as string),
    },
  };

  const { loading, error, data } = useQuery(POST_CATEGORY_QUERY, {
    variables: queryVars,
  });

  if (error) return <></>;
  if (loading) return <></>;

  const { postCategory } = data;

  return <>{postCategory.name}</>;
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
    <Layout title="매거진 - 카테고리 - 수정하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href={'/magazine/categories'}>
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>
              매거진 {'>'} 카테고리 {'>'} 수정하기:{' '}
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

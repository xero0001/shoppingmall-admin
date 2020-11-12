import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { BoldExtension } from 'remirror/extension/bold';
import { ItalicExtension } from 'remirror/extension/italic';
import { UnderlineExtension } from 'remirror/extension/underline';
import { fromHtml, toHtml } from 'remirror/core';
import { ImageExtension } from 'remirror/extension/image';
import { useManager } from 'remirror/react';
import { CorePreset } from 'remirror/preset/core';

import Layout from '../../../components/Layout';
import FlatBigButton from '../../../components/Button/FlatBigButton';
import InputString from '../../../components/Input/InputString';
import InputSwitch from '../../../components/Input/InputSwitch';
import InputImage from '../../../components/Input/InputImage';
import Loader from '../../../components/Loader';
import RemirrorEditor from '../../../components/Input/RemirrorEditor';

import { POST_CATEGORIES_QUERY } from '../categories/index';

export const CREATE_ONE_POST_MUTATION = gql`
  mutation createOnePost($data: PostCreateInput!) {
    createOnePost(data: $data) {
      id
      createdAt
      published
      title
      thumbnail
      content
      category {
        id
        name
        slug
      }
    }
  }
`;

const CategoryItems = ({ value, categories, name, handleChange }: any) => {
  return (
    <>
      {categories.map((category: any) => {
        const checked = value === category.id;

        return (
          <li key={category.id}>
            <div
              className={`flex py-2 px-4 items-center justify-start border-b
                  border-gray-400 cursor-pointer ${
                    checked && 'text-white bg-gray-600 font-bold'
                  }`}
              onClick={() => {
                handleChange(name, category.id);
              }}
            >
              <span>{category.name + ' [' + category.slug + ']'}</span>
            </div>
          </li>
        );
      })}
    </>
  );
};

const CategoriesSingle = ({
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
          <li>
            <span
              className={`flex py-2 px-4 items-center justify-start border-b
                  border-gray-400 cursor-pointer ${
                    value === -1 && 'text-white bg-gray-600 font-bold'
                  }`}
            >
              없음
            </span>
          </li>
          <CategoryItems
            value={value}
            categories={categories}
            name={name}
            handleChange={handleChange}
          />
        </ul>
      </div>
    </>
  );
};

const PostForm = ({ router }: any) => {
  const extensionTemplate = () => [
    new CorePreset({}),
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension(),
    new ImageExtension(),
  ];

  const manager = useManager(extensionTemplate);

  const [state, setState] = useState({
    title: '',
    published: false,
    thumbnail: '',
    categoryId: -1,
    content: manager.createState({
      content: '<p></p>',
      stringHandler: fromHtml,
    }),
  });

  const query = useQuery(POST_CATEGORIES_QUERY, {
    variables: {
      where: {},
    },
  });

  const [createOnePostMutation, { loading }] = useMutation(
    CREATE_ONE_POST_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

  interface ComponentState {
    title: string;
    published: boolean;
    thumbnail: string;
    categoryId: any;
    content: any;
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

  const { postCategories } = query.data;

  const handleSubmit = () => {
    if (state.categoryId === -1) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    let html = '<p></p>';

    if (state.content) {
      html = toHtml({ node: state.content.doc, schema: state.content.schema });
    }

    createOnePostMutation({
      variables: {
        data: {
          title: state.title,
          published: state.published,
          thumbnail: state.thumbnail,
          category: {
            connect: {
              id: state.categoryId,
            },
          },
          content: html,
        },
      },
      update: (_, __) => {
        router.push('/magazine');
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
          <FlatBigButton label="취소" colored={false} href="/magazine" />
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
      <div className="py-4 mt-4">
        <div className="max-w-3xl mx-auto block">
          <div className="block">
            <InputString
              label="매거진 제목"
              value={state.title}
              handleChange={handleChange}
              name="title"
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
            <CategoriesSingle
              value={state.categoryId}
              handleChange={handleChange}
              name="categoryId"
              label="카테고리"
              categories={postCategories}
            />
          </div>
          <div className="block mt-4">
            <InputImage
              label="썸네일 이미지"
              value={state.thumbnail}
              handleChange={handleChange}
              name="thumbnail"
            />
          </div>
          <div className="block mt-4">
            <RemirrorEditor
              label="매거진 내용"
              name="content"
              value={state.content}
              manager={manager}
              handleChange={handleChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const IndexPage = () => {
  const router = useRouter();

  return (
    <Layout title="매거진 - 추가하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/magazine">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>매거진 {'>'} 추가하기</span>
          </div>
        </div>
        <PostForm router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

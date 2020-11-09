import { gql, useMutation } from '@apollo/client';
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
import InputOption from '../../../components/Input/InputOption';

import RemirrorEditor from '../../../components/Input/RemirrorEditor';

import { NOTICES_QUERY, noticesQueryVars } from '../index';

export const CREATE_ONE_NOTICE_MUTATION = gql`
  mutation createOneNotice($data: NoticeCreateInput!) {
    createOneNotice(data: $data) {
      id
    }
  }
`;

const NoticeForm = ({ router }: any) => {
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
    category: 'notice',
    content: manager.createState({
      content: '<p></p>',
      stringHandler: fromHtml,
    }),
  });

  const [createOneNoticeMutation, createOneNotice] = useMutation(
    CREATE_ONE_NOTICE_MUTATION,
    {
      errorPolicy: 'all',
      refetchQueries: [{ query: NOTICES_QUERY, variables: noticesQueryVars }],
    }
  );

  interface ComponentState {
    title: string;
    content: any;
    category: string;
  }

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as ComponentState);
  };

  const handleSubmit = () => {
    let html = '<p></p>';

    if (state.content) {
      html = toHtml({ node: state.content.doc, schema: state.content.schema });
    }

    createOneNoticeMutation({
      variables: {
        data: {
          ...state,
          content: html,
        },
      },
      update: (_, __) => {
        router.push('/notices');
      },
    });
  };

  const categoryList = [
    { id: 'notice', name: '공지' },
    { id: 'event', name: '이벤트' },
  ];

  return (
    <form
      onSubmit={async (e: any) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex flex-row justify-end items-center">
        <div>
          <FlatBigButton label="취소" colored={false} href="/notices" />
        </div>
        <div className="ml-2">
          <FlatBigButton
            label="생성"
            colored={true}
            type="submit"
            loading={createOneNotice.loading}
          />
        </div>
      </div>
      <div className="py-4 mt-4">
        <div className="max-w-3xl mx-auto block">
          <div className="block">
            <InputString
              label="공지 제목"
              value={state.title}
              handleChange={handleChange}
              name="title"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <InputOption
              label="카테고리"
              value={state.category}
              handleChange={handleChange}
              name="category"
              options={categoryList}
            />
          </div>
          <div className="block mt-4">
            <RemirrorEditor
              label="공지 내용"
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
    <Layout title="공지 - 추가하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/products">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>공지 {'>'} 추가하기</span>
          </div>
        </div>
        <NoticeForm router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

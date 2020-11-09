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

import Layout from '../../../../components/Layout';
import FlatBigButton from '../../../../components/Button/FlatBigButton';
import InputString from '../../../../components/Input/InputString';
import InputOption from '../../../../components/Input/InputOption';
import Loader from '../../../../components/Loader';
// import TextEditor from '../../../components/Input/TextEditor';
import RemirrorEditor from '../../../../components/Input/RemirrorEditor';

import { NOTICES_QUERY, noticesQueryVars, NOTICE_QUERY } from '../../index';

export const UPDATE_ONE_NOTICE_MUTATION = gql`
  mutation updateOneNotice(
    $where: NoticeWhereUniqueInput!
    $data: NoticeUpdateInput!
  ) {
    updateOneNotice(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_ONE_NOTICE_MUTATION = gql`
  mutation deleteOneNotice($where: NoticeWhereUniqueInput!) {
    deleteOneNotice(where: $where) {
      id
    }
  }
`;

const NoticeForm = ({ router, constructor, args }: any) => {
  const extensionTemplate = () => [
    new CorePreset({}),
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension(),
    new ImageExtension(),
  ];

  const manager = useManager(extensionTemplate);

  const [state, setState] = useState({
    title: constructor.title,
    category: constructor.category,
    content: manager.createState({
      content: constructor.content,
      stringHandler: fromHtml,
    }),
  });

  const [updateOneNoticeMutation, { error }] = useMutation(
    UPDATE_ONE_NOTICE_MUTATION,
    {
      errorPolicy: 'all',
      refetchQueries: [
        { query: NOTICES_QUERY, variables: noticesQueryVars },
        { query: NOTICE_QUERY, variables: args },
      ],
    }
  );

  const [deleteOneNoticeMutation] = useMutation(DELETE_ONE_NOTICE_MUTATION, {
    variables: args,
    errorPolicy: 'all',
    refetchQueries: [{ query: NOTICES_QUERY, variables: noticesQueryVars }],
  });

  interface ComponentState {
    title: string;
    category: string;
    content: any;
  }

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as ComponentState);
  };

  const handleDelete = () => {
    deleteOneNoticeMutation({
      update: (_, __) => {
        router.push('/notices');
      },
    });
  };

  const handleSubmit = () => {
    let html = '<p></p>';

    if (state.content) {
      html = toHtml({ node: state.content.doc, schema: state.content.schema });
    }

    updateOneNoticeMutation({
      variables: {
        where: {
          id: args.where.id,
        },
        data: {
          title: {
            set: state.title,
          },
          category: {
            set: state.category,
          },
          content: {
            set: html,
          },
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
        <div className="mr-auto">
          <FlatBigButton label="삭제" colored={true} onClick={handleDelete} />
        </div>
        <div>
          <FlatBigButton label="취소" colored={false} href="/notices" />
        </div>
        <div className="ml-2">
          <FlatBigButton label="수정" colored={true} type="submit" />
        </div>
      </div>
      {error &&
        error.graphQLErrors.map(({ message }, i) => {
          if (message === 'duplicate') {
            return (
              <div key={i} className="text-red-700 text-center block mt-8">
                *중복되는 슬러그가 있습니다. 다른 슬러그를 입력해주세요.
              </div>
            );
          } else {
            return <></>;
          }
        })}
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

const QueryWrap = ({ args, router }: any) => {
  const queryVars = args;

  const query = useQuery(NOTICE_QUERY, {
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

  const { notice } = query.data;

  return <NoticeForm router={router} constructor={notice} args={args} />;
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
    <Layout title="공지 - 수정하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/notices">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>공지 {'>'} 수정하기</span>
          </div>
        </div>
        <QueryWrap args={args} router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

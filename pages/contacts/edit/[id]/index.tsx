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
import Loader from '../../../../components/Loader';
// import TextEditor from '../../../components/Input/TextEditor';
import RemirrorEditor from '../../../../components/Input/RemirrorEditor';

import { CONTACT_QUERY } from '../../index';

export const UPDATE_ONE_CONTACT_MUTATION = gql`
  mutation updateOneContact(
    $data: ContactUpdateInput!
    $where: ContactWhereUniqueInput!
  ) {
    updateOneContact(where: $where, data: $data) {
      id
    }
  }
`;

export const CREATE_ONE_REPLY_MUTATION = gql`
  mutation createOneReply($where: IdCustomWhere!, $data: ContactCreateInput!) {
    createOneReply(where: $where, data: $data) {
      id
    }
  }
`;

const ContactForm = ({ router, constructor, args }: any) => {
  const extensionTemplate = () => [
    new CorePreset({}),
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension(),
    new ImageExtension(),
  ];

  const manager = useManager(extensionTemplate);
  const manager2 = useManager(extensionTemplate);

  const managedState = manager2.createState({
    content: constructor.content,
    stringHandler: fromHtml,
  });

  const [state, setState] = useState(
    constructor.isReply
      ? {
          title: constructor.title,
          content: manager.createState({
            content: constructor.content,
            stringHandler: fromHtml,
          }),
        }
      : {
          title: '답변: ' + constructor.title,
          content: manager.createState({
            content: '<p></p>',
            stringHandler: fromHtml,
          }),
        }
  );

  const [createOneReplyMutation, createOneReply] = useMutation(
    CREATE_ONE_REPLY_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

  const [updateOneContactMutation, updateOneContact] = useMutation(
    UPDATE_ONE_CONTACT_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

  interface ComponentState {
    title: string;
    content: any;
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

    if (constructor.isReply) {
      updateOneContactMutation({
        variables: {
          ...args,
          data: {
            title: { set: state.title },
            content: { set: html },
          },
        },
        update: (_, __) => {
          router.push('/contacts');
        },
      });
    } else {
      createOneReplyMutation({
        variables: {
          ...args,
          data: {
            title: state.title,
            content: html,
          },
        },
        update: (_, __) => {
          router.push('/contacts');
        },
      });
    }
  };

  return (
    <form
      onSubmit={async (e: any) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="flex flex-row justify-end items-center">
        <div className="mr-auto"></div>
        <div>
          <FlatBigButton label="취소" colored={false} href="/contacts" />
        </div>
        <div className="ml-2">
          <FlatBigButton
            label="답변"
            colored={true}
            type="submit"
            loading={createOneReply.loading || updateOneContact.loading}
          />
        </div>
      </div>
      <div className="py-4 mt-4">
        <div className="max-w-3xl mx-auto block">
          {!constructor.isReply && (
            <>
              <div className="block">
                <InputString
                  label="문의 제목"
                  value={constructor.title}
                  handleChange={() => {}}
                  name="title"
                  disabled={true}
                />
              </div>
              <div className="block mt-4">
                <RemirrorEditor
                  label="문의 내용"
                  name="content"
                  value={managedState}
                  manager={manager2}
                  handleChange={() => {}}
                />
              </div>
            </>
          )}
          <div className="block mt-4">
            <InputString
              label="답변 제목"
              value={state.title}
              handleChange={handleChange}
              name="title"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <RemirrorEditor
              label="답변 내용"
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

  const query = useQuery(CONTACT_QUERY, {
    variables: queryVars,
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
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

  const { contact } = query.data;

  return <ContactForm router={router} constructor={contact} args={args} />;
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
    <Layout title="문의 - 답변하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/contacts">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>문의 {'>'} 답변하기</span>
          </div>
        </div>
        <QueryWrap args={args} router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

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
import InputImage from '../../../components/Input/InputImage';

import RemirrorEditor from '../../../components/Input/RemirrorEditor';

export const CREATE_ONE_BANNER_MUTATION = gql`
  mutation createOneBanner($data: BannerCreateInput!) {
    createOneBanner(data: $data) {
      id
    }
  }
`;

const BannerForm = ({ router }: any) => {
  const extensionTemplate = () => [
    new CorePreset({}),
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension(),
    new ImageExtension(),
  ];

  const manager = useManager(extensionTemplate);

  const [state, setState] = useState({
    linkUrl: '',
    imgUrl: '',
    order: 0,
    caption: manager.createState({
      content: '<p></p>',
      stringHandler: fromHtml,
    }),
  });

  const [createOneBannerMutation, createOneBanner] = useMutation(
    CREATE_ONE_BANNER_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

  interface ComponentState {
    linkUrl: string;
    imgUrl: string;
    order: number;
    caption: any;
  }

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as ComponentState);
  };

  const handleSubmit = () => {
    let html = '<p></p>';

    if (state.caption) {
      html = toHtml({ node: state.caption.doc, schema: state.caption.schema });
    }

    createOneBannerMutation({
      variables: {
        data: {
          ...state,
          caption: html,
        },
      },
      update: (_, __) => {
        router.push('/banners');
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
          <FlatBigButton label="취소" colored={false} href="/banners" />
        </div>
        <div className="ml-2">
          <FlatBigButton
            label="생성"
            colored={true}
            type="submit"
            loading={createOneBanner.loading}
          />
        </div>
      </div>
      <div className="py-4 mt-4">
        <div className="max-w-3xl mx-auto block">
          <div className="block">
            <InputImage
              label="배너 이미지"
              value={state.imgUrl}
              handleChange={handleChange}
              name="imgUrl"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="링크 주소"
              value={state.linkUrl}
              handleChange={handleChange}
              name="linkUrl"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="순서"
              value={state.order}
              handleChange={handleChange}
              name="order"
              type="number"
              required={true}
            />
          </div>
          <div className="block mt-4">
            <RemirrorEditor
              label="캡션"
              name="caption"
              value={state.caption}
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
    <Layout title="배너 - 추가하기">
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
            <span>배너 {'>'} 추가하기</span>
          </div>
        </div>
        <BannerForm router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

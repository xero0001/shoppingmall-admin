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
import InputImage from '../../../../components/Input/InputImage';
import Loader from '../../../../components/Loader';
// import TextEditor from '../../../components/Input/TextEditor';
import RemirrorEditor from '../../../../components/Input/RemirrorEditor';

import { BANNER_QUERY } from '../../index';

export const UPDATE_ONE_BANNER_MUTATION = gql`
  mutation updateOneBanner(
    $where: BannerWhereUniqueInput!
    $data: BannerUpdateInput!
  ) {
    updateOneBanner(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_ONE_BANNER_MUTATION = gql`
  mutation deleteOneBanner($where: BannerWhereUniqueInput!) {
    deleteOneBanner(where: $where) {
      id
    }
  }
`;

const BannerForm = ({ router, constructor, args }: any) => {
  const extensionTemplate = () => [
    new CorePreset({}),
    new BoldExtension(),
    new ItalicExtension(),
    new UnderlineExtension(),
    new ImageExtension(),
  ];

  const manager = useManager(extensionTemplate);

  const [state, setState] = useState({
    linkUrl: constructor.linkUrl,
    imgUrl: constructor.imgUrl,
    order: constructor.order,
    caption: manager.createState({
      content: constructor.caption,
      stringHandler: fromHtml,
    }),
  });

  const [updateOneBannerMutation, updateOneBanner] = useMutation(
    UPDATE_ONE_BANNER_MUTATION,
    {
      errorPolicy: 'all',
    }
  );

  const [deleteOneBannerMutation] = useMutation(DELETE_ONE_BANNER_MUTATION, {
    variables: args,
    errorPolicy: 'all',
  });

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

  const handleDelete = () => {
    deleteOneBannerMutation({
      update: (_, __) => {
        router.push('/banners');
      },
    });
  };

  const handleSubmit = () => {
    let html = '<p></p>';

    if (state.caption) {
      html = toHtml({ node: state.caption.doc, schema: state.caption.schema });
    }

    updateOneBannerMutation({
      variables: {
        where: {
          id: args.where.id,
        },
        data: {
          imgUrl: {
            set: state.imgUrl,
          },
          linkUrl: {
            set: state.linkUrl,
          },
          order: {
            set: state.order,
          },
          caption: {
            set: html,
          },
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
        <div className="mr-auto">
          <FlatBigButton label="삭제" colored={true} onClick={handleDelete} />
        </div>
        <div>
          <FlatBigButton label="취소" colored={false} href="/banners" />
        </div>
        <div className="ml-2">
          <FlatBigButton
            label="수정"
            colored={true}
            type="submit"
            loading={updateOneBanner.loading}
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

const QueryWrap = ({ args, router }: any) => {
  const queryVars = args;

  const query = useQuery(BANNER_QUERY, {
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

  const { banner } = query.data;

  return <BannerForm router={router} constructor={banner} args={args} />;
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
    <Layout title="배너 - 수정하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/banners">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>배너 {'>'} 수정하기</span>
          </div>
        </div>
        <QueryWrap args={args} router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

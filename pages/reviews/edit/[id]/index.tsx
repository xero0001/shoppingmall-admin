import { gql, useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { useState } from 'react';

// import { BoldExtension } from 'remirror/extension/bold';
// import { ItalicExtension } from 'remirror/extension/italic';
// import { UnderlineExtension } from 'remirror/extension/underline';
// import { fromHtml, toHtml } from 'remirror/core';
// import { ImageExtension } from 'remirror/extension/image';
// import { useManager } from 'remirror/react';
// import { CorePreset } from 'remirror/preset/core';

import Layout from '../../../../components/Layout';
import FlatBigButton from '../../../../components/Button/FlatBigButton';
import InputString from '../../../../components/Input/InputString';
import InputRate from '../../../../components/Input/InputRate';
// import InputSwitch from '../../../../components/Input/InputSwitch';
// import InputCheckBox from '../../../../components/Input/InputCheckBox';
// import InputImage from '../../../../components/Input/InputImage';
import Loader from '../../../../components/Loader';
// import TextEditor from '../../../components/Input/TextEditor';
// import RemirrorEditor from '../../../../components/Input/RemirrorEditor';

import { REVIEWS_QUERY, REVIEW_QUERY } from '../../index';

export const BEST_REVIEW_MUTATION = gql`
  mutation bestReview($id: Int!) {
    bestReview(id: $id) {
      id
    }
  }
`;

export const DELETE_ONE_REVIEW_MUTATION = gql`
  mutation deleteOneReview($where: ReviewWhereUniqueInput!) {
    deleteOneReview(where: $where) {
      id
    }
  }
`;

const CategoryItems = ({
  value,
  categories,
  parentId,
  depth,
  name,
  handleChange,
}: any) => {
  return (
    <>
      {categories.map((category: any) => {
        const checked = value.some(
          (categoryId: any) => categoryId === category.id
        );

        if (category.parentId === parentId) {
          return (
            <li key={category.id}>
              <div
                className={`flex py-2 px-4 items-center justify-start border-b
                  border-gray-400 cursor-pointer ${
                    checked && 'text-white bg-gray-600 font-bold'
                  }`}
                onClick={() => {
                  let newValue = [...value];
                  let found = -1;

                  for (let i = 0; i < newValue.length; i++) {
                    if (newValue[i] === category.id) {
                      found = i;
                      break;
                    }
                  }

                  if (found === -1) {
                    newValue.push(category.id);
                  } else {
                    newValue.splice(found, 1);
                  }
                  handleChange(name, newValue);
                }}
              >
                {depth > 1 && (
                  <span className={`pl-${((depth - 1) * 4).toString()}`} />
                )}
                {depth > 0 && (
                  <span className="pr-1">
                    <svg
                      fill="white"
                      width="15px"
                      height="17px"
                      viewBox="0 0 15 17"
                      version="1.1"
                    >
                      <g
                        id="Icons"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          id="Rounded"
                          transform="translate(-716.000000, -3436.000000)"
                        >
                          <g
                            id="Navigation"
                            transform="translate(100.000000, 3378.000000)"
                          >
                            <g
                              id="-Round-/-Navigation-/-subdirectory_arrow_right"
                              transform="translate(612.000000, 54.000000)"
                            >
                              <g transform="translate(0.000000, 0.000000)">
                                <polygon
                                  id="Path"
                                  opacity="0.87"
                                  points="24 24 0 24 0 0 24 0"
                                />
                                <path
                                  d="M18.29,15.71 L13.71,20.29 C13.32,20.68 12.68,20.68 12.29,20.29 C11.9,19.9 11.9,19.26 12.29,18.87 L15.17,16 L5,16 C4.45,16 4,15.55 4,15 L4,5 C4,4.45 4.45,4 5,4 C5.55,4 6,4.45 6,5 L6,14 L15.17,14 L12.29,11.13 C11.9,10.74 11.9,10.1 12.29,9.71 C12.68,9.32 13.32,9.32 13.71,9.71 L18.29,14.29 C18.68,14.68 18.68,15.32 18.29,15.71 Z"
                                  id="🔹-Icon-Color"
                                  // fill="#1D1D1D"
                                  fill={`${checked ? 'white' : 'black'}`}
                                />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                )}
                <span>{category.name + ' [' + category.slug + ']'}</span>
              </div>
              {category.child.length > 0 && (
                <ul>
                  <CategoryItems
                    value={value}
                    categories={categories}
                    parentId={category.id}
                    depth={depth + 1}
                    name={name}
                    handleChange={handleChange}
                  />
                </ul>
              )}
            </li>
          );
        } else {
          return;
        }
      })}
    </>
  );
};

const ReviewForm = ({ router, constructor, args }: any) => {
  const [bestReviewMutation, { loading }] = useMutation(BEST_REVIEW_MUTATION, {
    errorPolicy: 'all',
    refetchQueries: [
      { query: REVIEWS_QUERY, variables: {} },
      { query: REVIEW_QUERY, variables: args },
    ],
    onCompleted: () => {
      console.log('AA');
    },
    update: () => {
      console.log('?A');
      router.push('/reviews');
    },
  });

  const [deleteOneReviewMutation] = useMutation(DELETE_ONE_REVIEW_MUTATION, {
    variables: args,
    errorPolicy: 'all',
    refetchQueries: [{ query: REVIEWS_QUERY, variables: {} }],
  });

  const handleDelete = () => {
    deleteOneReviewMutation({
      update: (_, __) => {
        router.push('/reviews');
      },
    });
  };

  return (
    <form
      onSubmit={async (e: any) => {
        e.preventDefault();
        bestReviewMutation({
          variables: {
            ...args.where,
          },
        });
      }}
    >
      <div className="flex flex-row justify-end items-center">
        <div className="mr-auto">
          <FlatBigButton label="삭제" colored={true} onClick={handleDelete} />
        </div>
        <div>
          <FlatBigButton label="취소" colored={false} href="/products" />
        </div>
        <div className="ml-2">
          <FlatBigButton
            label="베스트 리뷰 선정"
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
              label="작성자"
              value={constructor.user.name}
              handleChange={() => {}}
              name="title"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputString
              label="작성자 id"
              value={constructor.user.username}
              handleChange={() => {}}
              name="username"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <InputRate
              label="평점"
              value={constructor.rate}
              handleChange={() => {}}
              name="rate"
              disabled={true}
            />
          </div>
          <div className="block mt-4">
            <div className="font-bold text-gray-600 text-sm">작성내용</div>
            <textarea
              value={constructor.content}
              name="content"
              className="w-full h-auto p-4"
              // required={true}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const QueryWrap = ({ args, router }: any) => {
  const queryVars = args;

  const query = useQuery(REVIEW_QUERY, {
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

  const { review } = query.data;

  return <ReviewForm router={router} constructor={review} args={args} />;
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
    <Layout title="리뷰 - 수정하기">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          <Link href="/reviews">
            <a>
              <div className="text-base font-bold text-gray-500 mb-2">
                {'<'} 뒤로가기
              </div>
            </a>
          </Link>
          <div className="text-2xl font-bold flex flex-row">
            <span>리뷰 {'>'} 수정하기</span>
          </div>
        </div>
        <QueryWrap args={args} router={router} />
      </div>
    </Layout>
  );
};

export default IndexPage;

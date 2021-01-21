import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import InputString from '../../components/Input/InputString';
import InputSwitch from '../../components/Input/InputSwitch';

export const UPDATE_ONE_META_MUTATION = gql`
  mutation updateOneMeta(
    $data: MetaUpdateInput!
    $where: MetaWhereUniqueInput!
  ) {
    updateOneMeta(data: $data, where: $where) {
      id
      jsonData
    }
  }
`;

export const META = gql`
  query meta($where: MetaWhereUniqueInput!) {
    meta(where: $where) {
      id
      jsonData
    }
  }
`;

const DiscountsForm = ({ meta }: any) => {
  const [state, setState] = useState({
    ...meta.data.meta.jsonData,
  });

  const [updateMetaMutation, updateMeta] = useMutation(
    UPDATE_ONE_META_MUTATION,
    {
      variables: {
        where: {
          id: 'discounts',
        },
        data: {
          jsonData: {
            ...state,
          },
        },
      },
      update: () => {
        alert('설정 적용 완료');
      },
    }
  );

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as any);
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex">
          <div className="ml-2">
            <FlatBigButton
              label="설정 적용"
              colored={true}
              onClick={() => {
                if (
                  state.bestReviewType === true &&
                  state.bestReviewAmount >= 100
                ) {
                  alert('할인율을 확인해주세요.');
                } else {
                  updateMetaMutation();
                }
              }}
              loading={updateMeta.loading}
            />
          </div>
        </div>
      </div>
      <form>
        <div className="mt-4">
          <InputString
            label="리뷰 작성시 지급 포인트"
            name="review"
            value={state.review}
            handleChange={handleChange}
            type="number"
          />
        </div>
        <div className="mt-4">
          <InputString
            label="무료배송 기준가격"
            name="freelogistics"
            value={state.freelogistics}
            handleChange={handleChange}
            type="number"
          />
        </div>
        <div className="mt-4">
          <InputSwitch
            value={state.bestReviewType}
            handleChange={handleChange}
            name="bestReviewType"
            label="베스트리뷰 현금할인 / 퍼센트할인"
            color="green"
          />
        </div>
        <div className="mt-4">
          <InputString
            label="베스트 리뷰 할인량 / 할인율"
            name="bestReviewAmount"
            value={state.bestReviewAmount}
            handleChange={handleChange}
            type="number"
          />
        </div>
        <div className="mt-4">
          <InputString
            label="베스트 리뷰 쿠폰 이름"
            name="bestReviewCouponName"
            value={state.bestReviewCouponName}
            handleChange={handleChange}
            type="text"
          />
        </div>
      </form>
    </>
  );
};

const IndexPage = () => {
  const meta = useQuery(META, {
    variables: {
      where: {
        id: 'discounts',
      },
    },
  });

  return (
    <Layout title="쿠폰/적립금">
      <div className="text-2xl font-bold flex flex-row mt-8 ml-4">
        <span>{'설정 > 수정하기'}</span>
      </div>
      <div className="max-w-screen-sm mx-auto block">
        <div className="px-4 py-8">
          {!meta.loading && <DiscountsForm meta={meta} />}
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

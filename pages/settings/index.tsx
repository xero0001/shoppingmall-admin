import { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import FlatBigButton from '../../components/Button/FlatBigButton';
import InputString from '../../components/Input/InputString';
import InputSwitch from '../../components/Input/InputSwitch';

export const GIVE_COUPONS_MUTATION = gql`
  mutation giveCoupons(
    $type: Int!
    $saleAmount: Int!
    $name: String!
    $expiresAt: Int!
  ) {
    giveCoupons(
      type: $type
      saleAmount: $saleAmount
      name: $name
      expiresAt: $expiresAt
    )
  }
`;

export const GIVE_POINTS_MUTATION = gql`
  mutation givePoints($points: Int!) {
    givePoints(points: $points)
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

const today = new Date();

const DiscountsForm = ({ meta }: any) => {
  console.log(meta);
  const [state, setState] = useState({
    ...meta.data.meta.jsonData,
  });

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as any);
  };

  return (
    <form>
      <div className="mt-4">
        <InputString
          label="리뷰 포인트"
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
  );
};

const IndexPage = () => {
  const [state, setState] = useState({
    type: false,
    saleAmount: 0,
    points: 0,
    name: '할인쿠폰',
    expiresAt:
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate(),
  });

  const [couponSuccessState, setCouponSuccessState] = useState(false);

  const [pointSuccessState, setPointSuccessState] = useState(false);

  const meta = useQuery(META, {
    variables: {
      where: {
        id: 'discounts',
      },
    },
  });

  const [giveCouponsMutation, giveCoupons] = useMutation(
    GIVE_COUPONS_MUTATION,
    {
      variables: {
        type: state.type ? 1 : 0,
        name: state.name,
        saleAmount: state.saleAmount,
        expiresAt: state.expiresAt,
      },
      update: () => {
        setCouponSuccessState(true);
      },
    }
  );

  const [givePointsMutation, givePoints] = useMutation(GIVE_POINTS_MUTATION, {
    variables: {
      points: state.points,
    },
    update: () => {
      setPointSuccessState(true);
    },
  });

  const handleChange = (name: string, value: any) => {
    setState({
      ...state,
      [name]: value,
    } as any);
  };

  return (
    <Layout title="쿠폰/적립금">
      <div className="text-2xl font-bold flex flex-row mt-8 ml-4">
        <span>{'설정 > 수정하기'}</span>
      </div>
      <div className="max-w-screen-sm mx-auto block">
        <div className="px-4 py-8">
          <div className="flex flex-row justify-between items-center">
            <div className="flex">
              <div className="ml-2">
                <FlatBigButton
                  label="설정 적용"
                  colored={true}
                  onClick={() => {
                    giveCouponsMutation();
                  }}
                  loading={giveCoupons.loading}
                />
              </div>
            </div>
          </div>
          {!meta.loading && <DiscountsForm meta={meta} />}
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

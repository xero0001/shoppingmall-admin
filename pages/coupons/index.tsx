import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
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

const today = new Date();

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
      <div className="max-w-screen-sm mx-auto block">
        <div className="px-4 py-8">
          <div className="flex flex-row justify-between items-center">
            <div className="flex">
              <div className="ml-2">
                <FlatBigButton
                  label="쿠폰 전체 발행"
                  colored={true}
                  onClick={() => {
                    giveCouponsMutation();
                  }}
                  loading={giveCoupons.loading}
                />
              </div>
            </div>
          </div>
          {couponSuccessState && (
            <div className="block text-sm font-bold text-gray-400">
              *지급 성공
            </div>
          )}
          <div className="mt-4">
            <InputSwitch
              value={state.type}
              handleChange={handleChange}
              name="type"
              label="현금할인 / 퍼센트할인"
              color="green"
            />
          </div>
          <div className="mt-4">
            <InputString
              label={state.type ? '할인 퍼센트' : '할인 현금'}
              name="saleAmount"
              // max={state.type ? 90 : 1000000}
              value={state.saleAmount}
              handleChange={handleChange}
              type="number"
            />
          </div>
          <div className="mt-4">
            <InputString
              label="쿠폰 이름"
              name="name"
              value={state.name}
              handleChange={handleChange}
              type="text"
            />
          </div>
          <div className="mt-4">
            <InputString
              label="쿠폰 만료일"
              name="expiresAt"
              value={state.expiresAt}
              handleChange={handleChange}
              type="number"
            />
          </div>
        </div>
        <div className="px-4 py-8">
          <div className="flex flex-row justify-between items-center">
            <div className="flex">
              <div className="ml-2">
                <FlatBigButton
                  label="적립금 전체 지급"
                  colored={false}
                  loading={givePoints.loading}
                  onClick={() => {
                    givePointsMutation();
                  }}
                />
              </div>
            </div>
            {pointSuccessState && (
              <div className="block text-sm font-bold text-gray-400">
                *지급 성공
              </div>
            )}
          </div>
          <div className="py-4 mt-4">
            <InputString
              label="적립금"
              name="points"
              value={state.points}
              handleChange={handleChange}
              type="number"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

// export async function getServerSideProps(_: any) {
//   const apolloClient = initializeApollo(null);

//   await apolloClient.query({
//     query: PRODUCT_CATEGORIES_QUERY,
//     variables: {
//       where: null,
//       orderBy: [{ parentId: 'desc' }, { order: 'asc' }],
//     },
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }

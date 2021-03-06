import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../../../../components/Layout';
import FlatBigButton from '../../../../components/Button/FlatBigButton';
import Loader from '../../../../components/Loader';
import { PRODUCT_CATEGORY_QUERY, PRODUCT_CATEGORIES_QUERY } from '../index';

const BackToParent = ({ parentId }: any) => {
  const queryVars = {
    where: {
      id: parseInt(parentId),
    },
  };

  const { loading, error, data } = useQuery(PRODUCT_CATEGORY_QUERY, {
    variables: queryVars,
  });

  if (error || loading)
    return (
      <div className="text-base font-bold text-gray-500 mb-2">
        {'<'} 뒤로가기
      </div>
    );

  const { productCategory } = data;

  if (productCategory.parentId == null) {
    return (
      <Link href={'/products/categories'}>
        <a>
          <div className="text-base font-bold text-gray-500 mb-2">
            {'<'} 뒤로가기
          </div>
        </a>
      </Link>
    );
  } else {
    return (
      <Link href={'/products/categories/' + productCategory.parentId}>
        <a>
          <div className="text-base font-bold text-gray-500 mb-2">
            {'<'} 뒤로가기
          </div>
        </a>
      </Link>
    );
  }
};

const ParentCategory = ({ parentId }: any) => {
  const queryVars = {
    where: {
      id: parseInt(parentId),
    },
  };

  const { loading, error, data } = useQuery(PRODUCT_CATEGORY_QUERY, {
    variables: queryVars,
  });

  if (error) return <></>;
  if (loading) return <></>;

  const { productCategory } = data;

  return <>{productCategory.name}</>;
};

const CategoriesList = ({ parentId }: any) => {
  const queryVars = {
    where: {
      parentId: {
        equals: parseInt(parentId),
      },
    },
    orderBy: [{ order: 'asc' }],
  };

  const { loading, error, data } = useQuery(PRODUCT_CATEGORIES_QUERY, {
    variables: queryVars,
  });

  if (error) return <aside>카테고리 로딩에 문제가 발생하였습니다.</aside>;
  if (loading)
    return (
      <div className="w-full block">
        <Loader />
      </div>
    );

  const { productCategories } = data;

  if (productCategories.length == 0)
    return <div>상품이 존재하지 않습니다.</div>;

  return (
    <>
      {productCategories.map((category: any) => (
        <li key={category.id}>
          <div className="flex h-16 items-center justify-center border-b border-gray-400">
            <span style={{ flex: 3 }}>
              <Link href={'/products/categories/edit/' + category.id}>
                <a>{category.name}</a>
              </Link>
            </span>
            <span style={{ flex: 1 }}>{category.slug}</span>
            <span style={{ flex: 1 }}>
              {category.child.length ? (
                <FlatBigButton
                  label={
                    <>
                      하위 카테고리
                      <span
                        className="text-xs rounded-full bg-gray-500 px-2 py-1 ml-2
                       inline-block text-white"
                      >
                        {category.child.length}
                      </span>
                    </>
                  }
                  colored={false}
                  href={'/products/categories/' + category.id}
                  size="full"
                />
              ) : (
                <></>
              )}
            </span>
          </div>
        </li>
      ))}
    </>
  );
};

const IndexPage = () => {
  const router = useRouter();
  const { parentId } = router.query;

  return (
    <Layout title="상품 - 하위 카테고리">
      <div className="px-4 py-8">
        <div className="w-full items-center mb-4">
          {parentId ? (
            <BackToParent parentId={parentId} />
          ) : (
            <div className="text-base font-bold text-gray-500 mb-2">
              {'<'} 뒤로가기
            </div>
          )}
          <div className="text-2xl font-bold flex flex-row">
            <span>
              상품 {'>'} 카테고리 {'>'} 하위 카테고리 {':'}{' '}
              {parentId && <ParentCategory parentId={parentId} />}
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-end items-center">
          <div>
            <FlatBigButton
              label="순서 변경"
              colored={false}
              href={'/products/categories/order/' + parentId}
            />
          </div>
          <div className="ml-2">
            <FlatBigButton
              label="+ 새 카테고리"
              colored={true}
              href="/products/categories/add"
            />
          </div>
        </div>
        <div className="py-4 mt-4">
          <ul>
            <li>
              <div className="py-4 border-t border-b-2 border-gray-400 flex flex-row items-center">
                <span style={{ flex: 3 }} className="text-gray-500">
                  카테고리 이름
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  slug
                </span>
                <span style={{ flex: 1 }} className="text-gray-500">
                  하위 카테고리
                </span>
              </div>
            </li>
            <CategoriesList parentId={parentId} />
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

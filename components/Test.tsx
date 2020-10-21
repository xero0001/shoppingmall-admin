import { gql, useMutation } from '@apollo/client';

const TEST_MUTATION = gql`
  mutation mut {
    mut
  }
`;

const TEST_MUTATION2 = gql`
  mutation mut2($dat: Int!) {
    mut2(dat: $dat) {
      id
      name
      slug
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation deleteOneProduct_Category($id: Int!) {
    deleteOneProduct_Category(id: $id) {
      id
      name
      slug
    }
  }
`;

const UPDATE_ONE_PRODUCT_CATEGORY_MUTATION = gql`
  mutation updateOneProduct_Category(
    $data: Product_CategoryUpdateInput!
    $where: Product_CategoryWhereUniqueInput!
  ) {
    updateOneProduct_Category(data: $data, where: $where) {
      id
      name
      slug
      order
      parentId
      child {
        id
      }
    }
  }
`;

// const CREATE_MUTATION = gql`
//   mutation createOneProduct_Category(
//     $name: String!
//     $slug: String!
//     $parentId: Int!
//   ) {
//     createOneProduct_Category(name: $name, slug: $slug, parentId: $parentId) {
//       id
//       name
//       slug
//       order
//     }
//   }
// `;

export default function Test() {
  const [createPost, { data, loading, error }] = useMutation(
    UPDATE_ONE_PRODUCT_CATEGORY_MUTATION,
    {
      variables: {
        data: {
          name: { set: 'test' },
        },
        where: {
          id: 147,
        },
      },
      errorPolicy: 'all',
    }
  );

  // const [createPost, { data, loading, error }] = useMutation(
  //   UPDATE_ONE_PRODUCT_CATEGORY_MUTATION,
  //   {
  //     // variables: {
  //     //   dat: 1,
  //     // },
  //     variables: {
  //       id: 95,
  //     },
  //     errorPolicy: 'all',
  //     // onCompleted: () => {
  //     //   console.log('A');
  //     //   console.log(data);
  //     // },
  //   }
  // );

  console.log(data);
  console.log(error);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.target;
    const formData = new window.FormData(form);
    const title = formData.get('title');
    const url = formData.get('url');
    form.reset();

    createPost({
      // variables: { title, url },
      update: (cache, { data, errors }) => {
        console.log(data);
        console.log(errors);
        // cache.modify({
        //   fields: {
        //     allPosts(existingPosts = []) {
        //       const newPostRef = cache.writeFragment({
        //         data: createPost,
        //         fragment: gql`
        //           fragment NewPost on allPosts {
        //             id
        //             type
        //           }
        //         `,
        //       });
        //       return [newPostRef, ...existingPosts];
        //     },
        //   },
        // });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Submit</h1>
      <button type="submit" disabled={loading}>
        Submit
      </button>
      <style jsx>{`
        form {
          border-bottom: 1px solid #ececec;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 20px;
        }
        input {
          display: block;
          margin-bottom: 10px;
        }
      `}</style>
    </form>
  );
}

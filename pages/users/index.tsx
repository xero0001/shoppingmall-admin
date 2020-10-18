import { GetStaticProps } from 'next'
import Link from 'next/link'

// import { User } from '../../interfaces'
// import { sampleUserData } from '../../utils/sample-data'
import Layout from '../../components/Layout'
import List, {  ALL_POSTS_QUERY,
  allPostsQueryVars,} from '../../components/List'
import { initializeApollo } from '../../lib/apolloClient'

// type Props = {
//   items: User[]
// }

const WithStaticProps = () => (
  <Layout title="Users List | Next.js + TypeScript Example">
    <h1>Users List</h1>
    <p>
      Example fetching data from inside <code>getStaticProps()</code>.
    </p>
    <p>You are currently on: /users</p>
    <List />
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
)

export const getStaticProps: GetStaticProps = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const apolloClient = initializeApollo(null)

  await apolloClient.query({
    query: ALL_POSTS_QUERY,
    variables: allPostsQueryVars,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  }
}

export default WithStaticProps

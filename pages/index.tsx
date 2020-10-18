import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">
        <a>About</a>
      </Link>
    </p>
    <p>{process.env.GRAPHQL_URL}</p>
    <p>{process.env.ENV_LOCAL_T}</p>
  </Layout>
)

export default IndexPage


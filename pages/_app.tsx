import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'
import "../styles/index.css"

const App = ({ Component, pageProps }:any) =>{
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default App
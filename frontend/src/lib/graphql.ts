import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { AUTH_TOKEN_KEY, handleUnauthorized } from './auth'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3333/graphql',
  fetch: async (input, init) => {
    const response = await fetch(input, init)

    if (response.status === 401) {
      handleUnauthorized()
    }

    return response
  },
})

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const isUnauthenticatedGraphQLError = graphQLErrors?.some(
    (error) => error.extensions?.code === 'UNAUTHENTICATED',
  )

  if (isUnauthenticatedGraphQLError) {
    handleUnauthorized()
    return
  }

  if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
    handleUnauthorized()
  }
})

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

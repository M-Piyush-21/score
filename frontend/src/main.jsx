import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { 
  ApolloClient, 
  ApolloProvider, 
  InMemoryCache, 
  createHttpLink,
  from
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import App from './App';
import { UserContextProvider } from './context/UserContext';
import { CourseContextProvider } from './context/CourseContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

export const server = "http://localhost:5001";

// Create HTTP link
const httpLink = createHttpLink({
  uri: `${server}/api/graphql`,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
  headers: {
    'apollo-require-preflight': 'true',
  },
});

// Add auth context
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Error handling with detailed logging
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation.operationName}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`, networkError.stack, networkError.result);
  }
});

// Initialize Apollo Client with retry logic
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: true, // Enable Apollo dev tools
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <UserContextProvider>
          <CourseContextProvider>
            <App />
            <Toaster position="bottom-center" />
          </CourseContextProvider>
        </UserContextProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);

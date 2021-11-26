import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createHttpLink } from 'apollo-link-http';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";

const link =  createHttpLink({
    uri : 'http://localhost:5000/graphql',
    credentials: 'include'
})
const client = new ApolloClient({
    cache: new InMemoryCache({
        addTypename: false,
    }),
    link,
});


ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);



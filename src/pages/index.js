import React from "react";
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const getTodos = gql`
  {
    todos {
      id,
      text,
      done
    }
  }
`;

const addTodo = gql`
  mutation addTodo($text: String!) {
    addTodo(text: $text) {
      id
    }
  }
`

export default function Home() {

  const { loading, error, data } = useQuery(getTodos);

  if ( loading ) {
    return <h2>Loading...</h2>
  }
  
  if ( error ) {
    return <h2>Error</h2>
  }

  return (
    <div>
      <h2>My Todo List</h2>
      { JSON.stringify( data.todos ) }
    </div>
  )
}

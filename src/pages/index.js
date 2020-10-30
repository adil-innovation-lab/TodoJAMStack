import React from "react";
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import "./style.css";

const GET_TODO = gql`
  {
    todos {
      id,
      text,
      done
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!){
    addTodo(text: $text){
      text
    }
  }
`

export default function Home() {
  let textInput;

  const [addTodo] = useMutation(ADD_TODO);

  const addNewTodo = () => {
    addTodo({
      variables: {
        text: textInput.value
      },
      refetchQueries: [{ query: GET_TODO }]
    })
    textInput.value = "";
  }

  const { loading, error, data } = useQuery(GET_TODO);

  if ( loading ) {
    return <h2>Loading...</h2>
  }
  
  if ( error ) {
    return <h2>Error</h2>
  }

  return (
    <div className="container">
      <h1>My Todo List</h1>
      <div className="add_todo">
        <label>
          <input type="text" ref={node => {textInput = node;}} placeholder="Add Todo" />
        </label>
        <button onClick={addNewTodo}>Add</button>
      </div>
      <ul>
        {data.todos.map(todo => 
          <li key={todo.id}>
            <span>{todo.text}</span>
          </li>)}
      </ul>
    </div>
  )
}

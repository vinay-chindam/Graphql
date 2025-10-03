import { gql, useQuery } from "@apollo/client";

const GET_USERS_WITH_TODOS = gql`
  query {
    getUsers {
      id
      name
      todos {
        id
        title
        completed
      }
    }
  }
`;

export default function Query() {
  const { loading, error, data } = useQuery(GET_USERS_WITH_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.getUsers.map(user => (
        <div key={user.id} style={{ marginBottom: "20px" }}>
          <h3>{user.name}</h3>
          <ul>
            {user.todos.map(todo => (
              <li key={todo.id}>
                {todo.title} {todo.completed ? "(Completed)" : "(Pending)"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

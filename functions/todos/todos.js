const { ApolloServer, gql } = require('apollo-server-lambda');

const faunadb = require('faunadb'),
      q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(text: String!): Todo
  }
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        const adminClient = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('todos'))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.ref.data);
        
        return [{}]
      }
      catch(error) {
        console.log(error);
      }
    },
    // authorByName: (root, args, context) => {
    //   console.log('hihhihi', args.name)
    //   return authors.find(x => x.name === args.name) || 'NOTFOUND'
    // },
  },
  Mutation: {
    addTodo: async (_, {text}) => {
      try {
        const adminClient = new faunadb.Client({ secret: 'fnAD5ROVOYACAQm6ir9vz5oDW6Mm6QLQE1_I24Zf' });
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            { data: {
              text: text,
              done: false
            }}
          )
        )
        
        return [{}]
      }
      catch(error) {
        console.log(error);
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()

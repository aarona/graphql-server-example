import gql from 'graphql-tag'

const GET_POSTS = gql`
  {
    getPosts {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
      }
    }
  }
`

export default GET_POSTS
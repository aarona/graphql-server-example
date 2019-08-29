import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import { GET_POSTS } from '../graphql-api'

function Home() {
  const { loading, data: { getPosts: posts } } = useQuery(GET_POSTS)

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts...</h1>
        ) :(
          posts && posts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  )
}

export default Home
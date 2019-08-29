import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import FormErrors from '../components/FormErrors'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from '../util/hooks'
import { LOGIN_USER } from '../graphql-api' 

export default function Login(props) {
  const [errors, setErrors] = useState({})

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      //console.log(result)
      props.history.push('/')
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception.errors)
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  function loginUserCallback() {
    loginUser()
  }

  return (
    <div className="form-container">
      <FormErrors errors={errors} />
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Log in</h1>
        <Form.Input
          label="User name"
          placeholder="Username..."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Log in
        </Button>
      </Form>
    </div>
  )
}

import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import FormErrors from '../components/FormErrors'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from '../util/hooks'
import { REGISTER_USER } from '../graphql-api' 

export default function Register(props) {
  const [errors, setErrors] = useState({})

  const { onChange, onSubmit, values } = useForm(registerUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, __) {
      //console.log(result)
      props.history.push('/')
    },
    onError(err) {
      //console.log(err.graphQLErrors[0].extensions.exception.errors)
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values
  })

  function registerUserCallback() {
    addUser()
  }

  return (
    <div className="form-container">
      <FormErrors errors={errors} />
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
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
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
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
        <Form.Input
          label="Confirm password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
    </div>
  )
}
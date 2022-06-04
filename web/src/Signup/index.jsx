import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useState } from 'react';

function Input(props) {
  return (
    <input {...props} className="w-full bg-transparent text-lg p-4 border rounded-xl border-onix outline-none focus:border-platinum" />
  )
}

const validationSchema = yup.object({
  name: yup.string().required('Digite seu nome'),
  username: yup.string().required('Digite um nome de usuário'),
  email: yup.string().required('Digite seu email').email('Email inválido'),
  password: yup.string().required('Senha obrigatória')
})


export function Signup({ signInUser }) {
  const [error, setError] = useState()

  const formik = useFormik({
    onSubmit: async values => {
      try {
        const res = await axios.post('http://localhost:9000/signup', {
          username: values.username,
          name: values.name,
          email: values.email,
          password: values.password
        })

        setError(null)
        signInUser(res.data)
      } catch (error) {

        setError(error.response)
        console.log({ type: typeof error.response, errorData: error.response })
      }

    },
    validationSchema,
    validateOnMount: true,
    initialValues: {
      email: '',
      password: '',
      name: '',
      username: ''
    }
  })

  return (
    <div className="h-full flex justify-center">
      
            <div className="flex-1 flex justify-center items-center p-14 space-y-6">
        <div className='max-w-md flex-1'>
          <h1 className="text-3xl pb-2">Crie sua conta</h1>
          <form className="space-y-6">
            <div className="space-y-2">
              <Input
                type='text'
                name='name'
                placeholder="O seu nome"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting} />

              {(formik.touched.name && formik.errors.name) && (
                <div className='text-red-500 text-xm'>{formik.errors.name}</div>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type='text'
                name='username'
                placeholder="Seu usuário na rede"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting} />

              {(formik.touched.username && formik.errors.username) && (
                <div className='text-red-500 text-xm'>{formik.errors.username}</div>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type='text'
                name='email'
                placeholder="Digite seu melhor email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting} />

              {(formik.touched.email && formik.errors.email) && (
                <div className='text-red-500 text-xm'>{formik.errors.email}</div>
              )}
            </div>


            <div className="space-y-2">
              <Input
                type='password'
                name='password'
                placeholder="Digite uma senha forte"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting} />

              {(formik.touched.password && formik.errors.password) && (
                <div className='text-red-500 text-xm'>{formik.errors.password}</div>
              )}
            </div>

            <button
              type='submit'
              className="bg-birdBlue py-4 text-lg rounded-full disabled:opacity-50 w-full"
              disabled={formik.isSubmitting || !formik.isValid}
              onClick={formik.handleSubmit}>{formik.isSubmitting ? 'Enviando...' : 'Cadastrar'}</button>

            {error ? <div className='text-red-500 text-xm'>{error.data}</div> : null}
          </form>
        
          <div className='text-center pt-4'>
            <span className="text-sm text-silver text-center">Já tem conta? <a className="text-birdBlue" href='/login'>Entrar</a></span>
          </div>
        </div>
      </div>

      <div className='bg-birdBlue lg:flex-1 '></div>
      
      
    </div>
  )
}
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'

function Input(props) {
  return (
    <input {...props} className="w-full bg-transparent text-lg p-4 border rounded-xl border-onix outline-none focus:border-platinum"/>
  )
}

const validationSchema = yup.object({
  email: yup.string().required('Digite seu email').email('Email inválido'),
  password: yup.string().required('Senha obrigatória')
})


export function Login({signInUser}) {

  const formik = useFormik({
    onSubmit: async values => {
      const res = await axios.get('http://localhost:9000/login', {
        auth: {
          username: values.email,
          password: values.password
        }
      })

      signInUser(res.data)

    },
    validationSchema,
    validateOnMount: true,
    initialValues: {
      email: '',
      password: ''
    }
  })

  return (
    <div className='h-full flex justify-center'>
      <div className='bg-birdBlue lg:flex-1 '></div>

      <div className="flex-1 flex justify-center items-center p-14 space-y-6">
        <div className='max-w-md flex-1'>
          <h1 className="text-3xl pb-2">Acesse sua conta</h1>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <Input
                type='text'
                name='email'
                placeholder="Digite seu melhor email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}/>
              
              {(formik.touched.email && formik.errors.email) && (
                <div className='text-red-500 text-xm'>{formik.errors.email}</div>
              )}
            </div>


            <div className="space-y-2">
              <Input
                type='password'
                name='password'
                placeholder="A sua senha forte"
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
              onClick={formik.handleSubmit}>{formik.isSubmitting? 'Entrando...':'Entrar'}</button>
          </form>
          
          <div className='text-center pt-4'>
            <span className="text-sm text-silver text-center">Não tem conta? <a className="text-birdBlue" href='/signup'>Inscreva-se</a></span>
          </div>
          
          </div>
        </div>
    </div>
  )
}
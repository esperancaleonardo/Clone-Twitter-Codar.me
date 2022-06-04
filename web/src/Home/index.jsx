import { Heart, SignOut } from "phosphor-react";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from 'axios'

const MAX_CHAR_TWEET = 180

function TweetForm({loggedInUser, onSuccess, setUser}) {
    
  const formik = useFormik({
    onSubmit: async (values, form) => {
      await axios({
        method: 'post',
        url: `${import.meta.env.VITE_API_HOST}/tweet`,
        headers:{'authorization': `Bearer ${loggedInUser.accessToken}`},
        data: {text: values.text},
      })

      form.setFieldValue('text', '')
      onSuccess()
    },
    initialValues: {text: ''}
  })

  function logout() {
    setUser(null)
  }

  return (
    <>
      <div className="border-b border-silver p-4 space-y-6 ">
        <div className="flex justify-between">
          <h2 className="font-bold text-4xl">Bem vindo, { loggedInUser.name } (@{loggedInUser.username})!</h2>
          <button className="bg-birdBlue px-3 py-3 rounded-full disabled:opacity-50" onClick={logout}><SignOut/></button>
        </div>

        <div className="flex space-x-5">
          <img src='./src/avatar.png' className="w-7" />
          <h1 className="font-bold text-2xl">Página Inicial</h1>
        </div>
        <form className="pl-12 text-lg flex flex-col" onSubmit={formik.handleSubmit}>
          <textarea
            name="text"
            value={formik.values.text}
            placeholder="O que está acontecendo?"
            className="bg-transparent focus:border-birdBlue focus:ring-0 disabled:opacity-50 h-32 resize-none scrollbar-thin scrollbar-thumb-birdBlue scrollbar-track-silver mb-4"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
           />
          
          <div className="flex justify-end items-center space-x-3">
            <span className="text-sm"><span>{formik.values.text.length}</span><span className="text-birdBlue">/{MAX_CHAR_TWEET}</span></span>
            <button
              type="submit"
              className="bg-birdBlue px-5 py-2 rounded-full disabled:opacity-50"
              disabled={formik.values.text.length > MAX_CHAR_TWEET || formik.isSubmitting}>Tweetar</button>
         </div>
        </form>
      </div>
    </>
  )
}

function Tweet({ name, username, avatar, tweet, likes }) {
  return (
    <div className="flex space-x-3 p-4 border-b border-silver">
      <div>
        <img src={avatar} />
      </div>
      <div className="space-y-1">
        <span className="font-bold text-sm">{name}</span>{' '}
        <span className="text-sm text-silver">@{username}</span>
        
        <p className="max-w-lg md:max-w-2xl lg:max-w-6xl break-all">{tweet}</p>
        <div className="flex space-x-1 text-silver text-sm items-center">
          <Heart className="h-4 stroke-1" />
          <span>{likes}</span>
        </div>
      </div>
    </div>
  )
}



export function Home({loggedInUser, setUser}) {
  const [data, setData] = useState('')

  async function fetchData() {
    const res = await axios.get(`${import.meta.env.VITE_API_HOST}/tweets`, {
      headers: {
        authorization: `Bearer ${loggedInUser.accessToken}`
      }
    })
    setData(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  
  return (
    <>
      <TweetForm loggedInUser={loggedInUser} onSuccess={fetchData} setUser={setUser}/>
      <div>
        {data.length > 0
          ? data.map(tweet => (
              <Tweet
                key={tweet.id}
                name={tweet.user.name}
                username={tweet.user.username}
                avatar='./src/avatar.png'
                tweet={tweet.text}
                likes={tweet.likes} />
            ))
          : <div className="flex justify-center items-center w-full p-12">
              <h1 className="text-3xl ">Ops! Ainda não há tweets!</h1>
            </div>
        }
      </div>
      
    </>
  )
}


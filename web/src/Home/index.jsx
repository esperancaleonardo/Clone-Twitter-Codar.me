import { Heart } from "phosphor-react";
import { useState, useEffect } from "react";
import axios from 'axios'


 const MAX_CHAR_TWEET = 180

function TweetForm() {
  const [text, setText] = useState('');

  function changeText(e) {
    setText(e.target.value)

  }

  return (
    <>
      <div className="border-b border-silver p-4 space-y-6 ">
        <div className="flex space-x-5">
          <img src='./src/avatar.png' className="w-7" />
          <h1 className="font-bold text-xl">Página Inicial</h1>
        </div>

        <form className="pl-12 text-lg flex flex-col">
          <textarea
            type="text"
            value={text}
            onChange={changeText}
            name="tweet"
            placeholder="O que está acontecendo?"
            className="bg-transparent focus:border-birdBlue focus:ring-0 disabled:opacity-50 h-32 resize-none scrollbar-thin scrollbar-thumb-birdBlue scrollbar-track-silver mb-4"
           />
          
          <div className="flex justify-end items-center space-x-3">
            <span className="text-sm"><span>{text.length}</span><span className="text-birdBlue">/{MAX_CHAR_TWEET}</span></span>
            <button
              className="bg-birdBlue px-5 py-2 rounded-full disabled:opacity-50"
              disabled={text.length > MAX_CHAR_TWEET}>Tweetar</button>
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
        <p>{tweet}</p>
        <div className="flex space-x-1 text-silver text-sm items-center">
          <Heart className="h-4 stroke-1" />
          <span>{likes}</span>
        </div>
      </div>
    </div>
  )
}



export function Home() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbDN5eXk3M3cwMDAyMXB1cms1aTFqN3BqIiwiaWF0IjoxNjU0MzU1MzAzLCJleHAiOjE2NTQ0NDE3MDN9.Ie1PxJ0AeIK_XxwCPCoYRWDYGKYN2lMrQDt46ABMGdQ'
  const [data, setData] = useState('')

  async function fetchData() {
    const res = await axios.get('http://localhost:9000/tweets', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    setData(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <>
      <TweetForm />
      <div>
        {data.length && data.map(tweet => (
          <Tweet
            key={btoa(Date.now() + '_' + tweet.text)}
            name={tweet.user.name}
            username={tweet.user.username}
            avatar='./src/avatar.png'
            tweet={tweet.text}
            likes={tweet.likes} />
        ))}        
      </div>
      
    </>
  )
}


import { Home } from "./Home";
import { Login } from "./Login";
import { Signup } from "./Signup";

import { useState } from "react"


export function App() {
  const [user, setUser] = useState()

  if (user) {
    return <Home loggedInUser={user} setUser={setUser}/>
  }

  //retornar uma pagina de 404 
  return window.location.pathname === '/signup'
    ? <Signup signInUser={setUser} />
    : (window.location.pathname === '/login'
      ? <Login signInUser={setUser} />
      : <h1>404 - Not Found</h1>)

  //#return ( user ? <Home /> :  )
}
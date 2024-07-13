import React from "react"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./Home"
import Register from "./Register"
import Login from "./Login"

function App() {
 
  return (
    <BrowserRouter>        
      <Routes>
        <Route path='/' element={<Home />}></Route>         
        <Route path='/login' element={<Login />}></Route>            
        <Route path='/Register' element={<Register />}></Route>              
      </Routes>    
    </BrowserRouter>
  )
}

export default App

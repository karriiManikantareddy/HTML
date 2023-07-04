import React from 'react'
import NavBar from '../navBar/navBar'
import {Route,Routes} from 'react-router-dom'
import Home from '../pages/home'
import About from '../pages/about'
import Contact from '../pages/contact'
import PageNotFound from '../pages/pageNotFound'
import AddUser from '../operations/addUser'
import Edit from '../operations/edit'


const Main = () => {
  return (
    <>
    <NavBar/>
    <Routes>
<Route path='/' element={<Home/>}/>
<Route path='/about' element={<About/>}/>
<Route path='/contact' element={<Contact/>}/>
<Route path='/adduser' element={<AddUser/>}/>
<Route path='*' element={<PageNotFound/>}/>
<Route path='/update/:id' element={<Edit/>}/>
    </Routes>
   
    </>
  )
}

export default Main

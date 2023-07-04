import React from 'react'
import { Link } from 'react-router-dom'
  

const NavBar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary ">
  <div className="container-fluid ">
    <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav ">
        <li className="nav-item ">
          <Link to={'/'} className="nav-link text-light " aria-current="page" href="#">Home</Link>
        </li>
        {/* <li className="nav-item">
          <Link to={'/about'} className="nav-link text-white" href="#">About</Link>
        </li>
        <li className="nav-item">
          <Link to={'/contact'} className="nav-link text-white" href="#">Contact</Link>
        </li> */}
      </ul>
    </div>
    <Link to={'/adduser'} className="btn btn-success">Add users</Link>
  </div>
  
</nav>
    </div>
  )
}

export default NavBar

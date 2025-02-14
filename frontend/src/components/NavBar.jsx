import React from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, ShoppingCart, Search } from 'lucide-react'
import axios from 'axios'
import '../index.css';
import logo from "./../assets/logo.jpeg";
import { userContext } from '../Context/contextAPI';
import { useSelector } from 'react-redux';

const menuItems = [
  {
    name: 'Home',
    to: 'Home',
  }
]

export function NavBar() {
  const cartProducts = useSelector((state) => state.cart);
  console.log(cartProducts);
  const {isAuth}=userContext();
  console.log(isAuth);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const logout = async () => {
    try{
      const response = await axios.get('http://localhost:3000/auth/logout', { withCredentials: true});
      if (response) {
        navigate('/signIn')
      }
    }catch (err) {
      console.log(err)
    }
  }

  

  

  return (
    <div className="relative w-full bg-white" style={{
      boxShadow:
        "rgba(0, 0, 0, 0.25) 0px 14px 55px, " +
        "rgba(0, 0, 0, 0.12) 0px -12px 30px, " +
        "rgba(0, 0, 0, 0.12) 0px 4px 6px, " +
        "rgba(0, 0, 0, 0.17) 0px 12px 13px, " +
        "rgba(0, 0, 0, 0.09) 0px -3px 5px",
    }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <span className='w-[50px] height-[50px]'>
              <img alt="Logo" src={logo} className='w-full h-full object-fit'/>
          </span>
          <span className="font-bold text-black">Shop IGI</span>
        </div>
        <div className="hidden lg:block">
          <ul className="ml-12 inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className="inline-flex items-center text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex grow justify-evenly items-center cursor-pointer">
          <input
            className="flex h-10 w-[30vw] rounded-md bg-gray-300 px-3 py-2 text-sm text-black placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            type="text"
            placeholder="Serach"
          ></input>
          {isAuth &&
          <Link to='Cart' className='flex relative'>
              <ShoppingCart className='text-black' /><span className='bg-red-400 text-white rounded-full absolute w-4 h-4 flex items-center justify-center left-4'>{cartProducts.length}</span></Link>}
        </div>
        
        <div className="avatar ml-2 mt-2 hidden lg:block">
          {!isAuth?<div className='flex gap-x-2'>
             <Link to="/SignIn" className='bg-black text-white font-semibold p-2 rounded-lg'>Log In</Link>
             <Link to="/SignUp" className='bg-black text-white font-semibold p-2 rounded-lg'>Sign Up</Link>
          </div>:
          <span className="relative inline-block">
            <img
              className="h-10 w-10 rounded-full hover:cursor-pointer"
              src="https://cdn-icons-png.flaticon.com/512/3641/3641963.png"
              alt="Avatar"
            />
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-600 ring-2 ring-white"></span>
            <div className="options hidden absolute w-[150px] left-0 mt-2 bg-white p-2 border rounded">
              <Link to='Profile'> <button className="text-left p-1 w-[100%] hover:bg-slate-300">Profile</button></Link>
              <Link to='Order'><button className="text-left p-1 w-[100%] hover:bg-slate-300">Orders</button></Link>
              <button className="text-left p-1 w-[100%] hover:bg-slate-300" onClick={() => logout() } >Log Out</button>

            </div>
          </span>}
        </div>
        <div className="ml-2 lg:hidden text-black">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  {!isAuth &&
                  <div className="inline-flex items-center space-x-2">
                    <span>
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 50 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z"
                          fill="black"
                        />
                      </svg>
                    </span>
                    <span className="font-bold text-black">Shop IGI</span>
                  </div>}
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        className="m-1 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        <span className="ml-3 text-base font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span>
                          <ChevronRight className="ml-3 h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
                {!isAuth?
                <div>
                    <Link
                        to="/SignIn"
                        className="m-1 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50">
                        <span className="ml-3 text-base font-medium text-gray-900">
                          Sign In
                        </span>
                        <span>
                          <ChevronRight className="ml-3 h-4 w-4" />
                        </span>
                    </Link>
                    <Link
                        to="/SignUp"
                        className="m-1 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50" >
                        <span className="ml-3 text-base font-medium text-gray-900">
                          Sign Up
                        </span>
                        <span>
                          <ChevronRight className="ml-3 h-4 w-4" />
                        </span>
                      </Link>
                </div>:
                <div className="avatar ml-3 flex items-center space-x-2">
                  <img
                    className="inline-block h-10 w-10 rounded-full"
                    src='https://cdn-icons-png.flaticon.com/512/3641/3641963.png'
                    alt="Avatar"
                  />
                  <div className="options hidden absolute w-[150px] left-0 mt-2 bg-white p-2 border rounded">
                    <button className="text-left p-1 w-[100%] hover:bg-slate-300">Profile</button>
                    <Link to='Order'><button className="text-left p-1 w-[100%] hover:bg-slate-300">Orders</button></Link>
                    <button className="text-left p-1 w-[100%] hover:bg-slate-300" onClick={() => logout() }>Log Out</button>

                  </div>
                </div>
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default NavBar;
import React,{useState} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify';
import axios from 'axios';
import logo from "./../assets/logo.jpeg";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //api call
      console.log(email, password);
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      }, { withCredentials: true});

      // Handle the response, e.g., redirect to a new page or show a success message
      if (response) {
        navigate('/Home')
      }
      console.log('User signed up successfully', response.data);
      toast.success('Sign Up Successfully');
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  }

  return (
    <section>
      <div className=" flex items-center justify-center px-4 py-8 sm:px-6 sm:py-8 lg:px-6 lg:py-10">
        <div className="bg-white p-5 rounded-lg xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md" style={{ boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.35)' }}>
          <div className="mb-2 flex justify-center">
          <span className='w-[70px] height-[70px]'>
              <img alt="Logo" src={logo} className='w-full h-full rounded-lg object-fit'/>
          </span>
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            Don&apos;t have an account?{' '}
            <Link
              to="/SignUp"
              title=""
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Create a free account
            </Link>
          </p>
          <form onSubmit={handleSubmit} method="POST" className="mt-8">
            <div className="text-left space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-gray-900">
                  {' '}
                  Email address{' '}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-gray-900">
                    {' '}
                    Password{' '}
                  </label>
                  <Link to="/Forgetpass" title="" className="text-sm font-semibold text-black hover:underline">
                    {' '}
                    Forgot password?{' '}
                  </Link>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPass(e.target.value)}
                    required
                  ></input>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Get started <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SignIn;
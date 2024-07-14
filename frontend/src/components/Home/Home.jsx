import Products from "../Products"
import "./Home.css"
import {Link} from 'react-router-dom'
import {decodeToken} from "react-jwt";
function Home() {

  // const token=localStorage.getItem("jwt");
  // async function decode(){
  //   // console.log(await jwt.decode(token,"mysecret"));
  //   console.log(decodeToken(token));
  // }
  // decode();
  return (
    <>
      <div className="home">
       <Link to='/products' className="shop--now-link"> <button className="bg-white text-black p-[15px] font-bold rounded-lg">Shop Now</button></Link>
      </div>
      <Products name={"Trending Items"}/>
    </>
  )
}

export default Home

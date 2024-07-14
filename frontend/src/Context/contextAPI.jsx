import { createContext, useContext,useState } from "react";


const Context=createContext();

function ContextAPICompo({children}){
    const [isAdmin,setAdmin]=useState(false);
    const [isAuth,setAuth]=useState(false);
    return(
        <Context.Provider value={{
                isAdmin,
                isAuth,
                setAdmin,
                setAuth,
                userData:null
        }}>
            {children}
        </Context.Provider>
    )
}

function userContext(){
    const con=useContext(Context);
    return con=="null"|| con==undefined?console.log("COntext Out Scope"):con;
}

export {userContext,ContextAPICompo};
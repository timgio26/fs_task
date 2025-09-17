import { useState, type FormEvent } from "react";
import { useLogin, useSignup } from "../Utils/TaskQuery";
// import { useNavigate } from "react-router";

type AuthMode = "login" | "signup";

export function Auth() {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [show,setShow] = useState<boolean>(false)
  const {mutate:login,isPending} = useLogin()
  const {mutate:signup,isPending:isPendingSignup} = useSignup()

  function handleLogin(e:FormEvent){
    e.preventDefault()
    if(!username||!password)return;
    if(mode == "login"){
      login({username,password})

    }else{
      signup({username,name,password},{onSuccess:()=>{
        setMode("login")
      }})
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="flex flex-row justify-around my-2">
          <span
            className={`${mode == "signup" && "bg-amber-400"} px-3 py-1`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </span>
          <span
            className={`${mode == "login" && "bg-amber-400"} px-3 py-1`}
            onClick={() => setMode("login")}
          >
            Log In
          </span>
        </div>
        <form className="flex flex-col gap-1">
          <>
            {mode == "signup" && (
              <>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border-b-1 border-gray-600 focus:outline-none"
                  value={name}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setName(e.target.value)}
                />
              </>
            )}

            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="border-b-1 border-gray-600 focus:outline-none"
              value={username}
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <div className="border-b-1 border-gray-600">
            <input
              type={show?"text":"password"}
              name="password"
              id="password"
              className="focus:outline-none"
              value={password}
              onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}
              autoComplete="false"
            />

            <span onClick={()=>setShow((curState)=>!curState)}>{show?'hide':'show'}</span>


            </div>
          </>
          <button type="submit" className="bg-amber-400 my-2" onClick={handleLogin}>
            {isPending||isPendingSignup?"Loading":
            mode == "signup" ? "Sign Up" : "Log In"
            }

          </button>
        </form>
      </div>
    </div>
  );
}

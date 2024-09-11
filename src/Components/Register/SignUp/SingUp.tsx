import { useNavigate } from "react-router-dom";
import './SingUp.css'
import Login from "../Login/Login";

export default function SingUp() {
   // const navigate = useNavigate();
   function getSingUp() {
      console.log('clicked')
      // navigate("../Login")
   }
   return (
      <div className="overlay">
         <div className='LoginPage'>
            <form action="" className="register">
               <h1> وارد شوید </h1>
               <div className="inputs">
                  <input type="text" required placeholder="نام" id="input-name" />
                  <input type="text" required placeholder="شماره" id="input-number" />
               </div>
               <button className="submit">ورود</button>
               <span className='Login'> حساب کاربری ندارید؟<a className='Login-link' onClick={getSingUp} >ثبت نام کنید</a> </span>
            </form>
         </div>
      </div>
   )
}
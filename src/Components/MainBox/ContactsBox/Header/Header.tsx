import "./Header.css";
import { useState } from "react";
import ContactsList from "../../../../../ContactsList";
export default function Header() {
   const [popup, setPopup] = useState(false);
   function addHandler() {
      setPopup(true);
   }
   const [username, setUsername] = useState('');
   const [name, setName] = useState('');
   const handleSubmit = (e: any) => {
      e.preventDefault();
      const user = ContactsList[0].userList.find(user => user.username === username && user.name === name);
      if (user) {
         console.log("مخاطب افزوده شد");
      } else {
         console.log("مخاطب اشتباه وارد شده است");
      }
   };
   return (
      <div className="header-container">
         <header className="header">
            <div className="search">
               <div className="search-bar">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input type="text" placeholder="جست و جو مخاطب" />
               </div>
            </div>
            <i className={`fa-solid fa-plus add`} onClick={addHandler}></i>
         </header>
         <hr />
         {popup && (
            <>
               <div className="overlay" onClick={() => setPopup(false)}></div>
               <div className="popup">
                  <i className="fa-solid fa-xmark" onClick={() => setPopup(false)}></i>
                  <form action="" className="register" onSubmit={handleSubmit}>
                     <h1>افزودن مخاطب</h1>
                     <div className="inputs">
                        <input type="text" required placeholder="نام" id="input-name" onChange={(e) => setName(e.target.value)} />
                        <input type="text" required placeholder="شماره" id="input-number" onChange={(e) => setUsername(e.target.value)} />
                     </div>
                     <button className="submit-add">افزودن</button>
                  </form>
               </div>
            </>
         )}
      </div>
   );
}

import ContactsList from "../../../../../../ContactsList";
import { useState } from 'react';
import "./FormPopup.css";
import App from "../../../../AppAssets/App";
export default function FormPopup() {
   const [username, setUsername] = useState('');
   const [name, setName] = useState('');
   const handleSubmit = (e :any) => {
      e.preventDefault();
      const user = ContactsList[0].userList.find(user => user.username === username && user.name === name);
      if (user) {
         console.log("مخاطب افزوده شد");
      } else {
         console.log("مخاطب اشتباه وارد شده است");
      }
   };

   return (
      <form action="" className="register" onSubmit={handleSubmit}>
         <h1>افزودن مخاطب</h1>
         <div className="inputs">
            <input type="text" required placeholder="نام" id="input-name" onChange={(e) => setName(e.target.value)} />
            <input type="text" required placeholder="شماره" id="input-number" onChange={(e) => setUsername(e.target.value)} />
         </div>
         <button className="submit-add">افزودن</button>
      </form>
   );
}
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

export default function Login({ Login, setUserStatus, getToken }: any) {
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({ password: '', username: '' });
   const [data, setData] = useState<any>(null);
   const [token, setToken] = useState<string | null>(null);

   // 
   const validateInputs = () => {
      const newErrors = { password: '', username: '' };
      if (password.length < 8) newErrors.password = 'رمز شما باید حداقل 8 کاراکتر باشد';
      if (username.length !== 11) newErrors.username = 'شماره باید حتما 11 رقمی باشد';
      setErrors(newErrors);
      return !newErrors.password && !newErrors.username;
   };

   // تابع برای ورود کاربر
   const verifyUser = async () => {
      try {
         const response = await fetch('https://farawin.iran.liara.run/api/user/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
         });

         if (!response.ok) {
            throw new Error('اشتباه وارد کردن مخاطب');
         }
         const information = await response.json();
         setData(information);
      } catch (err) {
         Swal.fire({
            icon: 'error',
            title: 'خطا',
            text: 'ورود ناموفق بود. لطفا دوباره تلاش کنید.',
         });
         console.error(err);
      } finally {
         setLoading(false); // وضعیت بارگذاری را در هر صورت به false برمی‌گردانیم
      }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      
      if (!validateInputs()) {
         setLoading(false);
         return;
      }

      await verifyUser();
   }

   // استفاده از useEffect برای به‌روزرسانی توکن
   useEffect(() => {
      if (data && data.token) {
         setToken(data.token);
         Login({ password, username });
         getToken({ token: data.token });
         console.log(token)
      }
   }, [data]);

   // عناصر کامپوننت
   return (
      <div className="overlay">
         <div className='LoginPage'>
            <form className="register" onSubmit={handleSubmit}>
               <h1> ورود </h1>
               <div className="input-group-add">
                  <input type="text" required onChange={(e) => setUsername(e.target.value)} className={errors.username ? 'error' : ''} />
                  <label>شماره خود را وارد کنید</label>
                  {errors.username && <span className="error-message">{errors.username}</span>}
               </div>
               <div className="input-group-add">
                  <input type="password" required onChange={(e) => setPassword(e.target.value)} className={errors.password ? 'error' : ''} />
                  <label>رمز عبور خود را وارد کنید</label>
                  {errors.password && <span className="error-message">{errors.password}</span>}
               </div>
               <button className='submit-add' type="submit">ورود</button>
            </form>
            <span className='sing-in'> حساب کاربری ندارید؟<a className='sing-in-link' >ثبت نام کنید</a> </span>
         </div>
         {loading && (
            <div className="overlayy">
               <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
               </div>
            </div>
         )}
      </div>
   );
}
































































































// export default function Login({ Login, setUserStatus }: any) {
//    const [password, setPassword] = useState('');
//    const [username, setUsername] = useState('');
//    const [loading, setLoading] = useState(false);
//    // const [loadingPage, setLoadingPage] = useState(true);
//    const [errors, setErrors] = useState({ password: '', username: '' });
//    const [data, setData] = useState<any>(null);
//    const [token, setToken] = useState<any>();

//    // Get tokens...
//    const getToken = async () => {
//       const response = await fetch('https://farawin.iran.liara.run/api/user/login', {
//          method: 'POST',
//          headers: {
//             'Content-Type': 'application/json',
//          },
//          body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//          const data = await response.json();
//          setToken(data.token);
//          console.log('توکن:', data.token);
//       } else {
//          console.error('خطا در ورود:', response.statusText);
//       }
//    };

//    // fetch users...
//    useEffect(() => {
//       if (token) {
//          const fetchUser = async () => {
//             try {
//                const response = await fetch("https://farawin.iran.liara.run/api/user/login", {
//                   method: 'GET',
//                   headers: {
//                      'Authorization': token,
//                      'Contact-type': 'application/json'
//                   }
//                });
//                if (!response.ok) throw new Error('Network response was not ok');
//                const result = await response.json();
//                setData(result);
//             } catch (error) {
//                console.error('Fetch error:', error);
//             }
//          };fetchUser();
//       };
//    }, [token]);

//    // validation for input values...
//    const validateInputs = () => {
//       const newErrors = { password: '', username: '' };
//       if (password.length < 8) newErrors.password = 'رمز شما باید حداقل 8 کاراکتر باشد';
//       if (username.length !== 11) newErrors.username = 'شماره باید حتما 11 رقمی باشد';
//       setErrors(newErrors);
//       return !newErrors.password && !newErrors.username;
//    };

//    // submit btn ...
//    const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setLoading(true);
//       if (!validateInputs()) return setLoading(false);
//       await getToken();
//       console.log('after token')
//       console.log(token);
//       console.log(data?.contactList)
//       setLoading(false);
//       const user = data?.contactList.find((user: any) => user.username === username && user.password === password);
//       console.log(user)
//       if (user) {
//          setTimeout(() => {
//             Login({ password, username });
//             setLoading(false);
//          }, 4000);
//       } else {
//          Swal.fire({
//             icon: "error",
//             title: "🤔عجیبه",
//             text: ":((( حسابی پیدا نشد",
//             footer: "<span className='sing-in'> حساب کاربری ندارید؟<a className='sing-in-link' href='#'>ثبت نام کنید</a> </span>"
//          });
//          setLoading(false);
//       }
//    };

//    // elements ...
//    return (
//       <div className="overlay">
//          <div className='LoginPage'>
//             <form className="register" onSubmit={handleSubmit}>
//                <h1> ورود </h1>
//                <div className="input-group-add">
//                   <input type="text" required onChange={(e) => setUsername(e.target.value)} className={errors.password ? 'error' : ''} />
//                   <label>شماره خود را وارد کنید</label>
//                   {errors.username && <span className="error-message">{errors.username}</span>}
//                </div>
//                <div className="input-group-add">
//                   <input type="text" required onChange={(e) => setPassword(e.target.value)} className={errors.username ? 'error' : ''} />
//                   <label>رمز عبور خود را وارد کنید</label>
//                   {errors.password && <span className="error-message">{errors.password}</span>}

//                </div>
//                <button className='submit-add' type="submit">ورود</button>
//             </form>
//             <span className='sing-in'> حساب کاربری ندارید؟<a className='sing-in-link' >ثبت نام کنید</a> </span>
//          </div>
//          {loading && (
//             <div className="overlayy">
//                <div className="lds-ring">
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                </div>
//             </div>
//          )}
//          {/* {loadingPage && (
//             <div className="overlayy">
//                <div className="lds-ring">
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                </div>
//             </div>
//          )} */}
//       </div>
//    );
// }

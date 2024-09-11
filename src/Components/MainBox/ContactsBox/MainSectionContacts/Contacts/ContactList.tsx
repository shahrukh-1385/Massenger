import "./ContactList.css";
import contactList from "../../../../../../ContactsList.js"
export default function ContactList() {
  function filter(username: string) {
    return username.charAt(0);
  }
  
  const list = contactList.map((user: any, index: number) => (
    <div className="contactsList" key={index}>
      {user.userList.map((contact: any, contactIndex: number) => (
        <div className="Contact-info" key={contactIndex}>
          <div className="userContact">
            <div className="name-Contacts">{contact.name}</div>
            <div className="avater-Contacts">{filter(contact.name)}</div>
          </div>
          <p className="last-text">yyy</p>
        </div>
      ))}
    </div>
  ));
  return (
    <div>
      {list}
    </div>
  );
}

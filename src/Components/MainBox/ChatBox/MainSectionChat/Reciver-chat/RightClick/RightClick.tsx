import React, { useState } from 'react';
const RightClickMenu: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.pageX, y: event.pageY });
    setMenuVisible(true);
  };
  const handleClick = () => {
    setMenuVisible(false);
  };
  return (
    <div onContextMenu={handleContextMenu} onClick={handleClick} style={{ height: '100vh', border: '1px solid black' }}>
      {menuVisible && (
        <ul style={{ position: 'absolute', top: position.y, left: position.x, background: 'white', border: '1px solid black' }}>
          <li>گزینه ۱</li>
          <li>گزینه ۲</li>
          <li>گزینه ۳</li>
        </ul>
      )}
      راست کلیک کنید
    </div>
  );
};
export default RightClickMenu;
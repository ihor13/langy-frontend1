import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import Users from "./Users";
import WordSelector from './WordSelector';

const wordsFromApi = [
  { id: 1, native: 'Привіт', translate: 'Hello' },
  { id: 2, native: 'До побачення', translate: 'Goodbye' },
  { id: 3, native: 'Добре', translate: 'Good' },
  { id: 4, native: 'Погано', translate: 'Bad' },
  // ... other words
];

const Sidebar = ({ onSignOut }) => {
  const sidebarStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '280px',
    padding: '1px',
    backgroundColor: '#ffffff', // White background
    color: '#000000', // Black text color
  };

  const linkStyles = {
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    textDecoration: 'none', // Remove default underline
    color: '#000000', // Black text color
    display: 'block', // Make the entire area clickable
    padding: '10px', // Add padding for better appearance
  };

  // Function to handle hover effect
  const handleHover = (event) => {
    event.target.style.backgroundColor = '#f0f0f0'; // Light gray background on hover
  };

  // Function to handle mouse leave
  const handleMouseLeave = (event) => {
    event.target.style.backgroundColor = '#ffffff'; // Restore the original background color
  };

  return (
    <section style={sidebarStyles}>
    <Link to="/" style={linkStyles} onMouseOver={handleHover} onMouseLeave={handleMouseLeave}>
      Домашня(Home)
    </Link>
    <Link to="/editor" style={linkStyles} onMouseOver={handleHover} onMouseLeave={handleMouseLeave}>
      Вправи для перекладу слова(Word translation exercise)
    </Link>
    <Link to="/admin" style={linkStyles} onMouseOver={handleHover} onMouseLeave={handleMouseLeave}>
     Вправи для перекладу слів(Multiwords translation exercise)
    </Link>
    <Link to="/users" style={linkStyles} onMouseOver={handleHover} onMouseLeave={handleMouseLeave}>
      Користувач(Users)
    </Link>
    <Link to="/lounge" style={linkStyles} onMouseOver={handleHover} onMouseLeave={handleMouseLeave}>
      Значення слова(Word meaning)
    </Link>
    <Link to="/linkpage" style={linkStyles} onMouseOver={handleHover} onMouseLeave={handleMouseLeave}>
      Всі посилання(All Links)
    </Link>
    <Link to="#" style={linkStyles} onMouseOver={handleHover} onMouseLeave={handleMouseLeave} onClick={onSignOut}>
      Вихід(Sign Out)
    </Link>
  </section>
  );
};


const Admin = () => {

  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    setAuth({});
    navigate('/login');
  };

  const mainStyles = {
    flex: '1',
    padding: '20px',
    backgroundColor: '#ffffff',
  };
  //<WordSelector words={wordsFromApi} />

  return (
    <>
    <Sidebar onSignOut={logout} />
    <main style={mainStyles}>
    <WordSelector words={wordsFromApi} />
    <br />
    <br />
    <br />
    <br />
    {/*<section>
      <h1>Admins Page</h1>
      <br />
      <Users />
      <br />
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>*/}
    </main>
    </>
  );
};

export default Admin;

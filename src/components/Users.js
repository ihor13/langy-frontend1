import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";


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

const Users = () => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const refresh = useRefreshToken();
  //Sidebar
  //const { setAuth } = useAuth();
  const authContext = useContext(AuthContext);
  const { setAuth } = useContext(AuthContext);
  //const navigate = useNavigate();
  //let user = {};
  const logout = async () => {
    setAuth({});
    navigate('/login');
  };

  const mainStyles = {
    flex: '1',
    padding: '20px',
    backgroundColor: '#ffffff',
  };
// End of sidebar
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(`https://langy.onrender.com/api/user/me/`, {
          signal: controller.signal,
        });
        const newUser = {
          ...response.data,
          accessToken: authContext.auth.accessToken,
          refreshToken: authContext.auth.refreshToken
        }
        console.log(authContext.auth.accessToken,authContext.auth.refreshToken)
        //console.log(response.data);
        //console.log(newUser);
        //console.log(Object.keys(newUser).length);
        const accessToken = authContext.auth.refreshToken
        const refreshToken = authContext.auth.refreshToken 
        const iduser = response?.data?.id;
        const username = response?.data?.username;
        const email = response?.data?.email;
        const native_language = response?.data?.native_language;
        const learn_language = response?.data?.learn_language;
        setUser(newUser);
        //console.log(accessToken,refreshToken,iduser,username,email,native_language,learn_language);
        isMounted && setUsers([user]);
        //console.log(users);
      } catch (err) {
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();

    // cleanup func : called once component is unmounted
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);


//Can delete in the future!!!!!!!!!!!!!!!!!!!!
  const words = async (e) => {
    //e.preventDefault();

    try {
        const response = await axios.get("https://langy.onrender.com/api/exercise/cards/",
            // JSON.stringify({ email: user, password: pwd }),
            {

              headers: { 
                Authorization: "JWTeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM3MjY0MjE0LCJpYXQiOjE3MDU3MjY4NTQsImp0aSI6IjM2ZjI4OTU2YjBhMzQ0NmI5M2RjODBhZjc2M2MyZjQ2IiwidXNlcl9pZCI6Mn0.CFy8E5mJzgG5SLVZtJqn0QsFTUA3jrjorAjdLs2_u0A",
                'Content-Type': 'application/json' 
              },
              params: {
                'count-words': 1,
              },
                 //withCredentials: true
            }
        );
        console.log(JSON.stringify(response?.data));

    } catch (err) {
 
    }

    try {
      const response = await axios.post("https://langy.onrender.com/api/exercise/cards/",
          JSON.stringify({ id: 327, status: true }),
          {
               headers: { 'Content-Type': 'application/json' },
          //     //withCredentials: true
          }
      );
      console.log(JSON.stringify(response?.data));

  } catch (err) {

  }

  }
//Can Delete!!!!!!!!!!!!!!!!
/*{users?.length ? (
  <ul>
    {users.map((user, i) => (
      <li key={i}>{user}</li>
    ))}
  </ul>
) : (
  <p>No users to display</p>
)}*/
  return (
    <>
      <Sidebar onSignOut={logout} />
      <main style={mainStyles}>
        <section>
          <h2>User's information </h2>
          
          {Object.keys(user).length ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(user).map(([key, value]) => (
              <li key={key} style={{ marginBottom: '10px', wordWrap: 'break-word' }}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        ) : (
          <p>No users to display</p>
        )}
          <button onClick={() => refresh()}>Refresh</button>
          <button onClick={() => words()}>Words</button>
        </section>
      </main>
    </>
  );
};

export default Users;

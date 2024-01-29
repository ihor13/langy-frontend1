import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthProvider";

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


const WordExercise = ({ word, onNextWord }) => {
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnswerSelection = (translation) => {
    if (result === null) {
      const isCorrect = translation === word.translate;
      setResult({
        id: word.id,
        status: isCorrect,
        answer: translation,
      });
      setSelectedTranslation(translation);
    }
  };

  const handleNextWord = () => {
    setSelectedTranslation(null);
    console.log(result);
    setResult(null);
    onNextWord();
  };

  const isCorrect = result?.status === true;
  const isIncorrect = result?.status === false;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '50px', marginBottom: '20px' }}>{word.translate}</h1>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {wordsFromApi.map((option) => (
          <div
            key={option.id}
            style={{
              marginRight: '10px',
              cursor: 'default',
              padding: '10px',
              border: '1px solid',
              borderRadius: '5px',
              textAlign: 'center',
              backgroundColor:
                isCorrect && selectedTranslation === option.translate
                  ? 'green'
                  : isIncorrect && selectedTranslation === option.translate
                  ? 'red'
                  : 'white',
              color:
                isCorrect && selectedTranslation === option.translate
                  ? 'white'
                  : isIncorrect && selectedTranslation === option.translate
                  ? 'white'
                  : 'black',
                  display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px', // Set a fixed height for better appearance

            }}
            onClick={() => handleAnswerSelection(option.translate)}
          >
            {option.native}
          </div>
        ))}
      </div>
      {result && (
        <div>
          {isCorrect ? (
            <p style={{ color: 'green' }}>Correct!</p>
          ) : (
            <p style={{ color: 'red' }}>Incorrect!</p>
          )}
        </div>
      )}
      <button onClick={handleNextWord} style={{ marginTop: '20px' }}>
        Наступне слово(Next Word)
      </button>
    </div>
  );
};


const Editor = () => {

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

    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const handleNextWord = () => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % wordsFromApi.length);
    };

/*<section>
    <h1>Editors Page</h1>
    <br />
    <p>You must have been assigned an Editor role.</p>
    <div className="flexGrow">
        <Link to="/">Home</Link>
    </div>
</section>*/
    return (
        <>
            <Sidebar onSignOut={logout} />
            <main style={mainStyles}>
            <section>
              <WordExercise word={wordsFromApi[currentWordIndex]} onNextWord={handleNextWord} />
            </section>
            </main>
        </>
    )
}

export default Editor

import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useMemo, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import Result from './Result';

const synth = window.speechSynthesis;

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


const WordMeaning = () => {
  const voices = useMemo(() => synth.getVoices(), []);
  const [voiceSelected, setVoiceSelected] = useState('Google US English');
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState('');
  const [meanings, setMeanings] = useState([]);
  const [phonetics, setPhonetics] = useState([]);
  const [word, setWord] = useState('');
  const [error, setError] = useState('');
  const dictionaryApi = (text) => {
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setMeanings(result[0].meanings);
        setPhonetics(result[0].phonetics);
        setWord(result[0].word);
        setError('');
      })
      .catch((err) => setError(err));
  };

  const reset = () => {
    setIsSpeaking('');
    setError('');
    setMeanings([]);
    setPhonetics([]);
    setWord('');
  };

  useEffect(() => {
    if (!text.trim()) return reset();
    const debounce = setTimeout(() => {
      dictionaryApi(text);
    }, 1000);
    return () => clearTimeout(debounce);
  }, [text]);

  const startSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((voice) => voice.name === voiceSelected);
    utterance.voice = voice;
    synth.speak(utterance);
  };
  const handleSpeech = () => {
    if (!text.trim()) return reset();
    if (!synth.speaking) {
      startSpeech(text);
      setIsSpeaking('speak');
    } else {
      synth.cancel();
    }

    setInterval(() => {
      if (!synth.speaking) {
        setIsSpeaking('');
      }
    }, 1000);
  };

  return (
    <div className='container'>
      <h1>English Dictionary</h1>

      <form>
        <div className='row'>
          <textarea
            cols='30'
            rows='4'
            placeholder='Enter text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className='voices-icons'>
            <div className='select-voices'>
              <select
                value={voiceSelected}
                onChange={(e) => setVoiceSelected(e.target.value)}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <i
              className={`fa-solid fa-volume-high ${isSpeaking}`}
              onClick={handleSpeech}
            />
          </div>
        </div>
      </form>

      {text.trim() !== '' && !error && (
        <Result
          word={word}
          meanings={meanings}
          phonetics={phonetics}
          setText={setText}
        />
      )}
    </div>
  );
};

const Lounge = () => {

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

    return (
        <>
            <Sidebar onSignOut={logout} />
            <main style={mainStyles}>
            <section>
                <WordMeaning/>
            </section>
            </main>
        </>
    )
}

export default Lounge

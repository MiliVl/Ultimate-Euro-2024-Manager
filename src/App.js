import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Game from './Game';
import ComputerVsComputerKnockoutStage from './ComputerVsComputerGame';


function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>404 Not Found</h2>
            <button onClick={() => navigate('/')} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
                Back to Home
            </button>
        </div>
    );
}

function Home() {
    const navigate = useNavigate();

    const handleUserVsComputer = () => {
        navigate('/userVsComputer');
    };

    const handleComputerVsComputer = () => {
        console.log("Computer VS Computer selected");
        navigate('/ComputerVsComputer');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', position: 'relative' }}>
            <h1>Welcome to Ultimate Euro 2024 Manager Game</h1>
            <button onClick={handleUserVsComputer} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
                User Team VS Computer Team
            </button>
            <button onClick={handleComputerVsComputer} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
                Computer Team VS Computer Team
            </button>
            <div className="ball-container">
                <img src="/soccer-ball.png" alt="Soccer Ball" className="soccer-ball" />
            </div>
        </div>
    );
}

function UserVsComputer() {
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5003/api/tabel_joc')
            .then(response => {
                const uniqueCountries = Array.from(new Set(response.data.map(country => country.Country)));
                setCountries(uniqueCountries);
            })
            .catch(error => console.error(error));
    }, []);

    const handleSelectCountry = (country) => {
        localStorage.setItem('selectedCountry', JSON.stringify(country));
        navigate(`/playerSelection/${country}`);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Choose your team country</h2>
            <ul>
                {countries.map((country, index) => (
                    <button key={index} onClick={() => handleSelectCountry(country)} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
                        {country}
                    </button>
                ))}
            </ul>
            <button onClick={() => navigate(-1)} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: 'red', color: 'white' }}>
                Back
            </button>
        </div>
    );
}

function PlayerSelection() {
    const { countryId } = useParams();
    const [players, setPlayers] = useState([]);
    const [gameBoard, setGameBoard] = useState({
        goalkeeper: Array(1).fill(null),
        defenders: Array(4).fill(null),
        midfielders: Array(4).fill(null),
        attackers: Array(2).fill(null)
    });
    const [selectedPosition, setSelectedPosition] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5003/api/tabel_joc/${countryId}`)
            .then(response => {
                const filteredPlayers = response.data.filter(player => player.Country === countryId);
                setPlayers(filteredPlayers);
            })
            .catch(error => console.error(error));
    }, [countryId]);

    const getSelectedPlayers = () => {
        const allPlayers = [
            ...gameBoard.goalkeeper,
            ...gameBoard.defenders,
            ...gameBoard.midfielders,
            ...gameBoard.attackers
        ];
        return allPlayers.filter(player => player !== null);
    };

    const handleSelectPlayer = (position, player, index) => {
        setGameBoard(prevState => {
            const updatedPosition = prevState[position].slice();
            updatedPosition[index] = player;
            const newState = { ...prevState, [position]: updatedPosition };
            localStorage.setItem('selectedTeam', JSON.stringify(newState));
            return newState;
        });
        setSelectedPosition(null);
    };


    const renderPlayers = (position, index) => {
        const selectedPlayers = getSelectedPlayers();
        const availablePlayers = players.filter(player => !selectedPlayers.includes(player));
        
        const containerClass = position === 'goalkeeper' ? 'player-list-container goalkeeper-list' : 'player-list-container';
    
        return (
            <div className={containerClass}>
                <ul className="player-list">
                    {availablePlayers.map(player => (
                        <li key={player["Player Name"]} className="player-list-item">
                            <button
                                onClick={() => handleSelectPlayer(position, player, index)}
                                className="player-button"
                            >
                                <strong>{player["Player Name"]}</strong><br />
                                Rating: {player["Player Rating"]}<br />
                                Defence: {player["Defence Attribute"]}<br />
                                Passing: {player["Passing Attribute"]}<br />
                                Shooting: {player["Shooting Attribute"]}<br />
                                Type: {player["Player Type"]}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={() => setSelectedPosition(null)} className="cancel-button">
                    Cancel
                </button>
            </div>
        );
    };
    
    const handleStartGame = () => {
        navigate('/game', { state: { gameBoard } });
    };

    return (
        <div className="App-header">
            <h2>Select Players for {countryId}</h2>
            <div className="football-field">
                <div className="middle-delimiter"></div>
                <div className="goal"></div>

                {gameBoard.goalkeeper.map((goalkeeper, index) => (
                    <div className="goalkeeper-position" key={index}>
                        {goalkeeper ? (
                            <div>{goalkeeper["Player Name"]}</div>
                        ) : (
                            <button onClick={() => setSelectedPosition({ position: 'goalkeeper', index }) && (false)} className="position-button">
                                Select Goalkeeper
                            </button>
                        )}
                        {selectedPosition?.position === 'goalkeeper' && selectedPosition.index === index && renderPlayers('goalkeeper', index)}
                    </div>
                ))}

                {gameBoard.defenders.map((defender, index) => (
                    <div className={`defender-position d${index + 1}`} key={index}>
                        {defender ? (
                            <div>{defender["Player Name"]}</div>
                        ) : (
                            <button onClick={() => setSelectedPosition({ position: 'defenders', index })} className="position-button">
                                Select Defender {index + 1}
                            </button>
                        )}
                        {selectedPosition?.position === 'defenders' && selectedPosition.index === index && renderPlayers('defenders', index)}
                    </div>
                ))}

                {gameBoard.midfielders.map((midfielder, index) => (
                    <div className={`midfielder-position m${index + 1}`} key={index}>
                        {midfielder ? (
                            <div>{midfielder["Player Name"]}</div>
                        ) : (
                            <button onClick={() => setSelectedPosition({ position: 'midfielders', index })} className="position-button">
                                Select Midfielder {index + 1}
                            </button>
                        )}
                        {selectedPosition?.position === 'midfielders' && selectedPosition.index === index && renderPlayers('midfielders', index)}
                    </div>
                ))}

                {gameBoard.attackers.map((attacker, index) => (
                    <div className={`attacker-position a${index + 1}`} key={index}>
                        {attacker ? (
                            <div>{attacker["Player Name"]}</div>
                        ) : (
                            <button onClick={() => setSelectedPosition({ position: 'attackers', index })} className="position-button">
                                Select Attacker {index + 1}
                            </button>
                        )}
                        {selectedPosition?.position === 'attackers' && selectedPosition.index === index && renderPlayers('attackers', index)}
                    </div>
                ))}
            </div>
            <button onClick={handleStartGame} className="App-link">
                Start Game
            </button>
            <button onClick={() => navigate(-1)} className="App-link">
                Back
            </button>
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/userVsComputer" element={<UserVsComputer />} />
                    <Route path="/playerSelection/:countryId" element={<PlayerSelection />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/ComputerVsComputer" element={<ComputerVsComputerKnockoutStage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

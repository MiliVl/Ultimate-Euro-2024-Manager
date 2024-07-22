import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const getRandomElements = (arr, num) => {
  let shuffled = arr.slice(0);
  let i = arr.length;
  let min = i - num;
  let temp, index;

  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }

  return shuffled.slice(min);
};

const calculateTeamScore = (team) => {
  if (!team.players || team.players.length === 0) return 0;
  const totalRating = team.players.reduce((sum, player) => {
    if (player && player["Player Rating"]) {
      const rating = parseInt(player["Player Rating"], 10);
      if (!isNaN(rating)) {
        return sum + rating;
      }
    }
    return sum;
  }, 0);
  return totalRating / team.players.length;
};

const generateTeams = (players, userCountry, numTeams, selectedPlayers) => {
  const userPlayers = selectedPlayers || players.filter(player => player.Country === userCountry);

  const userTeam = {
    id: 0,
    name: `${userCountry} Team`,
    players: userPlayers.slice(0, 5),
  };

  const uniqueCountries = [...new Set(players.map(player => player.Country))];
  const remainingCountries = uniqueCountries.filter(country => country !== userCountry);
  const randomCountries = getRandomElements(remainingCountries, numTeams - 1);

  const teams = [userTeam];
  randomCountries.forEach((country, index) => {
    const countryPlayers = players.filter(player => player.Country === country);
    teams.push({
      id: index + 1,
      name: `${country} Team`,
      players: getRandomElements(countryPlayers, 5),
    });
  });

  return teams;
};

const generateMatches = (teams) => {
  const matches = [];
  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      matches.push({
        team1: teams[i],
        team2: teams[i + 1],
        score1: calculateTeamScore(teams[i]),
        score2: calculateTeamScore(teams[i + 1]),
      });
    }
  }
  return matches;
};

const KnockoutStage = () => {
  const { country } = useParams();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState('Round of 16');
  const [result, setResult] = useState('');
  const [tournamentFinished, setTournamentFinished] = useState(false);
  const [userTeam, setUserTeam] = useState(null);
  const [userResult, setUserResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5003/api/tabel_joc');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setPlayers(data);

        const storedTeamData = JSON.parse(localStorage.getItem('selectedTeam'));
        const selectedCountry = JSON.parse(localStorage.getItem('selectedCountry'));
        console.log('Selected Country from Json in Player vs Computer:', selectedCountry);
        const selectedPlayers = storedTeamData
          ? [
              storedTeamData.goalkeeper,
              ...storedTeamData.defenders,
              ...storedTeamData.midfielders,
              ...storedTeamData.attackers,
            ].filter(player => player !== null)
          : null;

        console.log('Selected Players:', selectedPlayers);

        const userTeam = {
          id: 0,
          name: `${selectedCountry} Team`,
          players: selectedPlayers.slice(0, 5),
        };
        setUserTeam(userTeam);

        const generatedTeams = generateTeams(data, selectedCountry, 16, selectedPlayers);
        setTeams(generatedTeams);
        setMatches(generateMatches(generatedTeams));
      } catch (error) {
        console.error('Error fetching player data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country]);

  const handleMatchOutcome = useCallback(() => {
    const match = matches[currentMatchIndex];
    if (!match) return;

    const winner = match.score1 > match.score2 ? match.team1 : match.team2;
    const resultText = `${winner.name} Wins ${match.score1.toFixed(1)} - ${match.score2.toFixed(1)}`;

    setResult(resultText);

    if (userTeam && (userTeam.name === match.team1.name || userTeam.name === match.team2.name)) {
      if (userTeam.name === winner.name) {
        setUserResult("You won!");
      } else {
        setUserResult("You lost!");
      }
    }

    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(prevIndex => prevIndex + 1);
    } else {
      const nextRoundTeams = matches.map(match => match.score1 > match.score2 ? match.team1 : match.team2);
      
      if (nextRoundTeams.length > 1) {
        setMatches(generateMatches(nextRoundTeams));
        setCurrentMatchIndex(0);
        setCurrentRound(getNextRoundName(currentRound));
      } else {
        setResult(`${nextRoundTeams[0].name} is the Tournament Champion!`);
        setTournamentFinished(true);  
      }
    }
  }, [matches, currentMatchIndex, currentRound, userTeam]);

  const getNextRoundName = (currentRound) => {
    switch (currentRound) {
      case 'Round of 16':
        return 'Quarterfinals';
      case 'Quarterfinals':
        return 'Semifinals';
      case 'Semifinals':
        return 'Finals';
      default:
        return '';
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const currentMatch = matches[currentMatchIndex];

  return (
    <div className="game-container">
      <h2>Knockout Stage</h2>
      <h3>{currentRound}</h3>
      {currentMatch ? (
        <div className="match" key={currentMatchIndex}>
          <p><strong>{currentMatch.team1.name}</strong> vs <strong>{currentMatch.team2.name}</strong></p>
          <p><strong>{currentMatch.team1.name}</strong> Average Score: {currentMatch.score1.toFixed(1)}</p>
          <p><strong>{currentMatch.team2.name}</strong> Average Score: {currentMatch.score2.toFixed(1)}</p>
     
          {!tournamentFinished && (
            <button onClick={handleMatchOutcome} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
              Proceed to Next Match
            </button>
          )}
        </div>
      ) : (
        <p>No matches available.</p>
      )}
      {result && <h4>{result}</h4>}
      {userResult && <h4>{userResult}</h4>}
      <button onClick={() => navigate('/')} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
        Back to Home
      </button>
    </div>
  );
};

export default KnockoutStage;

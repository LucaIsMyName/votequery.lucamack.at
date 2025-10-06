import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../context/VotingContext';
import type { Vote, VotingSystemType } from '../types';

const Query = () => {
  const navigate = useNavigate();
  const { session, submitVotes, calculateResults } = useVoting();
  
  const [currentSystem, setCurrentSystem] = useState<VotingSystemType | null>(null);
  const [currentVotes, setCurrentVotes] = useState<Vote[]>([]);
  const [completedSystems, setCompletedSystems] = useState<VotingSystemType[]>([]);
  
  useEffect(() => {
    if (!session) {
      navigate('/create');
      return;
    }
    
    if (session.votingSystems.length > 0 && !currentSystem) {
      setCurrentSystem(session.votingSystems[0].type);
    }
  }, [session, navigate, currentSystem]);
  
  const handleSingleVote = (partyId: string) => {
    if (!currentSystem || currentSystem !== 'single') return;
    
    setCurrentVotes([{ partyId }]);
  };
  
  const handleRankedVote = (partyId: string, rank: number) => {
    if (!currentSystem || currentSystem !== 'ranked') return;
    
    // Check if this party already has a rank assigned
    const existingVoteIndex = currentVotes.findIndex(vote => vote.partyId === partyId);
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      const updatedVotes = [...currentVotes];
      updatedVotes[existingVoteIndex] = { partyId, rank };
      setCurrentVotes(updatedVotes);
    } else {
      // Add new vote
      setCurrentVotes([...currentVotes, { partyId, rank }]);
    }
  };
  
  const handleProportionalVote = (partyId: string, weight: number) => {
    if (!currentSystem || currentSystem !== 'proportional') return;
    
    // Check if this party already has a weight assigned
    const existingVoteIndex = currentVotes.findIndex(vote => vote.partyId === partyId);
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      const updatedVotes = [...currentVotes];
      updatedVotes[existingVoteIndex] = { partyId, weight };
      setCurrentVotes(updatedVotes);
    } else {
      // Add new vote
      setCurrentVotes([...currentVotes, { partyId, weight }]);
    }
  };
  
  const handleSubmitVotes = () => {
    if (!session || !currentSystem) return;
    
    submitVotes(currentSystem, currentVotes);
    setCompletedSystems([...completedSystems, currentSystem]);
    
    // Find next system to vote on
    const remainingSystems = session.votingSystems
      .filter(system => !completedSystems.includes(system.type) && system.type !== currentSystem);
    
    if (remainingSystems.length > 0) {
      setCurrentSystem(remainingSystems[0].type);
      setCurrentVotes([]);
    } else {
      // All voting systems completed
      calculateResults();
      navigate('/results');
    }
  };
  
  if (!session || !currentSystem) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  const currentSystemObj = session.votingSystems.find(system => system.type === currentSystem);
  
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 my-6">Cast Your Vote</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {currentSystemObj?.name}
            </h2>
            <p className="text-gray-600 mt-1">{currentSystemObj?.description}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-800 mb-2">Voting Instructions:</h3>
            {currentSystem === 'single' && (
              <p>Select one party that you want to vote for.</p>
            )}
            {currentSystem === 'ranked' && (
              <p>Rank the parties in order of preference (1 being your most preferred).</p>
            )}
            {currentSystem === 'proportional' && (
              <p>Distribute 100 points among the parties according to your preferences.</p>
            )}
          </div>
          
          {currentSystem === 'single' && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">Select one party that you want to vote for:</p>
              {session.parties.map(party => (
                <div key={party.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <label className="flex items-center cursor-pointer w-full">
                    <input
                      type="radio"
                      name="single-vote"
                      checked={currentVotes.some(vote => vote.partyId === party.id)}
                      onChange={() => handleSingleVote(party.id)}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3 font-medium text-lg text-gray-800">{party.name}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
          
          {currentSystem === 'ranked' && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">Rank parties in order of preference:</p>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700">Assign a rank to each party (1 being your most preferred).</p>
              </div>
              {session.parties.map((party) => (
                <div key={party.id} className="border border-gray-200 bg-white rounded-lg p-4 flex items-center justify-between">
                  <span className="font-medium text-lg text-gray-800">{party.name}</span>
                  <select
                    value={currentVotes.find(vote => vote.partyId === party.id)?.rank || ''}
                    onChange={(e) => handleRankedVote(party.id, Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="">Select rank</option>
                    {session.parties.map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          
          {currentSystem === 'proportional' && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">Distribute 100 points among the parties according to your preferences:</p>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-700">Remaining points: {100 - currentVotes.reduce((sum, vote) => sum + (vote.weight || 0), 0)}</p>
              </div>
              {session.parties.map(party => (
                <div key={party.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg text-gray-800">{party.name}</span>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentVotes.find(vote => vote.partyId === party.id)?.weight || 0}
                        onChange={(e) => handleProportionalVote(party.id, Number(e.target.value))}
                        className="mr-3 w-48"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentVotes.find(vote => vote.partyId === party.id)?.weight || 0}
                        onChange={(e) => handleProportionalVote(party.id, Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-right"
                      />
                      <span className="ml-2 text-gray-600">points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmitVotes}
              disabled={
                (currentSystem === 'single' && currentVotes.length === 0) ||
                (currentSystem === 'ranked' && currentVotes.filter(vote => vote.rank !== undefined).length < session.parties.length) ||
                (currentSystem === 'proportional' && 
                  currentVotes.reduce((sum, vote) => sum + (vote.weight || 0), 0) !== 100)
              }
              className={`py-3 px-8 rounded-lg text-lg transition duration-300 ${
                (currentSystem === 'single' && currentVotes.length === 0) ||
                (currentSystem === 'ranked' && currentVotes.filter(vote => vote.rank !== undefined).length < session.parties.length) ||
                (currentSystem === 'proportional' && 
                  currentVotes.reduce((sum, vote) => sum + (vote.weight || 0), 0) !== 100)
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Submit Votes
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-gray-700">Voting Progress:</h3>
          <div className="flex flex-wrap gap-2">
            {session.votingSystems.map(system => (
              <div
                key={system.id}
                className={`px-3 py-1 rounded-full text-sm ${
                  completedSystems.includes(system.type)
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : system.type === currentSystem
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                {system.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Query;
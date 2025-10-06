import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../context/VotingContext';
import { v4 as uuidv4 } from 'uuid';
import type { Party, VotingSystemType } from '../types';

const Create = () => {
  const navigate = useNavigate();
  const { createSession, toggleVotingSystem } = useVoting();
  
  const [parties, setParties] = useState<Party[]>([]);
  const [partyName, setPartyName] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<VotingSystemType[]>(['single', 'ranked', 'proportional']);
  
  const handleAddParty = () => {
    if (partyName.trim() === '') return;
    
    const newParty: Party = {
      id: uuidv4(),
      name: partyName.trim()
    };
    
    setParties([...parties, newParty]);
    setPartyName('');
  };
  
  const handleRemoveParty = (id: string) => {
    setParties(parties.filter(party => party.id !== id));
  };
  
  const handleToggleSystem = (type: VotingSystemType) => {
    if (selectedSystems.includes(type)) {
      setSelectedSystems(selectedSystems.filter(system => system !== type));
    } else {
      setSelectedSystems([...selectedSystems, type]);
    }
  };
  
  const handleSubmit = () => {
    if (parties.length < 2) {
      alert('Please add at least 2 parties');
      return;
    }
    
    if (selectedSystems.length === 0) {
      alert('Please select at least one voting system');
      return;
    }
    
    createSession(parties, []);
    selectedSystems.forEach(system => {
      if (system !== 'single') { // Single is already included by default
        toggleVotingSystem(system);
      }
    });
    
    navigate('/query');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 my-6">Create Voting Scenario</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Parties</h2>
          
          <div className="flex mb-4">
            <input
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="Enter party name"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAddParty()}
            />
            <button
              onClick={handleAddParty}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition duration-200"
            >
              Add
            </button>
          </div>
          
          {parties.length > 0 ? (
            <div className="space-y-2 mt-4">
              <h3 className="font-medium text-gray-700">Added Parties:</h3>
              <ul className="bg-gray-50 rounded-lg p-3">
                {parties.map(party => (
                  <li key={party.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <span className="font-medium">{party.name}</span>
                    <button
                      onClick={() => handleRemoveParty(party.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 italic">No parties added yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Voting Systems</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="single-vote"
                checked={selectedSystems.includes('single')}
                onChange={() => handleToggleSystem('single')}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="single-vote" className="ml-2 text-gray-700">
                <span className="font-medium">Single Vote</span> - Each voter gets one vote for their preferred party
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ranked-choice"
                checked={selectedSystems.includes('ranked')}
                onChange={() => handleToggleSystem('ranked')}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="ranked-choice" className="ml-2 text-gray-700">
                <span className="font-medium">Ranked Choice</span> - Voters rank parties in order of preference
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="proportional"
                checked={selectedSystems.includes('proportional')}
                onChange={() => handleToggleSystem('proportional')}
                className="h-5 w-5 text-blue-600 rounded"
              />
              <label htmlFor="proportional" className="ml-2 text-gray-700">
                <span className="font-medium">Proportional Representation</span> - Seats are allocated in proportion to votes
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={parties.length < 2 || selectedSystems.length === 0}
            className={`py-3 px-8 rounded-lg text-lg transition duration-300 ${
              parties.length < 2 || selectedSystems.length === 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Create Voting Scenario
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;

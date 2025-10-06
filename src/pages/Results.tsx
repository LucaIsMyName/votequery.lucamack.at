import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '../context/VotingContext';
import type { VotingSystemType } from '../types';

const Results = () => {
  const navigate = useNavigate();
  const { session, resetSession } = useVoting();
  
  useEffect(() => {
    if (!session || !session.results) {
      navigate('/create');
    }
  }, [session, navigate]);
  
  if (!session || !session.results) {
    return <div className="p-8 text-center">No results available</div>;
  }
  
  const getSystemName = (type: VotingSystemType): string => {
    const system = session.votingSystems.find(s => s.type === type);
    return system ? system.name : type;
  };
  
  const getSystemColor = (type: VotingSystemType): string => {
    switch (type) {
      case 'single':
        return 'blue';
      case 'ranked':
        return 'purple';
      case 'proportional':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  const handleStartOver = () => {
    resetSession();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 my-6">Voting Results</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comparison of Voting Systems</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(session.results).map(([systemType, result]) => {
              const type = systemType as VotingSystemType;
              const color = getSystemColor(type);
              
              return (
                <div key={systemType} className={`border border-${color}-200 rounded-lg overflow-hidden`}>
                  <div className={`bg-${color}-50 border-b border-${color}-100 p-4`}>
                    <h3 className={`text-xl font-semibold text-${color}-800`}>{getSystemName(type)}</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-3">
                      {result.partyResults.map((partyResult, index) => (
                        <div key={partyResult.partyId} className="border-b border-gray-100 pb-2 last:border-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-medium ${index === 0 ? 'text-green-600' : ''}`}>
                              {index === 0 && '🏆 '}{partyResult.partyName}
                            </span>
                            <span className="font-semibold">
                              {partyResult.percentage.toFixed(1)}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`bg-${color}-600 h-2.5 rounded-full`} 
                              style={{ width: `${partyResult.percentage}%` }}
                            ></div>
                          </div>
                          
                          {type === 'proportional' && partyResult.seats !== undefined && (
                            <div className="text-sm text-gray-600 mt-1">
                              Seats: {partyResult.seats}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Observations</h3>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 shadow-sm">
              <p className="text-gray-700">
                {(() => {
                  // Get winners from each system
                  const winners = Object.entries(session.results).reduce((acc, [systemType, result]) => {
                    if (result.partyResults.length > 0) {
                      acc[systemType as VotingSystemType] = result.partyResults[0].partyId;
                    }
                    return acc;
                  }, {} as Record<VotingSystemType, string>);
                  
                  // Check if all winners are the same
                  const uniqueWinners = new Set(Object.values(winners));
                  
                  if (uniqueWinners.size === 1) {
                    return `All voting systems produced the same winner. This suggests that the preference for the winning party is strong across different voting methods.`;
                  } else {
                    return `Different voting systems produced different winners. This demonstrates how the choice of voting system can significantly impact election outcomes even with the same voters and preferences.`;
                  }
                })()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button
            onClick={handleStartOver}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

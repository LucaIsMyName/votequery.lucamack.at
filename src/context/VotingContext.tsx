import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Party, 
  VotingSystem, 
  Vote, 
  VotingSession,
  VotingSystemType
} from '../types';
import {
  calculateSingleVoteResults,
  calculateRankedChoiceResults,
  calculateProportionalResults
} from '../models/votingSystems';

interface VotingContextType {
  session: VotingSession | null;
  createSession: (parties: Party[], systems: VotingSystem[]) => void;
  addParty: (name: string) => void;
  removeParty: (id: string) => void;
  toggleVotingSystem: (type: VotingSystemType) => void;
  submitVotes: (systemType: VotingSystemType, votes: Vote[]) => void;
  calculateResults: () => void;
  resetSession: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

const defaultVotingSystems: VotingSystem[] = [
  {
    id: 'single',
    type: 'single',
    name: 'Single Vote',
    description: 'Each voter gets one vote for their preferred party.'
  },
  {
    id: 'ranked',
    type: 'ranked',
    name: 'Ranked Choice',
    description: 'Voters rank parties in order of preference.'
  },
  {
    id: 'proportional',
    type: 'proportional',
    name: 'Proportional Representation',
    description: 'Seats are allocated in proportion to the votes each party receives.'
  }
];

export const VotingProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<VotingSession | null>(null);

  const createSession = (parties: Party[], systems: VotingSystem[] = defaultVotingSystems) => {
    const newSession: VotingSession = {
      id: uuidv4(),
      parties,
      votingSystems: systems,
      votes: {
        single: [],
        ranked: [],
        proportional: []
      }
    };
    setSession(newSession);
  };

  const addParty = (name: string) => {
    if (!session) return;
    
    const newParty: Party = {
      id: uuidv4(),
      name
    };
    
    setSession({
      ...session,
      parties: [...session.parties, newParty]
    });
  };

  const removeParty = (id: string) => {
    if (!session) return;
    
    setSession({
      ...session,
      parties: session.parties.filter(party => party.id !== id)
    });
  };

  const toggleVotingSystem = (type: VotingSystemType) => {
    if (!session) return;
    
    const systemExists = session.votingSystems.some(system => system.type === type);
    
    if (systemExists) {
      setSession({
        ...session,
        votingSystems: session.votingSystems.filter(system => system.type !== type)
      });
    } else {
      const systemToAdd = defaultVotingSystems.find(system => system.type === type);
      if (systemToAdd) {
        setSession({
          ...session,
          votingSystems: [...session.votingSystems, systemToAdd]
        });
      }
    }
  };

  const submitVotes = (systemType: VotingSystemType, votes: Vote[]) => {
    if (!session) return;
    
    setSession({
      ...session,
      votes: {
        ...session.votes,
        [systemType]: votes
      }
    });
  };

  const calculateResults = () => {
    if (!session) return;
    
    const results = {
      single: calculateSingleVoteResults(session.parties, session.votes.single),
      ranked: calculateRankedChoiceResults(session.parties, session.votes.ranked),
      proportional: calculateProportionalResults(session.parties, session.votes.proportional)
    };
    
    setSession({
      ...session,
      results
    });
  };

  const resetSession = () => {
    setSession(null);
  };

  return (
    <VotingContext.Provider value={{
      session,
      createSession,
      addParty,
      removeParty,
      toggleVotingSystem,
      submitVotes,
      calculateResults,
      resetSession
    }}>
      {children}
    </VotingContext.Provider>
  );
};

export default VotingContext;

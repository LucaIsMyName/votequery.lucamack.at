import type { Party, Vote, VotingResult, PartyResult } from '../types';

// Single vote system (First Past the Post)
export const calculateSingleVoteResults = (parties: Party[], votes: Vote[]): VotingResult => {
  const results: Record<string, number> = {};
  
  // Initialize results
  parties.forEach(party => {
    results[party.id] = 0;
  });
  
  // Count votes
  votes.forEach(vote => {
    if (results[vote.partyId] !== undefined) {
      results[vote.partyId]++;
    }
  });
  
  const totalVotes = votes.length;
  
  // Create party results
  const partyResults: PartyResult[] = parties.map(party => {
    const score = results[party.id];
    const percentage = totalVotes > 0 ? (score / totalVotes) * 100 : 0;
    
    return {
      partyId: party.id,
      partyName: party.name,
      score,
      percentage
    };
  });
  
  // Sort by score (descending)
  partyResults.sort((a, b) => b.score - a.score);
  
  return {
    systemType: 'single',
    partyResults
  };
};

// Ranked choice voting system
export const calculateRankedChoiceResults = (parties: Party[], votes: Vote[]): VotingResult => {
  // Group votes by rank
  const votesByRank: Record<number, Vote[]> = {};
  votes.forEach(vote => {
    if (vote.rank !== undefined) {
      if (!votesByRank[vote.rank]) {
        votesByRank[vote.rank] = [];
      }
      votesByRank[vote.rank].push(vote);
    }
  });
  
  // Initialize results
  const results: Record<string, number> = {};
  parties.forEach(party => {
    results[party.id] = 0;
  });
  
  // Process first choices
  const firstChoiceVotes = votesByRank[1] || [];
  firstChoiceVotes.forEach(vote => {
    if (results[vote.partyId] !== undefined) {
      results[vote.partyId]++;
    }
  });
  
  // TODO: Implement full ranked choice algorithm with elimination rounds
  // This is a simplified version that just counts first choices
  
  const totalVotes = firstChoiceVotes.length;
  
  // Create party results
  const partyResults: PartyResult[] = parties.map(party => {
    const score = results[party.id];
    const percentage = totalVotes > 0 ? (score / totalVotes) * 100 : 0;
    
    return {
      partyId: party.id,
      partyName: party.name,
      score,
      percentage
    };
  });
  
  // Sort by score (descending)
  partyResults.sort((a, b) => b.score - a.score);
  
  return {
    systemType: 'ranked',
    partyResults
  };
};

// Proportional voting system
export const calculateProportionalResults = (
  parties: Party[], 
  votes: Vote[], 
  totalSeats: number = 100
): VotingResult => {
  // Initialize results
  const results: Record<string, number> = {};
  parties.forEach(party => {
    results[party.id] = 0;
  });
  
  // Count votes (weighted if applicable)
  votes.forEach(vote => {
    if (results[vote.partyId] !== undefined) {
      results[vote.partyId] += vote.weight || 1;
    }
  });
  
  const totalVotes = votes.reduce((sum, vote) => sum + (vote.weight || 1), 0);
  
  // Calculate seats using D'Hondt method
  const seatAllocation: Record<string, number> = {};
  parties.forEach(party => {
    seatAllocation[party.id] = 0;
  });
  
  // Allocate seats
  for (let seat = 0; seat < totalSeats; seat++) {
    let maxQuotient = 0;
    let maxPartyId = '';
    
    parties.forEach(party => {
      const quotient = results[party.id] / (seatAllocation[party.id] + 1);
      if (quotient > maxQuotient) {
        maxQuotient = quotient;
        maxPartyId = party.id;
      }
    });
    
    if (maxPartyId) {
      seatAllocation[maxPartyId]++;
    }
  }
  
  // Create party results
  const partyResults: PartyResult[] = parties.map(party => {
    const score = results[party.id];
    const percentage = totalVotes > 0 ? (score / totalVotes) * 100 : 0;
    const seats = seatAllocation[party.id];
    
    return {
      partyId: party.id,
      partyName: party.name,
      score,
      percentage,
      seats
    };
  });
  
  // Sort by score (descending)
  partyResults.sort((a, b) => b.score - a.score);
  
  return {
    systemType: 'proportional',
    partyResults
  };
};

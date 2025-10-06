export type VotingSystemType = 'proportional' | 'ranked' | 'single';

export interface Party {
  id: string;
  name: string;
}

export interface VotingSystem {
  id: string;
  type: VotingSystemType;
  name: string;
  description: string;
}

export interface Vote {
  partyId: string;
  rank?: number; // Used for ranked choice voting
  weight?: number; // Used for proportional voting
}

export interface VotingSession {
  id: string;
  parties: Party[];
  votingSystems: VotingSystem[];
  votes: Record<VotingSystemType, Vote[]>;
  results?: Record<VotingSystemType, VotingResult>;
}

export interface VotingResult {
  systemType: VotingSystemType;
  partyResults: PartyResult[];
}

export interface PartyResult {
  partyId: string;
  partyName: string;
  score: number;
  percentage: number;
  seats?: number; // For proportional systems
}

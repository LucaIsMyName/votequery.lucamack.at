# VoteQuery - Compare Voting Systems

VoteQuery is a web application that allows users to compare how different voting systems affect election outcomes. By simulating votes across multiple voting systems, users can see how the same voter preferences can lead to different results depending on the voting method used.

## Features

- Create voting scenarios with custom parties/candidates
- Test multiple voting systems in one session:
  - Single Vote (First Past the Post)
  - Ranked Choice Voting
  - Proportional Representation
- Cast votes using different methods
- Compare results across systems
- Visualize how voting systems impact outcomes

## Tech Stack

- React with TypeScript
- Vite for fast development and building
- React Router for navigation
- Tailwind CSS (via CDN) for styling
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Visit the homepage and click "Create New Voting Scenario"
2. Add parties/candidates and select voting systems to compare
3. Cast votes using each selected voting system
4. View and compare the results

## Voting Systems Explained

### Single Vote (First Past the Post)
Each voter gets one vote for their preferred party. The party with the most votes wins.

### Ranked Choice Voting
Voters rank parties in order of preference. If no party has a majority, the party with the fewest votes is eliminated, and their votes are redistributed to the voters' next choices. This continues until a party has a majority.

### Proportional Representation
Seats are allocated in proportion to the votes each party receives. This system aims to make the distribution of seats match the distribution of votes as closely as possible.

## License

MIT

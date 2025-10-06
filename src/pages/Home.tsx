import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">VoteQuery</h1>
        <p className="text-xl text-center text-gray-700 mb-8">
          Compare how different voting systems affect election outcomes
        </p>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Create a new voting scenario with parties and voting systems</li>
              <li>Cast votes using different voting methods</li>
              <li>Compare the results across different voting systems</li>
              <li>Discover how the same votes can lead to different outcomes</li>
            </ol>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-green-800 mb-3">Available Voting Systems</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-green-200 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-green-800">Single Vote</span>
                  <p className="text-sm text-gray-600">Each voter gets one vote for their preferred party.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-green-200 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-green-800">Ranked Choice</span>
                  <p className="text-sm text-gray-600">Voters rank parties in order of preference.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-green-200 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-green-800">Proportional Representation</span>
                  <p className="text-sm text-gray-600">Seats are allocated in proportion to the votes each party receives.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 flex justify-center">
          <Link 
            to="/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
          >
            Create New Voting Scenario
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

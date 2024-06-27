import React from 'react';
import WeatherDashboard from './components/WeatherDashboard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full p-4 text-center text-white bg-blue-600">
        <h1 className="text-2xl">Weather Dashboard</h1>
      </header>
      <main className="flex justify-center flex-grow p-4">
        <WeatherDashboard />
      </main>
    </div>
  );
};

export default App;

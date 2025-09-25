// In your Next.js project, e.g., app/page.tsx

"use client";

import React, { useState, useMemo } from 'react';
import axios from 'axios'; // Using axios for API requests

// --- TYPE DEFINITIONS ---
interface CalculationResults {
  emi: string;
  totalInterest: string;
  totalPayable: string;
}

interface BankLogo {
  name: string;
  url: string;
}

// --- UTILITY FUNCTIONS ---
/**
 * Formats a number into Indian currency format (e.g., 1,00,000).
 * @param value The number or string to format.
 * @returns A formatted currency string.
 */
const formatCurrency = (value: number | string): string => {
  const number = Number(value);
  if (isNaN(number)) return "0";
  return new Intl.NumberFormat('en-IN').format(Math.round(number));
};


// --- SVG Donut Chart Component ---
const DonutChart: React.FC<{ principal: number; interest: number; emi: string }> = ({ principal, interest, emi }) => {
  const total = principal + interest;
  if (total === 0) return null;

  const principalPercentage = (principal / total) * 100;
  const strokeDasharray = `${principalPercentage} ${100 - principalPercentage}`;
  
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 40 40" className="-rotate-90 transform">
        <circle
          cx="20" cy="20" r="15.915"
          fill="transparent"
          stroke="#e2e8f0" // Light gray background circle
          strokeWidth="4"
        />
        <circle
          cx="20" cy="20" r="15.915"
          fill="transparent"
          stroke="#3b82f6" // Blue for principal
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeDashoffset="0"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xs text-gray-500">Monthly EMI</p>
        <p className="text-xl font-bold text-gray-800">
          ₹{formatCurrency(emi)}
        </p>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
const HomeLoanCalculatorPage: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [principal, setPrincipal] = useState<string>('3000000');
  const [interestRate, setInterestRate] = useState<string>('7.5');
  const [tenure, setTenure] = useState<string>('30');
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isAssistantVisible, setAssistantVisible] = useState<boolean>(true);

  // --- API CALL HANDLER using AXIOS ---
  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setResults(null);
    setLoading(true);

    try {
      const response = await axios.post<CalculationResults>('/api/tools/loanCalculator', {
        principal: parseFloat(principal),
        interestRate: parseFloat(interestRate),
        tenure: parseFloat(tenure),
      });
      setResults(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
         setError(err.response.data.error || 'An unexpected server error occurred.');
      } else {
         setError('Failed to calculate. Please check your connection.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA & MEMOIZED VALUES ---
  const bankLogos: BankLogo[] = [
    { name: 'SBI', url: 'https://image2url.com/images/1758344914648-2973a6ee-4212-4677-8598-5ab3c1842eb4.png' },
    { name: 'HDFC Bank', url: 'https://image2url.com/images/1758344932535-fbdc51d4-69d7-4d3a-93a6-c1ad8d228991.webp' },
    { name: 'ICICI Bank', url: 'https://image2url.com/images/1758344947931-45e4aa5b-fe90-4a25-917d-98960ce232ac.png' },
    { name: 'Axis Bank', url: 'https://image2url.com/images/1758344980271-35b12e28-21b1-4df9-81a4-d7a9d1621381.png' },
    { name: 'Kotak Bank', url: 'https://image2url.com/images/1758344990101-df619fc5-ff10-4fb5-b7a5-6cc7b159f424.png' },
    { name: 'Bank of Baroda', url: 'https://placehold.co/150x60/f0f0f0/333?text=Bank+of+Baroda' },
    { name: 'Punjab National Bank', url: 'https://placehold.co/150x60/f0f0f0/333?text=PNB' }
  ];

  const scrollerContent = useMemo(() => [...bankLogos, ...bankLogos], [bankLogos]);

  return (
    <>
      <style jsx global>{`
        @keyframes scroll { to { transform: translateX(-50%); } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(24, 97, 212, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(24, 97, 212, 0); }
        }
        /* Custom styles for slider track and thumb */
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #2563eb; border-radius: 50%; cursor: pointer; margin-top: -6px; transition: transform 0.1s ease-in-out; }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.1); }
        input[type="range"]::-moz-range-thumb { width: 20px; height: 20px; background: #2563eb; border-radius: 50%; cursor: pointer; }
        /* Hide number input arrows */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <main className="flex min-h-screen w-full flex-col items-center bg-slate-50 p-4 pt-10 font-sans sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl">Home Loan EMI Calculator</h1>
            <p className="mt-3 text-lg text-gray-500">Plan your finances with precision and ease.</p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Left Side: Calculator Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <h2 className="text-2xl font-semibold text-gray-900">Loan Details</h2>
                <form onSubmit={handleCalculate} className="mt-6 space-y-6">
                  {/* Principal Amount */}
                  <div>
                    <label htmlFor="principal" className="text-sm font-medium text-gray-600">Loan Amount</label>
                    <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <span className="pl-3 text-gray-500">₹</span>
                      <input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} min="100000" max="20000000" className="w-full border-0 bg-transparent p-2 text-gray-800 placeholder-gray-400 focus:ring-0" />
                    </div>
                    <input type="range" min="100000" max="20000000" step="10000" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200" />
                  </div>

                  {/* Interest Rate */}
                  <div>
                     <label htmlFor="interestRate" className="text-sm font-medium text-gray-600">Interest Rate</label>
                    <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                       <input id="interestRate" type="number" step="0.05" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} min="5" max="15" className="w-full border-0 bg-transparent p-2 text-gray-800 placeholder-gray-400 focus:ring-0" />
                       <span className="pr-3 text-gray-500">%</span>
                    </div>
                    <input type="range" min="5" max="15" step="0.05" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200" />
                  </div>

                  {/* Loan Tenure */}
                  <div>
                    <label htmlFor="tenure" className="text-sm font-medium text-gray-600">Loan Tenure</label>
                    <div className="mt-1 flex items-center rounded-md border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <input id="tenure" type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} min="1" max="40" className="w-full border-0 bg-transparent p-2 text-gray-800 placeholder-gray-400 focus:ring-0" />
                      <span className="pr-3 text-gray-500">Yrs</span>
                    </div>
                    <input id="tenure-range" type="range" min="1" max="40" step="1" value={tenure} onChange={(e) => setTenure(e.target.value)} className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200" />
                  </div>
                  
                  <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300">
                    {loading ? 'Calculating...' : 'Calculate EMI'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side: Results */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg h-full">
                <h2 className="text-2xl font-semibold text-gray-900">Your Loan Analysis</h2>
                {error && <div className="mt-4 rounded-lg bg-red-100 p-4 text-center text-red-700">{error}</div>}
                
                {results ? (
                  <div className="mt-6 flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex-shrink-0">
                      <DonutChart principal={parseFloat(principal)} interest={parseFloat(results.totalInterest)} emi={results.emi}/>
                    </div>
                    <div className="w-full space-y-4">
                      <div className="flex justify-between rounded-lg bg-slate-100 p-4">
                        <span className="text-gray-600">Monthly EMI</span>
                        <span className="font-bold text-gray-800">₹{formatCurrency(results.emi)}</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-slate-100 p-4">
                        <span className="text-gray-600">Principal Amount</span>
                        <span className="font-bold text-gray-800">₹{formatCurrency(principal)}</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-slate-100 p-4">
                        <span className="text-gray-600">Total Interest</span>
                        <span className="font-bold text-gray-800">₹{formatCurrency(results.totalInterest)}</span>
                      </div>
                       <div className="flex justify-between rounded-lg bg-blue-100 p-4 border border-blue-200">
                        <span className="text-blue-800 font-medium">Total Amount Payable</span>
                        <span className="font-bold text-blue-900 text-lg">₹{formatCurrency(results.totalPayable)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center text-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <p>Your calculated results will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Lenders Section */}
          <div className="mt-16">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Trusted by Leading Loan Providers</h2>
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
              <div className="flex w-fit [animation:scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
                {scrollerContent.map((bank, index) => (
                  <img key={index} src={bank.url} alt={bank.name} className="mx-8 h-10 w-auto object-contain transition-all duration-300 hover: md:h-12" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Widget */}
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-2xl transition-all duration-300 md:bottom-6 md:right-6 ${!isAssistantVisible && 'pointer-events-none translate-y-8 scale-95 opacity-0'}`}>
          <button onClick={() => setAssistantVisible(false)} className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300">&times;</button>
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-4 border-blue-500 [animation:pulse_2s_infinite]">
            <img src="https://image2url.com/images/1758346919534-c38978b3-2fc0-4063-ab8e-bffc7e910320.png" alt="AI Assistant Swetha" className="h-full w-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Hi! I'm Swetha.</h3>
            <p className="text-sm text-gray-500">Need help with your loan query?</p>
            <a href="#" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200">
              Chat Now
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

export default HomeLoanCalculatorPage;


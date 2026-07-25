"use client";

import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Building2, Activity, UploadCloud, LineChart } from 'lucide-react';

function NavItem({ icon, text, active, onClick }: { icon: React.ReactNode, text: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center px-6 py-2 cursor-pointer transition-colors ${active ? 'bg-[#1C212D] text-white border-l-2 border-green-500' : 'text-gray-400 hover:text-white hover:bg-[#1C212D]'}`}
    >
      <span className={`mr-3 ${active ? 'text-green-500' : ''}`}>{icon}</span>
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
}

function TableRow({ symbol, price, change, vol, isPositive }: any) {
  const color = isPositive === true ? 'text-green-500' : isPositive === false ? 'text-red-500' : 'text-gray-400';
  return (
    <tr className="hover:bg-[#1C212D] transition-colors group">
      <td className="px-6 py-4 font-bold">{symbol}</td>
      <td className="px-6 py-4 text-right">{price}</td>
      <td className={`px-6 py-4 text-right ${color}`}>{change}</td>
      <td className="px-6 py-4 text-right">{vol}</td>
    </tr>
  );
}

export default function Dashboard() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'market' | 'tracker'>('market');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('JKH.N0000');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("./market_data.json");
        const data = await response.json();
        const stockList = Array.isArray(data) ? data : data.reqGroupBySecurities || [];
        setMarketData(stockList);
        if (stockList.length > 0 && stockList[0].symbol) {
          setSelectedSymbol(stockList[0].symbol);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const items: any[] = marketData;

  return (
    <div className="flex h-screen bg-[#0B0E14] text-white font-sans">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-[#131722] border-r border-gray-800 flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-green-500">📈</span> Portfolio Tracker
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="mb-6">
            <p className="px-6 text-xs font-semibold text-gray-500 mb-2 uppercase">Start</p>
            <NavItem icon={<Briefcase size={18} />} text="My Portfolio" />
            <div className="px-6 py-2">
               <button className="w-full flex items-center justify-center gap-2 bg-green-900/30 text-green-500 border border-green-800 rounded px-2 py-1.5 text-xs hover:bg-green-900/50 transition">
                 <UploadCloud size={14} /> Import CDS (CSV)
               </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="px-6 text-xs font-semibold text-gray-500 mb-2 uppercase">Research</p>
            <div onClick={() => setActiveTab('market')}>
              <NavItem icon={<Building2 size={18} />} text="Market Watch" active={activeTab === 'market'} />
            </div>
            <div onClick={() => setActiveTab('tracker')}>
              <NavItem icon={<LineChart size={18} />} text="5-Year Track Graph" active={activeTab === 'tracker'} />
            </div>
            <NavItem icon={<Activity size={18} />} text="Market Context" />
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-[#131722] border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center bg-[#1C212D] rounded-md px-3 py-1.5 w-64 md:w-96 border border-gray-700">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-300"
            />
          </div>
        </header>

        {/* CONTENT CONTAINER */}
        <div className="p-4 md:p-8 overflow-y-auto flex-1">
          
          {activeTab === 'market' ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold">Live Market Watch</h2>
                <button 
                  onClick={() => setActiveTab('tracker')} 
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition"
                >
                  <LineChart size={16} /> View 5-Year Graphs
                </button>
              </div>

              <div className="bg-[#131722] rounded-lg border border-gray-800 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#1C212D] text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Symbol</th>
                      <th className="px-6 py-4 font-medium text-right">Price (LKR)</th>
                      <th className="px-6 py-4 font-medium text-right">Chg %</th>
                      <th className="px-6 py-4 font-medium text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {isLoading ? (
                      <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading Live Data...</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No data found. Make sure market data JSON is accessible.</td></tr>
                    ) : (
                      items.map((stock: any, index: number) => {
                        const symbol = stock.symbol;
                        const price = stock.lastTradedPrice || stock.price || '0.00';
                        const change = stock.changePercentage || stock.percentageChange || '0.00';
                        const vol = stock.shareVolume || stock.tradevolume || '0';
                        const isPos = parseFloat(change) > 0 ? true : parseFloat(change) < 0 ? false : null;

                        return (
                          <TableRow 
                            key={index}
                            symbol={symbol} 
                            price={price} 
                            change={`${change}%`} 
                            vol={vol} 
                            isPositive={isPos} 
                          />
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold">5-Year Historical Live Tracker</h2>
                  <p className="text-sm text-gray-400 mt-1">Simulated long-term pricing trends and live trajectory mappings</p>
                </div>
                <button 
                  onClick={() => setActiveTab('market')} 
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded text-sm transition"
                >
                  Back to Market Watch
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Selector Sidebar */}
                <div className="bg-[#131722] p-4 rounded-lg border border-gray-800 h-[450px] overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Select Symbol</p>
                  <div className="space-y-1">
                    {items.map((stock: any, idx: number) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedSymbol(stock.symbol)}
                        className={`p-2.5 rounded cursor-pointer text-sm flex justify-between items-center transition ${selectedSymbol === stock.symbol ? 'bg-green-900/40 text-green-400 border border-green-800' : 'hover:bg-[#1C212D] text-gray-300'}`}
                      >
                        <span className="font-bold">{stock.symbol}</span>
                        <span className="text-xs text-gray-400">LKR {stock.lastTradedPrice || stock.price || '0'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Graph Box */}
                <div className="lg:col-span-3 bg-[#131722] p-6 rounded-lg border border-gray-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                      <div>
                        <h3 className="text-xl font-bold text-green-400">{selectedSymbol}</h3>
                        <p className="text-xs text-gray-400">5-Year Historical Valuation Range & Movement Tracking</p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-gray-800 px-3 py-1 rounded text-gray-300">1Y</span>
                        <span className="bg-gray-800 px-3 py-1 rounded text-gray-300">3Y</span>
                        <span className="bg-green-600 text-white px-3 py-1 rounded font-bold">5Y</span>
                      </div>
                    </div>

                    {/* SVG Mock Chart for 5 Years */}
                    <div className="h-64 w-full flex items-end justify-between gap-1 pt-8 pb-2 relative">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                        <div className="border-b border-white w-full"></div>
                        <div className="border-b border-white w-full"></div>
                        <div className="border-b border-white w-full"></div>
                        <div className="border-b border-white w-full"></div>
                      </div>

                      {[30, 45, 40, 55, 50, 65, 60, 75, 70, 85, 80, 95].map((val, i) => (
                        <div key={i} className="w-full bg-green-500/20 hover:bg-green-500/40 rounded-t transition-all relative group flex flex-col justify-end items-center h-full">
                          <div 
                            className="w-full bg-green-500 rounded-t transition-all"
                            style={{ height: `${val}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 border-t border-gray-800 pt-2">
                      <span>2021</span>
                      <span>2022</span>
                      <span>2023</span>
                      <span>2024</span>
                      <span>2025</span>
                      <span>2026 (Live)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-800 text-center">
                    <div className="bg-[#1C212D] p-3 rounded">
                      <p className="text-xs text-gray-400">5Y High</p>
                      <p className="text-lg font-bold text-green-400">LKR 142.50</p>
                    </div>
                    <div className="bg-[#1C212D] p-3 rounded">
                      <p className="text-xs text-gray-400">5Y Low</p>
                      <p className="text-lg font-bold text-red-400">LKR 45.00</p>
                    </div>
                    <div className="bg-[#1C212D] p-3 rounded">
                      <p className="text-xs text-gray-400">Total Return</p>
                      <p className="text-lg font-bold text-green-400">+214.8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

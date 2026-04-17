'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMockStore } from '@/store/useMockStore';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { ArrowLeft, Users, CheckCircle2, MapPin, Activity } from 'lucide-react';

export default function CivicPulseDashboard() {
  const params = useParams();
  const router = useRouter();
  const proposals = useMockStore((state) => state.proposals);
  const votes = useMockStore((state) => state.votes); 
  
  const id = params.id as string;
  const proposal = proposals.find(p => p.id === id);
  // It's an array now
  const proposalVotes = votes[id] || [];
  const hasVotes = proposalVotes.length > 0;

  if (!proposal) return null;

  // Placeholder Data for Recharts Initialization Shell
  const pieData = [
    { name: 'Strongly Agree', value: hasVotes ? 40 : 0 },
    { name: 'Agree', value: hasVotes ? 30 : 0 },
    { name: 'Neutral', value: hasVotes ? 10 : 0 },
    { name: 'Disagree', value: hasVotes ? 15 : 0 },
    { name: 'Strongly Disagree', value: hasVotes ? 5 : 0 },
  ];
  const COLORS = ['#00FF66', '#a1fda1', '#888888', '#fa8686', '#FF0055'];

  const barData = [
    { ageGroup: '18-24', participation: hasVotes ? 120 : 0 },
    { ageGroup: '25-34', participation: hasVotes ? 350 : 0 },
    { ageGroup: '35-44', participation: hasVotes ? 200 : 0 },
    { ageGroup: '45-54', participation: hasVotes ? 90 : 0 },
    { ageGroup: '55+', participation: hasVotes ? 40 : 0 },
  ];

  const locationData = [
    { district: 'Centro', participation: hasVotes ? 500 : 0 },
    { district: 'Trindade', participation: hasVotes ? 450 : 0 },
    { district: 'Lagoa', participation: hasVotes ? 320 : 0 },
    { district: 'Campeche', participation: hasVotes ? 400 : 0 },
    { district: 'Continente', participation: hasVotes ? 170 : 0 },
  ];

  const radarData = proposal.customMetrics.map((metric, i) => {
    const val = hasVotes ? (i === 0 ? 85 : 45 + (i * 10)) : 0;
    return {
      subject: metric.label,
      A: val,
      fullMark: 100,
    };
  });

  // Calculate generic total based on mock or state
  const totalParticipants = hasVotes ? '1,840' : '0';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button 
        onClick={() => router.push(`/proposals/${proposal.id}`)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Proposal
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-2">Civic Pulse</h1>
          <p className="text-muted-foreground max-w-2xl text-sm lg:text-base">Real-time demographic consensus mapping for: <span className="text-foreground">{proposal.title}</span></p>
        </div>
        <div className="glass-panel px-6 py-3 rounded-xl flex items-center gap-4 border-ipe-green/30 border">
           <div className="flex flex-col items-end">
             <span className="text-xs uppercase tracking-widest text-muted-foreground">Total Participants</span>
             <span className="text-xl font-bold font-mono text-ipe-green">{totalParticipants}</span>
           </div>
           <Users className="w-8 h-8 text-ipe-green opacity-50" />
        </div>
      </div>

      {!hasVotes ? (
         <div className="glass-panel p-16 rounded-2xl text-center border-dashed border-2 border-border/50">
           <BarChart3Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
           <h3 className="text-2xl font-heading font-bold text-muted-foreground mb-2">Awaiting Participation Data</h3>
           <p className="text-muted-foreground max-w-md mx-auto">This dashboard will populate automatically as the community signs their votes on the blockchain.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Approval Ring */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-heading text-lg font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-ipe-green" /> Global Approval Rating
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-4 text-xs font-medium">
               {pieData.map((entry, index) => (
                 <div key={entry.name} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                   <span>{entry.name}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Age Stratification */}
          <div className="glass-panel p-6 rounded-2xl">
             <h3 className="font-heading text-lg font-bold mb-6 flex items-center gap-2">
               <Users className="w-5 h-5 text-blue-400" /> Age Stratification
             </h3>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <XAxis dataKey="ageGroup" tick={{ fill: '#888', fontSize: 12 }} stroke="#333" />
                   <YAxis tick={{ fill: '#888', fontSize: 12 }} stroke="#333" />
                   <Tooltip 
                     cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                     contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '8px' }}
                   />
                   <Bar dataKey="participation" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Location Distro */}
          <div className="glass-panel p-6 rounded-2xl">
             <h3 className="font-heading text-lg font-bold mb-6 flex items-center gap-2">
               <MapPin className="w-5 h-5 text-purple-400" /> District Distribution
             </h3>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={locationData} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                   <XAxis type="number" tick={{ fill: '#888', fontSize: 12 }} stroke="#333" />
                   <YAxis dataKey="district" type="category" tick={{ fill: '#888', fontSize: 12 }} stroke="#333" />
                   <Tooltip 
                     cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                     contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '8px' }}
                   />
                   <Bar dataKey="participation" fill="#A78BFA" radius={[0, 4, 4, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Nuance Radar */}
          <div className="glass-panel p-6 rounded-2xl">
             <h3 className="font-heading text-lg font-bold mb-6 flex items-center gap-2">
               <Activity className="w-5 h-5 text-ipe-yellow" /> Community Nuance Profile
             </h3>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                   <PolarGrid stroke="#333" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 11 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666' }} />
                   <Radar name="Consensus" dataKey="A" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.4} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#121212', border: '1px solid #333', borderRadius: '8px' }}
                   />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Detailed Facet Breakdown Array */}
          <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
             <h3 className="font-heading text-lg font-bold mb-6">Nuance Facets Breakdown Detail</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {proposal.customMetrics.map((metric, i) => {
                 // For scaffold demo, if it's the first metric, show high approval, else show mixed.
                 const val = i === 0 ? 85 : 45 + (i * 10);
                 return (
                   <div key={metric.id} className="bg-background/40 border border-border/50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{metric.label}</span>
                        <span className={`font-mono text-xs ${val > 60 ? 'text-ipe-green' : 'text-ipe-yellow'}`}>{val}% Consensus</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/50">
                        <div className={`h-full ${val > 60 ? 'bg-ipe-green' : 'bg-ipe-yellow'}`} style={{ width: `${val}%` }} />
                      </div>
                   </div>
                 );
               })}
             </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Subcomponent stub for the empty state icon
function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, AlertTriangle, Brain, Trophy, Download } from 'lucide-react';

export default function FacultyDashboard() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  if (students.length === 0) return <div className="p-8">Loading...</div>;

  const handleDownloadReport = () => {
    window.print();
  };

  const totalStudents = students.length;
  const academicSupportNeeded = students.filter(s => s.predictions.academicSupport === 'Needed').length;
  const counselingNeeded = students.filter(s => s.psychometric.status === 'Needs Counseling').length;
  const topPerformers = students.filter(s => s.academics.previousCGPA >= 8.0).length;

  const riskData = [
    { name: 'Low Risk', value: students.filter(s => s.predictions.riskLevel === 'Low Risk').length },
    { name: 'Academic Risk', value: students.filter(s => s.predictions.riskLevel === 'Academic Risk').length },
    { name: 'Psychological Risk', value: students.filter(s => s.predictions.riskLevel === 'Psychological Risk').length },
    { name: 'Both', value: students.filter(s => s.predictions.riskLevel === 'Academic & Psychological Risk').length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const performanceData = students.map(s => ({
    name: s.registerNumber,
    cgpa: s.academics.previousCGPA,
    attendance: s.academics.attendance
  }));

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Dashboard</h1>
          <p className="text-slate-500">Overview of student performance and well-being.</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors print:hidden"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Report
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Total Students</p>
              <p className="text-2xl font-semibold text-slate-900">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Academic Support</p>
              <p className="text-2xl font-semibold text-slate-900">{academicSupportNeeded}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Needs Counseling</p>
              <p className="text-2xl font-semibold text-slate-900">{counselingNeeded}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Trophy className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-500">Top Performers</p>
              <p className="text-2xl font-semibold text-slate-900">{topPerformers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Student Performance Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" domain={[0, 100]} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar yAxisId="left" dataKey="cgpa" name="CGPA" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="attendance" name="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Risk Distribution</h3>
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              {riskData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-600 truncate">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

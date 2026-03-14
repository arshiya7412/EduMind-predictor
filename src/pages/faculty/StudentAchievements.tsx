import { useEffect, useState } from 'react';
import { Search, Filter, FileText, X, Download } from 'lucide-react';

export default function StudentAchievements() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (achievement: any) => {
    if (achievement.fileData) {
      // If we have actual file data (base64)
      const link = document.createElement('a');
      link.href = achievement.fileData;
      link.download = achievement.fileName || 'certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for dummy data
      const dummyContent = `Certificate of Achievement\n\nAwarded for: ${achievement.name}\nType: ${achievement.type}\n\nThis is a generated document for dummy data.`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = achievement.certificate || 'certificate.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadFullReport = () => {
    if (!selectedStudent) return;
    
    let reportContent = `Achievement Report for ${selectedStudent.name} (${selectedStudent.registerNumber})\n`;
    reportContent += `====================================================================\n\n`;
    
    reportContent += `Technical Achievements:\n`;
    reportContent += `-----------------------\n`;
    if (selectedStudent.achievements?.technical?.length > 0) {
      selectedStudent.achievements.technical.forEach((ach: any, idx: number) => {
        reportContent += `${idx + 1}. ${ach.name} (${ach.type})\n`;
      });
    } else {
      reportContent += `None recorded.\n`;
    }
    
    reportContent += `\nNon-Technical Achievements:\n`;
    reportContent += `---------------------------\n`;
    if (selectedStudent.achievements?.nonTechnical?.length > 0) {
      selectedStudent.achievements.nonTechnical.forEach((ach: any, idx: number) => {
        reportContent += `${idx + 1}. ${ach.name} (${ach.type})\n`;
      });
    } else {
      reportContent += `None recorded.\n`;
    }
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedStudent.registerNumber}_achievement_report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Achievements</h1>
          <p className="text-slate-500">View and verify student technical and non-technical achievements.</p>
        </div>
        
        <div className="flex w-full sm:w-auto space-x-3">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Technical</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Non-Technical</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{student.name}</div>
                        <div className="text-sm text-slate-500">{student.registerNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.achievements?.technical?.length || 0} Events
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {student.achievements?.nonTechnical?.length || 0} Events
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedStudent(student)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">No students found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing achievements */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedStudent(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                        {selectedStudent.name}'s Achievements
                      </h3>
                      <p className="text-sm text-slate-500">{selectedStudent.registerNumber}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedStudent(null)}
                    className="bg-white rounded-md text-slate-400 hover:text-slate-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-6 space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-slate-900 mb-3 border-b border-slate-200 pb-2">Technical Achievements</h4>
                    {selectedStudent.achievements?.technical?.length > 0 ? (
                      <ul className="divide-y divide-slate-200">
                        {selectedStudent.achievements.technical.map((ach: any, idx: number) => (
                          <li key={idx} className="py-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-slate-900">{ach.name}</p>
                              <p className="text-sm text-slate-500">{ach.type}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-sm text-indigo-600">
                                <FileText className="w-4 h-4 mr-1" />
                                {ach.certificate || ach.fileName}
                              </div>
                              <button
                                onClick={() => handleDownload(ach)}
                                className="text-slate-500 hover:text-indigo-600 transition-colors"
                                title="Download Certificate"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 py-2">No technical achievements recorded.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-slate-900 mb-3 border-b border-slate-200 pb-2">Non-Technical Achievements</h4>
                    {selectedStudent.achievements?.nonTechnical?.length > 0 ? (
                      <ul className="divide-y divide-slate-200">
                        {selectedStudent.achievements.nonTechnical.map((ach: any, idx: number) => (
                          <li key={idx} className="py-3 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-slate-900">{ach.name}</p>
                              <p className="text-sm text-slate-500">{ach.type}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-sm text-indigo-600">
                                <FileText className="w-4 h-4 mr-1" />
                                {ach.certificate || ach.fileName}
                              </div>
                              <button
                                onClick={() => handleDownload(ach)}
                                className="text-slate-500 hover:text-indigo-600 transition-colors"
                                title="Download Certificate"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 py-2">No non-technical achievements recorded.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDownloadFullReport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

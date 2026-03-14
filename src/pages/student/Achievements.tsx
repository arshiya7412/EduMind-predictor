import React, { useEffect, useState } from 'react';
import { FileText, Upload, Plus, Award, Download } from 'lucide-react';

export default function Achievements() {
  const [student, setStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'technical' | 'nonTechnical'>('technical');
  const [isAdding, setIsAdding] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ name: '', type: '', certificate: '', fileData: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetch(`/api/students/${user.id}`)
        .then(res => res.json())
        .then(data => setStudent(data));
    }
  }, []);

  if (!student) return <div className="p-8">Loading...</div>;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAchievement({
          ...newAchievement,
          certificate: file.name,
          fileData: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStudent = { ...student };
    if (activeTab === 'technical') {
      updatedStudent.achievements.technical.push(newAchievement);
    } else {
      updatedStudent.achievements.nonTechnical.push(newAchievement);
    }
    setStudent(updatedStudent);
    setIsAdding(false);
    setNewAchievement({ name: '', type: '', certificate: '', fileData: '' });
  };

  const handleDownload = (achievement: any) => {
    if (achievement.fileData) {
      const a = document.createElement('a');
      a.href = achievement.fileData;
      a.download = achievement.certificate;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Dummy download for existing data
      const blob = new Blob(['Dummy certificate content for ' + achievement.certificate], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = achievement.certificate || 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const technicalTypes = ['Hackathon', 'Workshop', 'Competition'];
  const nonTechnicalTypes = ['Sports', 'Cultural', 'Leadership'];

  const currentAchievements = activeTab === 'technical' ? student.achievements.technical : student.achievements.nonTechnical;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
          <p className="text-slate-500">Record your technical and non-technical accomplishments.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Achievement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('technical')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'technical'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Technical
            </button>
            <button
              onClick={() => setActiveTab('nonTechnical')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'nonTechnical'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Non-Technical
            </button>
          </nav>
        </div>

        {isAdding && (
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Add {activeTab === 'technical' ? 'Technical' : 'Non-Technical'} Achievement</h3>
            <form onSubmit={handleAddAchievement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    required
                    value={newAchievement.name}
                    onChange={e => setNewAchievement({ ...newAchievement, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., CodeFest 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                  <select
                    required
                    value={newAchievement.type}
                    onChange={e => setNewAchievement({ ...newAchievement, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="" disabled>Select Type</option>
                    {(activeTab === 'technical' ? technicalTypes : nonTechnicalTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Certificate</label>
                  <div className="mt-1 flex justify-center px-6 pt-2 pb-2 border-2 border-slate-300 border-dashed rounded-md hover:border-indigo-500 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-6 w-6 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileUpload} />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">{newAchievement.certificate || 'PDF, PNG, JPG up to 10MB'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-6">
          {currentAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAchievements.map((achievement: any, index: number) => (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">{achievement.name}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-2">
                        {achievement.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-sm text-slate-500 truncate mr-2">
                      <FileText className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{achievement.certificate}</span>
                    </div>
                    <button 
                      onClick={() => handleDownload(achievement)}
                      className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-medium text-slate-900">No achievements</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by adding a new achievement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

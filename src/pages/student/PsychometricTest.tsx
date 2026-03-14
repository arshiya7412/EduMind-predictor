import React, { useState, useRef, useEffect } from 'react';
import { Brain, CheckCircle2, AlertCircle, Camera, Play } from 'lucide-react';

const questions = [
  "I feel stressed about my academic workload.",
  "I feel motivated to attend my classes regularly.",
  "I feel comfortable asking teachers for help when I don't understand something.",
  "I find it difficult to concentrate on my studies.",
  "I feel overwhelmed by the expectations placed on me.",
  "I have a good balance between my studies and personal life.",
  "I feel anxious before exams or presentations.",
  "I feel supported by my peers and friends.",
  "I often feel exhausted or burnt out.",
  "I feel confident about my future career prospects."
];

const options = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 }
];

export default function PsychometricTest() {
  const [testStarted, setTestStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));
  const [questionEmotions, setQuestionEmotions] = useState<string[]>(Array(10).fill(''));
  const [isAnalyzingQuestion, setIsAnalyzingQuestion] = useState<boolean[]>(Array(10).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!result) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [result]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureAndAnalyzeFaceForQuestion = async (questionIndex: number) => {
    if (videoRef.current && canvasRef.current) {
      setIsAnalyzingQuestion(prev => {
        const next = [...prev];
        next[questionIndex] = true;
        return next;
      });

      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        
        try {
          const res = await fetch('/api/ai/facial-recognition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageData }),
          });
          const data = await res.json();
          
          setQuestionEmotions(prev => {
            const next = [...prev];
            next[questionIndex] = data.expression;
            return next;
          });
        } catch (error) {
          console.error("Failed to analyze face", error);
        } finally {
          setIsAnalyzingQuestion(prev => {
            const next = [...prev];
            next[questionIndex] = false;
            return next;
          });
        }
      }
    }
  };

  const handleOptionChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    
    // Trigger facial analysis for this question
    captureAndAnalyzeFaceForQuestion(questionIndex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.includes(0)) {
      alert("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ai/psychometric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, emotions: questionEmotions }),
      });
      const data = await res.json();
      setResult(data);
      stopCamera();
    } catch (error) {
      console.error("Failed to submit test", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Test Results</h1>
          <p className="mt-2 text-slate-500">Your psychometric analysis is complete.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className={`p-6 border-b ${
            result.status === 'Psychologically Stable' ? 'bg-green-50 border-green-100' :
            result.status === 'Mild Stress' ? 'bg-yellow-50 border-yellow-100' :
            'bg-red-50 border-red-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Overall Status</p>
                <h2 className={`text-2xl font-bold ${
                  result.status === 'Psychologically Stable' ? 'text-green-700' :
                  result.status === 'Mild Stress' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>{result.status}</h2>
              </div>
              {result.status === 'Psychologically Stable' ? (
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              ) : (
                <AlertCircle className={`w-12 h-12 ${result.status === 'Mild Stress' ? 'text-yellow-500' : 'text-red-500'}`} />
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Stress Level</p>
              <div className="flex items-end mb-2">
                <span className="text-3xl font-bold text-slate-900">{result.stressLevel}</span>
                <span className="text-slate-500 ml-1 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${
                  result.stressLevel < 40 ? 'bg-green-500' :
                  result.stressLevel < 70 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} style={{ width: `${result.stressLevel}%` }}></div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Motivation Score</p>
              <div className="flex items-end mb-2">
                <span className="text-3xl font-bold text-slate-900">{result.motivationScore}</span>
                <span className="text-slate-500 ml-1 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${
                  result.motivationScore > 70 ? 'bg-green-500' :
                  result.motivationScore > 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} style={{ width: `${result.motivationScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-2">AI Recommendation</h3>
            <p className="text-slate-600">
              {result.status === 'Needs Counseling' 
                ? "Your results indicate high levels of stress and low motivation. We strongly recommend scheduling a session with the campus counselor to discuss your well-being."
                : result.status === 'Mild Stress'
                ? "You are experiencing some stress. Consider taking breaks, managing your time effectively, and reaching out to peers or mentors if you feel overwhelmed."
                : "You are currently in a good psychological state. Keep up your healthy habits and maintain a good work-life balance."}
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setResult(null);
              setAnswers(Array(10).fill(0));
              setQuestionEmotions(Array(10).fill(''));
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Camera Feed */}
      {!result && (
        <div className={testStarted 
          ? "fixed bottom-4 right-4 w-48 h-36 bg-slate-900 rounded-lg overflow-hidden shadow-lg border-2 border-slate-200 z-50" 
          : "relative w-80 h-60 mx-auto bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 mb-6"
        }>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} width="320" height="240" className="hidden" />
          {testStarted && (
            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Camera Active
            </div>
          )}
        </div>
      )}

      {!testStarted && (
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Psychometric Evaluation</h1>
          <p className="mt-2 text-slate-500 max-w-2xl mx-auto">
            This test uses facial recognition to analyze your expressions as you answer each question. Please ensure your camera is enabled and your face is clearly visible.
          </p>
          <button
            onClick={() => setTestStarted(true)}
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            Start Questionnaire
          </button>
        </div>
      )}

      {testStarted && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="divide-y divide-slate-200">
              {questions.map((question, index) => (
                <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-lg font-medium text-slate-900">
                      <span className="text-indigo-600 mr-2">{index + 1}.</span>
                      {question}
                    </p>
                    {isAnalyzingQuestion[index] ? (
                      <span className="text-xs text-indigo-500 animate-pulse bg-indigo-50 px-2 py-1 rounded">Analyzing expression...</span>
                    ) : questionEmotions[index] ? (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        Detected: {questionEmotions[index]}
                      </span>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {options.map((option) => (
                      <label
                        key={option.value}
                        className={`relative flex flex-col items-center p-3 cursor-pointer rounded-lg border-2 transition-all ${
                          answers[index] === option.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option.value}
                          checked={answers[index] === option.value}
                          onChange={() => handleOptionChange(index, option.value)}
                          className="sr-only"
                        />
                        <span className={`text-sm font-medium text-center ${
                          answers[index] === option.value ? 'text-indigo-700' : 'text-slate-600'
                        }`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {answers.filter(a => a !== 0).length} of 10 questions answered
              </p>
              <button
                type="submit"
                disabled={isSubmitting || answers.includes(0)}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                  isSubmitting || answers.includes(0)
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? 'Analyzing...' : 'Submit Answers'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

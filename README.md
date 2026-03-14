# EduMind Predictor

A full-stack AI-powered Student Performance and Mental Well-being Predictor Web Application. 

EduMind Predictor bridges the gap between academic tracking and mental health awareness by providing a comprehensive platform for both students and faculty. It leverages the power of the Google Gemini AI API to analyze student data and provide actionable insights.

## 🌟 Features

* *Role-Based Access Control:* Dedicated portals for Students and Faculty members.
* *Student Portal:*
  * *Dashboard:* Overview of academic standing and well-being.
  * *Academics:* Track grades, attendance, and coursework.
  * *Skills & Achievements:* Record extracurricular activities and technical skills.
  * *Psychometric Tests:* AI-driven assessments to gauge mental well-being and stress levels.
* *Faculty Portal:*
  * *Dashboard:* Aggregate view of student performance metrics.
  * *Student Monitoring:* Deep dive into individual student academics, skills, achievements, and psychometric results to identify students who may need support.
* *AI-Powered Insights:* Utilizes Google Gemini to generate personalized feedback and early warning predictions.
* *Interactive Visualizations:* Beautiful, responsive charts built with Recharts.

## 🛠️ Tech Stack

* *Frontend Framework:* React 19
* *Build Tool:* Vite
* *Styling:* Tailwind CSS 4
* *Routing:* React Router v7
* *Animations:* Framer Motion
* *Charts:* Recharts
* *AI Integration:* Google Gemini API (@google/genai)

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Installation

1. Clone the repository:
   bash
   git clone https://github.com/your-username/edumind-predictor.git
   cd edumind-predictor
   

2. Install dependencies:
   bash
   npm install
   

3. Set up environment variables:
   Create a .env file in the root directory and add your Gemini API key:
   env
   GEMINI_API_KEY=your_gemini_api_key_here
   

4. Start the development server:
   bash
   npm run dev
   

5. Open your browser and navigate to http://localhost:3000.

## 📂 Project Structure

text
/
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Layout wrappers (StudentLayout, FacultyLayout)
│   ├── pages/           # Route components
│   │   ├── faculty/     # Faculty portal pages
│   │   └── student/     # Student portal pages
│   ├── App.tsx          # Main application routing
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration


## 📄 License

This project is licensed under the MIT License.

View your app in AI Studio: https://ai.studio/apps/24eb520d-4246-4d3f-b059-a5170de33a9d


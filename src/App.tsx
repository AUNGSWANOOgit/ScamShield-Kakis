import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useApp } from './context/AppContext';
import { AppLayout } from './components/Layout';
import { WelcomePage } from './pages/WelcomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { LessonPage } from './pages/LessonPage';
import { IdentifyPage } from './pages/IdentifyPage';
import { ReportPage } from './pages/ReportPage';
import { CommunityPage } from './pages/CommunityPage';
import { RewardsPage } from './pages/RewardsPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ToastLayer } from './components/Celebration';

function RequireProfile({ children }: { children: ReactNode }) {
  const { state } = useApp();
  return state.profile ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  const { state } = useApp();
  return (
    <Routes>
      <Route
        path="/"
        element={
          state.profile ? (
            <Navigate to="/home" replace />
          ) : (
            <>
              <WelcomePage />
              <ToastLayer />
            </>
          )
        }
      />
      <Route path="/onboarding" element={state.profile ? <Navigate to="/home" replace /> : <OnboardingPage />} />
      <Route path="/about-project" element={<AboutPage standalone />} />
      <Route
        element={
          <RequireProfile>
            <AppLayout />
          </RequireProfile>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:lessonId" element={<LessonPage />} />
        <Route path="/identify" element={<IdentifyPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

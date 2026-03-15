import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import MfaGuard from "@/components/MfaGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MfaEnroll from "./pages/MfaEnroll";
import MfaVerify from "./pages/MfaVerify";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CarUpload from "./pages/CarUpload";
import FairValueResult from "./pages/FairValueResult";
import BuyerMatches from "./pages/BuyerMatches";
import NextCarRecommendations from "./pages/NextCarRecommendations";
import CarDetail from "./pages/CarDetail";
import IntentSelection from "./pages/IntentSelection";
import BuyerQuestionnaire from "./pages/BuyerQuestionnaire";
import CarSelection from "./pages/CarSelection";
import CarComparison from "./pages/CarComparison";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";
import Impressum from "./pages/Impressum";
import NotFound from "./pages/NotFound";
import InvestorPitch from "./pages/InvestorPitch";
import Negotiation from "./pages/Negotiation";
import AcquisitionOptions from "./pages/AcquisitionOptions";
import BrandBook from "./pages/BrandBook";
import AdminDashboard from "./pages/AdminDashboard";
import Documentation from "./pages/Documentation";
import ResetPassword from "./pages/ResetPassword";
import DocViewer from "./pages/DocViewer";
import QA from "./pages/QA";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/mfa-enroll" element={<MfaEnroll />} />
              <Route path="/mfa-verify" element={<MfaVerify />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/pitch" element={<InvestorPitch />} />
              <Route path="/brand" element={<BrandBook />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/docs/view/:slug" element={<DocViewer />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/qa" element={<QA />} />

              {/* MFA-protected routes */}
              <Route path="/dashboard" element={<MfaGuard><Dashboard /></MfaGuard>} />
              <Route path="/onboarding" element={<MfaGuard><Onboarding /></MfaGuard>} />
              <Route path="/car-upload" element={<MfaGuard><CarUpload /></MfaGuard>} />
              <Route path="/fair-value/:id" element={<MfaGuard><FairValueResult /></MfaGuard>} />
              <Route path="/buyer-matches/:carId" element={<MfaGuard><BuyerMatches /></MfaGuard>} />
              <Route path="/recommendations" element={<MfaGuard><NextCarRecommendations /></MfaGuard>} />
              <Route path="/car/:id" element={<MfaGuard><CarDetail /></MfaGuard>} />
              <Route path="/intent" element={<MfaGuard><IntentSelection /></MfaGuard>} />
              <Route path="/buyer-questionnaire" element={<MfaGuard><BuyerQuestionnaire /></MfaGuard>} />
              <Route path="/car-selection" element={<MfaGuard><CarSelection /></MfaGuard>} />
              <Route path="/compare" element={<MfaGuard><CarComparison /></MfaGuard>} />
              <Route path="/negotiate/:offerId" element={<MfaGuard><Negotiation /></MfaGuard>} />
              <Route path="/acquire/:offerId" element={<MfaGuard><AcquisitionOptions /></MfaGuard>} />
              <Route path="/admin" element={<MfaGuard><AdminDashboard /></MfaGuard>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

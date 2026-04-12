import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmailOtpVerify from "./pages/EmailOtpVerify";
import CheckEmail from "./pages/CheckEmail";
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
import FinancingCalculator from "./pages/FinancingCalculator";
import KycVerification from "./pages/KycVerification";
import Unsubscribe from "./pages/Unsubscribe";
import FooterSection from "./components/home/FooterSection";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1 pt-16">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/verify-otp" element={<EmailOtpVerify />} />
                  <Route path="/check-email" element={<CheckEmail />} />
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
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/unsubscribe" element={<Unsubscribe />} />

                  {/* Auth-protected routes handle session checks inside each page */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/car-upload" element={<CarUpload />} />
                  <Route path="/fair-value/:id" element={<FairValueResult />} />
                  <Route path="/buyer-matches/:carId" element={<BuyerMatches />} />
                  <Route path="/recommendations" element={<NextCarRecommendations />} />
                  <Route path="/car/:id" element={<CarDetail />} />
                  <Route path="/intent" element={<IntentSelection />} />
                  <Route path="/buyer-questionnaire" element={<BuyerQuestionnaire />} />
                  <Route path="/cars" element={<CarSelection />} />
                  <Route path="/car-selection" element={<CarSelection />} />
                  <Route path="/compare" element={<CarComparison />} />
                  <Route path="/negotiate/:offerId" element={<Negotiation />} />
                  <Route path="/acquire/:offerId" element={<AcquisitionOptions />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/financing/:offerId?" element={<FinancingCalculator />} />
                  <Route path="/kyc" element={<KycVerification />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <FooterSection />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

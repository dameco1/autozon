import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-display font-black text-white mb-2">Terms & Conditions</h1>
        <p className="text-silver/50 text-sm mb-8">Last updated: February 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-silver/80">
          <section>
            <h2 className="text-xl font-display font-bold text-white">1. Scope of Application</h2>
            <p>These Terms and Conditions ("Terms") govern the use of the Autozon website and platform (the "Service") operated by BowTie Sales Corp Limited ("we", "us", or "our"), registered in the Republic of Cyprus. By accessing or using our Service, you agree to be bound by these Terms and our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">2. Description of Services</h2>
            <p>Autozon is a car valuation and marketplace platform that provides:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>AI-powered fair-value car appraisals based on market data, condition, and demand</li>
              <li>Automated damage detection through image analysis</li>
              <li>Buyer-seller matching based on preferences and vehicle characteristics</li>
              <li>Personalized car recommendations for buyers</li>
              <li>Transaction facilitation including inspection, logistics, and payment coordination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">3. User Accounts</h2>
            <p>3.1. To access certain features, you must create an account with accurate and complete information.</p>
            <p>3.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            <p>3.3. You must notify us immediately of any unauthorized use of your account.</p>
            <p>3.4. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">4. Vehicle Data & Listings</h2>
            <div className="bg-charcoal/50 border border-border rounded-xl p-4 my-3">
              <p className="text-white font-semibold mb-2">Important: Your Responsibilities as a Seller</p>
            </div>
            <p>4.1. When listing a vehicle on Autozon, you represent and warrant that:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You are the legal owner or authorized representative of the vehicle</li>
              <li>All information provided about the vehicle is accurate and complete to the best of your knowledge</li>
              <li>All uploaded photographs are genuine and unaltered representations of the vehicle</li>
              <li>The vehicle is free of undisclosed liens, encumbrances, or legal restrictions on sale</li>
              <li>You have disclosed all known accidents, damage, and mechanical issues</li>
            </ul>
            <p>4.2. <strong>Vehicle Identification Numbers (VIN):</strong> When you provide a VIN, we may use it to verify vehicle history, specifications, and ownership records through authorized databases.</p>
            <p>4.3. <strong>Vehicle Photos:</strong> Photos you upload are processed by our AI system for damage detection. By uploading photos, you grant Autozon a non-exclusive license to use these images for valuation, matching, and display to potential buyers.</p>
            <p>4.4. <strong>Data Accuracy:</strong> Providing false or misleading vehicle information may result in account termination and potential legal liability.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">5. Valuations & Fair-Value Pricing</h2>
            <p>5.1. All car valuations ("Fair-Value Scores") are algorithmic estimates based on available market data, condition assessments, equipment analysis, and AI damage detection.</p>
            <p>5.2. Valuations are for <strong>informational purposes only</strong> and do not constitute a binding offer, guarantee of sale price, or professional appraisal.</p>
            <p>5.3. Actual transaction prices may differ from our estimates due to factors outside our model, including local market conditions, buyer-seller negotiations, and vehicle inspection outcomes.</p>
            <p>5.4. We do not guarantee the accuracy, completeness, or reliability of valuations and shall not be liable for any decisions made based on them.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">6. AI-Powered Features</h2>
            <p>6.1. Our Service uses artificial intelligence for damage detection, condition scoring, and buyer matching. These features are assistive tools — not replacements for professional vehicle inspections.</p>
            <p>6.2. AI damage detection results are probabilistic assessments. Users can review and confirm or dismiss each finding.</p>
            <p>6.3. No fully automated decisions with legal or similarly significant effects are made without human review.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">7. Buyer Matching & Recommendations</h2>
            <p>7.1. Our matching algorithm connects buyers and sellers based on stated preferences, vehicle characteristics, and availability.</p>
            <p>7.2. We do not guarantee that matches will result in transactions.</p>
            <p>7.3. Buyer preference data is used solely for matching purposes and is handled in accordance with our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">8. Transactions & Payments</h2>
            <p>8.1. Autozon facilitates transactions between buyers and sellers but is not a party to the sale contract unless explicitly stated.</p>
            <p>8.2. All payments are processed through secure third-party payment providers.</p>
            <p>8.3. Service fees, if applicable, will be clearly communicated before any transaction commitment.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">9. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, algorithms, AI models, and software, is the property of BowTie Sales Corp Limited or its licensors and is protected by copyright and other intellectual property laws. Unauthorized use, reproduction, or distribution is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">10. Limitation of Liability</h2>
            <p>10.1. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
            <p>10.2. We are not liable for losses arising from inaccurate vehicle information provided by users, AI analysis errors, or failed transactions between buyers and sellers.</p>
            <p>10.3. Our total liability to you shall not exceed the fees you have paid to us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">11. Data Protection & Privacy</h2>
            <p>Your use of the Service is also governed by our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>, which describe how we collect, use, and protect your personal and vehicle data in compliance with the GDPR.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">12. Third-Party Links & Services</h2>
            <p>Our website may contain links to third-party websites, financing partners, or insurance providers. We are not responsible for the content, privacy policies, or practices of any third-party services.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">13. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide false or misleading vehicle or personal information</li>
              <li>Use the Service for fraudulent purposes or money laundering</li>
              <li>Scrape, crawl, or extract data from the Service without authorization</li>
              <li>Attempt to reverse-engineer our valuation algorithms or AI models</li>
              <li>Harass, abuse, or threaten other users</li>
              <li>Upload content that infringes on third-party intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">14. Governing Law & Dispute Resolution</h2>
            <p>14.1. These Terms are governed by the laws of the Republic of Cyprus.</p>
            <p>14.2. Any disputes shall be subject to the exclusive jurisdiction of the courts of Cyprus.</p>
            <p>14.3. For EU consumers: The European Commission provides an Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">15. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Material changes will be communicated via email or prominent website notice at least 14 days before taking effect. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">16. Contact</h2>
            <p>For questions regarding these Terms, contact us at <a href="mailto:info@autozon.app" className="text-primary hover:underline">info@autozon.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

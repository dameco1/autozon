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

        <h1 className="text-4xl font-display font-black text-white mb-8">Terms & Conditions</h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-silver/80">
          <section>
            <h2 className="text-xl font-display font-bold text-white">1. Scope of Application</h2>
            <p>These Terms and Conditions govern the use of the Autozon website and any services provided by BowTie Sales Corp Limited ("we", "us", or "our"). By accessing our website or using our services, you agree to be bound by these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">2. Services</h2>
            <p>Autozon provides a car valuation and marketplace platform, connecting car sellers with verified buyers through AI-powered fair-value pricing. The specific terms of any transaction will be outlined in a separate service agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">3. User Accounts</h2>
            <p>To access certain features of Autozon, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">4. Car Listings & Valuations</h2>
            <p>All car valuations provided by Autozon are estimates based on available market data, condition assessments, and AI analysis. These valuations are for informational purposes and do not constitute a binding offer or guarantee of sale price.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">5. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and software, is the property of BowTie Sales Corp Limited or its licensors and is protected by copyright and other intellectual property laws. Unauthorized use is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">6. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our website or services.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">7. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party websites.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">8. Governing Law</h2>
            <p>These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Cyprus. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Cyprus.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">9. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">10. Contact</h2>
            <p>For questions regarding these Terms and Conditions, please contact us at <a href="mailto:info@autozon.app" className="text-primary hover:underline">info@autozon.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

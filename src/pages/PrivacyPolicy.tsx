import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <SEO 
        title="Privacy Policy"
        description="Learn how Autozon collects, uses, and protects your personal data. Comprehensive GDPR-compliant privacy policy for our car trading platform."
        path="/privacy-policy"
      />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-display font-black text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: February 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Controller</h2>
            <p>The controller within the meaning of the EU General Data Protection Regulation (GDPR) is:</p>
            <p>autozon GmbH (in Gründung)<br />Vienna, Austria</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Data Protection Officer</h2>
            <p>We have appointed the following Data Protection Officer:</p>
            <p>Damir Buljubasic<br />Email: <a href="mailto:dpo@autozon.app" className="text-primary hover:underline">dpo@autozon.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Your Rights as a Data Subject</h2>
            <p>Under the GDPR, you may exercise the following rights at any time:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Right of access</strong> (Art. 15 GDPR) — obtain a copy of all personal data we hold about you</li>
              <li><strong>Right to rectification</strong> (Art. 16 GDPR) — correct inaccurate personal data</li>
              <li><strong>Right to erasure</strong> (Art. 17 GDPR) — request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to restriction of processing</strong> (Art. 18 GDPR)</li>
              <li><strong>Right to object</strong> (Art. 21 GDPR) — object to processing based on legitimate interests</li>
              <li><strong>Right to data portability</strong> (Art. 20 GDPR) — receive your data in a machine-readable format</li>
              <li><strong>Right to withdraw consent</strong> — at any time with effect for the future</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:dpo@autozon.app" className="text-primary hover:underline">dpo@autozon.app</a>. We will respond within 30 days.</p>
            <p>You may also lodge a complaint with the Austrian Data Protection Authority (Datenschutzbehörde): <a href="https://www.dsb.gv.at" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.dsb.gv.at</a></p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Processing Activities</h2>

            <h3 className="text-lg font-display font-bold text-foreground mt-6">1. Website Access & Server Logs</h3>
            <p>When you access our website, we automatically collect:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address (anonymized after 7 days)</li>
              <li>Date and time of access</li>
              <li>Pages visited and referrer URL</li>
            </ul>
            <p><strong>Legal Basis:</strong> Art. 6(1)(f) GDPR — legitimate interest in website security and stability.</p>
            <p><strong>Storage:</strong> Up to 7 days, unless a security incident requires longer retention.</p>

            <h3 className="text-lg font-display font-bold text-foreground mt-6">2. User Account Registration</h3>
            <p>When you create an Autozon account, we collect:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number (optional)</li>
              <li>City and country</li>
              <li>Profile preferences (language, notification settings)</li>
            </ul>
            <p><strong>Legal Basis:</strong> Art. 6(1)(b) GDPR — performance of a contract; Art. 6(1)(a) GDPR — consent for optional data.</p>
            <p><strong>Storage:</strong> For the duration of your account. Upon deletion request, data is erased within 30 days (except where legal retention applies).</p>

            <h3 className="text-lg font-display font-bold text-foreground mt-6">3. Vehicle Data Collection & Processing</h3>
            <div className="bg-muted border border-border rounded-xl p-4 my-3">
              <p className="text-foreground font-semibold mb-2">⚠️ Important: Car Data We Collect</p>
              <p>When you upload a car for valuation or listing, we collect and process the following vehicle data:</p>
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Vehicle identification:</strong> Make, model, year, variant, VIN (Vehicle Identification Number)</li>
              <li><strong>Technical specifications:</strong> Mileage, fuel type, transmission, body type, power (HP), color</li>
              <li><strong>Condition data:</strong> Exterior and interior condition scores, accident history and details</li>
              <li><strong>Equipment & features:</strong> List of installed equipment and optional features</li>
              <li><strong>Vehicle photographs:</strong> Up to 10 images including exterior, interior, and damage documentation</li>
              <li><strong>AI damage analysis results:</strong> Automated detection of scratches, dents, rust, and other damage from uploaded photos</li>
              <li><strong>Valuation data:</strong> Fair-value price, condition score, demand score, depreciation forecasts</li>
              <li><strong>Asking price:</strong> Your desired sale price</li>
            </ul>
            <p><strong>Purpose:</strong> To provide accurate car valuations, match you with potential buyers, generate depreciation forecasts, and facilitate car transactions.</p>
            <p><strong>Legal Basis:</strong> Art. 6(1)(b) GDPR — performance of a contract (providing valuation and matching services).</p>
            <p><strong>Storage:</strong> Vehicle data is stored for the duration of the listing and 24 months after completion or cancellation. Anonymized data may be retained for market analytics.</p>
            <p><strong>Sharing:</strong> Vehicle data (excluding your personal contact details) may be shared with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Matched buyers who express interest in your vehicle</li>
              <li>Inspection service partners for vehicle verification</li>
              <li>Logistics partners for pickup and delivery coordination</li>
            </ul>

            <h3 className="text-lg font-display font-bold text-foreground mt-6">4. Buyer Preference Data</h3>
            <p>When you use our buyer matching service, we collect:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Preferred car brands, body types, and fuel types</li>
              <li>Budget range and financing preferences</li>
              <li>Lifestyle preferences (commute distance, family size, usage pattern)</li>
              <li>Timing preferences and location</li>
              <li>Car selection history (likes/dislikes from matching rounds)</li>
            </ul>
            <p><strong>Purpose:</strong> To provide personalized car recommendations and buyer-seller matching.</p>
            <p><strong>Legal Basis:</strong> Art. 6(1)(b) GDPR — performance of a contract.</p>
            <p><strong>Storage:</strong> For the duration of your account plus 12 months after last activity.</p>

            <h3 className="text-lg font-display font-bold text-foreground mt-6">5. AI-Powered Image Analysis</h3>
            <p>When you upload vehicle photographs, our AI system processes them to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Detect and classify vehicle damage (scratches, dents, rust, paint damage)</li>
              <li>Assess damage severity and location</li>
              <li>Generate condition scores that affect valuation</li>
            </ul>
            <p><strong>Legal Basis:</strong> Art. 6(1)(b) GDPR — necessary for providing the valuation service you requested.</p>
            <p><strong>Note:</strong> AI analysis is automated but you can review and confirm/dismiss each finding. No fully automated decisions with legal effects are made without human oversight.</p>

            <h3 className="text-lg font-display font-bold text-foreground mt-6">6. Communication Data</h3>
            <p>If you contact us via email or support channels, we process your submitted data, date/time, and content.</p>
            <p><strong>Legal Basis:</strong> Art. 6(1)(f) GDPR — legitimate interest; Art. 6(1)(b) GDPR — pre-contractual measures.</p>
            <p><strong>Storage:</strong> Deleted within 90 days after completion. Contractual data: 6–10 years per statutory requirements.</p>

            <h3 className="text-lg font-display font-bold text-foreground mt-6">7. Payment & Transaction Data</h3>
            <p>For paid services and car transactions, we process payment-related data through secure third-party payment processors.</p>
            <p><strong>Legal Basis:</strong> Art. 6(1)(b) GDPR — performance of a contract.</p>
            <p><strong>Recipients:</strong> Payment service providers, banks, and logistics partners as necessary.</p>
            <p><strong>Storage:</strong> According to Austrian statutory retention periods (7 years per BAO).</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Cookies & Tracking</h2>
            <p>We use cookies as described in our <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>. You can manage your cookie preferences at any time via the "Cookie Settings" link in our footer.</p>
            <p>We categorize cookies as:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Essential:</strong> Required for authentication, security, and basic functionality</li>
              <li><strong>Functional:</strong> Language preferences and saved settings</li>
              <li><strong>Analytics:</strong> Anonymous usage data (only with consent)</li>
              <li><strong>Marketing:</strong> Advertising and retargeting (only with consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Encryption in transit (TLS/SSL) and at rest</li>
              <li>Row-level security policies on all database tables</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">International Data Transfers</h2>
            <p>Data may be transferred to Bosnia and Herzegovina, Serbia, and Austria for operational purposes. Where data is transferred outside the EU/EEA, we ensure appropriate safeguards through Standard Contractual Clauses (SCCs) or adequacy decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Data Retention Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-foreground font-semibold">Data Category</th>
                    <th className="text-left py-2 text-foreground font-semibold">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50"><td className="py-2 pr-4">Server logs</td><td className="py-2">7 days</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4">Account data</td><td className="py-2">Duration of account + 30 days</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4">Vehicle listings</td><td className="py-2">Active period + 24 months</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4">Vehicle photos</td><td className="py-2">Active period + 12 months</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4">Buyer preferences</td><td className="py-2">Account duration + 12 months</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 pr-4">Transaction data</td><td className="py-2">6–10 years (statutory)</td></tr>
                  <tr><td className="py-2 pr-4">Support inquiries</td><td className="py-2">90 days after resolution</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Right to Object (Art. 21 GDPR)</h2>
            <p>You may object at any time to processing based on Art. 6(1)(f) GDPR. We will stop processing unless compelling legitimate grounds override your interests or processing is required for legal claims.</p>
            <p><strong>Recipient of Objections:</strong> Damir Buljubasic — <a href="mailto:dpo@autozon.app" className="text-primary hover:underline">dpo@autozon.app</a></p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Changes to This Privacy Policy</h2>
            <p>We reserve the right to update this Privacy Policy. Material changes will be communicated via email or prominent notice on our website. The updated version will apply to your next visit.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Contact</h2>
            <p>For any privacy-related questions, contact our Data Protection Officer at <a href="mailto:dpo@autozon.app" className="text-primary hover:underline">dpo@autozon.app</a> or write to the controller address above.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

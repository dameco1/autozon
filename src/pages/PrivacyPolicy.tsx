import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-display font-black text-white mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-silver/80">
          <section>
            <h2 className="text-xl font-display font-bold text-white">Controller</h2>
            <p>The controller within the meaning of the EU General Data Protection Regulation (GDPR) is:</p>
            <p>BowTie Sales Corp Limited<br />Registered in the Republic of Cyprus</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Data Protection Officer</h2>
            <p>We have appointed the following Data Protection Officer:</p>
            <p>Damir Buljubasic</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Your Rights as a Data Subject</h2>
            <p>Under the GDPR, you may exercise the following rights at any time:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Right of access (Art. 15 GDPR)</li>
              <li>Right to rectification (Art. 16 GDPR)</li>
              <li>Right to erasure (Art. 17 GDPR)</li>
              <li>Right to restriction of processing (Art. 18 GDPR)</li>
              <li>Right to object (Art. 21 GDPR)</li>
              <li>Right to data portability (Art. 20 GDPR)</li>
            </ul>
            <p>If you have given consent, you may withdraw it at any time with effect for the future.</p>
            <p>You may also lodge a complaint with the Office of the Commissioner for Personal Data Protection (Cyprus): <a href="https://www.dataprotection.gov.cy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://www.dataprotection.gov.cy</a></p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Processing Activities</h2>

            <h3 className="text-lg font-display font-bold text-white mt-4">1. Collection of General Information When Visiting Our Website</h3>
            <h4 className="font-semibold text-white">Nature and Purpose of Processing</h4>
            <p>When you access our website, general technical information is automatically collected (server log files), including:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Browser type</li>
              <li>Operating system</li>
              <li>Domain name of your internet service provider</li>
              <li>IP address</li>
              <li>Time of access</li>
            </ul>
            <p>This data is processed to ensure stable and secure website operation, proper functionality, and technical optimization. We do not use this data to identify you personally.</p>
            <h4 className="font-semibold text-white">Legal Basis</h4>
            <p>Art. 6(1)(f) GDPR, legitimate interest in stability, security, and functionality.</p>
            <h4 className="font-semibold text-white">Storage Duration</h4>
            <p>Up to 7 days unless a security incident requires longer retention.</p>

            <h3 className="text-lg font-display font-bold text-white mt-6">2. Contacting Us</h3>
            <h4 className="font-semibold text-white">Nature and Purpose of Processing</h4>
            <p>If you contact us via form, email, or phone, we process:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your submitted data</li>
              <li>Date and time of the request</li>
              <li>Email metadata</li>
              <li>Content of your inquiry</li>
            </ul>
            <h4 className="font-semibold text-white">Legal Basis</h4>
            <p>Art. 6(1)(f) GDPR, legitimate interest in communication; Art. 6(1)(b) GDPR, pre-contractual measures.</p>
            <h4 className="font-semibold text-white">Storage Duration</h4>
            <p>Deleted no later than 90 days after completion of your inquiry. If a contract is formed, statutory retention periods apply (6–10 years).</p>

            <h3 className="text-lg font-display font-bold text-white mt-6">3. Provision of Paid Services</h3>
            <h4 className="font-semibold text-white">Nature and Purpose of Processing</h4>
            <p>We process personal data to deliver car valuation, matching, and transaction services and fulfill contractual obligations.</p>
            <h4 className="font-semibold text-white">Legal Basis</h4>
            <p>Art. 6(1)(b) GDPR, performance of a contract.</p>
            <h4 className="font-semibold text-white">Recipients</h4>
            <p>Technical service providers, payment service providers, banks, logistics partners (if applicable).</p>
            <h4 className="font-semibold text-white">Storage Duration</h4>
            <p>Stored according to Cyprus statutory retention periods (6–10 years).</p>
            <h4 className="font-semibold text-white">Transfer to Third Countries</h4>
            <p>Data may be transferred to Bosnia and Herzegovina, Serbia, and Austria. Appropriate safeguards are applied where required.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Right to Object (Art. 21 GDPR)</h2>
            <p>You may object at any time to processing based on Art. 6(1)(f) GDPR. We will stop processing unless:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Compelling legitimate grounds override your interests, or</li>
              <li>Processing is required for legal claims.</li>
            </ul>
            <p><strong>Recipient of Objections:</strong> Damir Buljubasic</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Changes to This Privacy Policy</h2>
            <p>We reserve the right to update this Privacy Policy to reflect legal changes or modifications to our services. The updated version will apply to your next visit.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Questions About Data Protection</h2>
            <p>If you have any questions, please contact us at <a href="mailto:info@autozon.app" className="text-primary hover:underline">info@autozon.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

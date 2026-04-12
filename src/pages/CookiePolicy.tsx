import React from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <SEO 
        title="Cookie Policy"
        description="Learn about how Autozon uses cookies and similar tracking technologies. Understand essential, analytics, and marketing cookies on our platform."
        path="/cookie-policy"
      />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-display font-black text-foreground mb-8">Cookie Policy</h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Use of Cookies</h2>
            <p>Our website uses cookies to ensure technical functionality, improve user experience, and analyze usage.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Types of Cookies</h2>

            <h3 className="text-lg font-display font-bold text-foreground mt-4">Essential Cookies</h3>
            <p>Required for website operation. These cookies are necessary for the website to function and cannot be switched off. They include session management and authentication cookies.</p>

            <h3 className="text-lg font-display font-bold text-foreground mt-4">Analytics Cookies</h3>
            <p>Only activated with consent. These cookies help us understand how visitors interact with our website by collecting anonymous usage data.</p>

            <h3 className="text-lg font-display font-bold text-foreground mt-4">Marketing Cookies</h3>
            <p>Only activated with consent. These cookies are used to track visitors across websites for advertising purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Cookie Consent</h2>
            <p>You may accept, reject, or customize cookie settings. Consent can be withdrawn at any time via the cookie settings accessible in the footer of our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Third-Party Cookies</h2>
            <p>Some cookies may be set by external providers. Where data is transferred outside the EU, appropriate safeguards are applied.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Disabling Cookies</h2>
            <p>You may disable cookies in your browser settings. Please note that this may limit website functionality.</p>
            <p><em>Note: Disabling essential cookies may prevent you from using certain features of our website.</em></p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">How to Manage Cookies</h2>
            <p>Most web browsers allow you to manage cookies through their settings:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-foreground">Questions About Cookies?</h2>
            <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:info@autozon.app" className="text-primary hover:underline">info@autozon.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

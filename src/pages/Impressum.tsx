import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

const Impressum: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal text-silver">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-display font-black text-white mb-8">Impressum / Legal Disclosure</h1>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-silver/80">
          <section>
            <h2 className="text-xl font-display font-bold text-white">Company Information</h2>
            <p>BowTie Sales Corp Limited<br />Registered in the Republic of Cyprus</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Contact</h2>
            <p>
              Email: <a href="mailto:info@autozon.app" className="text-primary hover:underline">info@autozon.app</a><br />
              Phone: <a href="tel:+436649171627" className="text-primary hover:underline">+43 664 917 1627</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Responsible for Website Content</h2>
            <p>Damir Buljubasic</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">EU Online Dispute Resolution Platform</h2>
            <p>The European Commission provides a platform for online dispute resolution (ODR):</p>
            <p><a href="https://ec.europa.eu/consumers/odr/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
            <p>We are not obligated or willing to participate in consumer dispute resolution proceedings.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-white">Disclaimer</h2>

            <h3 className="text-lg font-display font-bold text-white mt-4">Liability for Content</h3>
            <p>The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness, or topicality. As a service provider, we are responsible for our own content on these pages according to general laws. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.</p>

            <h3 className="text-lg font-display font-bold text-white mt-4">Liability for Links</h3>
            <p>Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages.</p>

            <h3 className="text-lg font-display font-bold text-white mt-4">Copyright</h3>
            <p>The content and works created by the site operators on these pages are subject to copyright law. The reproduction, editing, distribution, and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Impressum;

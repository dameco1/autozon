import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Fuel, Gauge, Calendar } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface HyperSearchResultsProps {
  criteria: {
    makes?: string[];
    body_types?: string[];
    max_price?: number;
    min_year?: number;
    max_mileage?: number;
    fuel_types?: string[];
    transmission?: string;
    color?: string;
    summary?: string;
  };
  results: any[];
  totalMatched: number;
}

const HyperSearchResults: React.FC<HyperSearchResultsProps> = ({ criteria, results, totalMatched }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const criteriaChips = [
    ...(criteria.makes || []).map(m => ({ label: m, type: "make" })),
    ...(criteria.body_types || []).map(b => ({ label: b, type: "body" })),
    ...(criteria.fuel_types || []).map(f => ({ label: f, type: "fuel" })),
    ...(criteria.max_price ? [{ label: `≤ €${criteria.max_price.toLocaleString()}`, type: "price" }] : []),
    ...(criteria.min_year ? [{ label: `≥ ${criteria.min_year}`, type: "year" }] : []),
    ...(criteria.max_mileage ? [{ label: `≤ ${criteria.max_mileage.toLocaleString()} km`, type: "mileage" }] : []),
    ...(criteria.transmission ? [{ label: criteria.transmission, type: "trans" }] : []),
    ...(criteria.color ? [{ label: criteria.color, type: "color" }] : []),
  ];

  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (criteria.makes?.length) params.set("make", criteria.makes[0]);
    if (criteria.max_price) params.set("maxPrice", String(criteria.max_price));
    if (criteria.min_year) params.set("yearFrom", String(criteria.min_year));
    if (criteria.max_mileage) params.set("maxMileage", String(criteria.max_mileage));
    if (criteria.fuel_types?.length) params.set("fuelType", criteria.fuel_types[0]);
    if (criteria.body_types?.length) params.set("bodyType", criteria.body_types[0]);
    if (criteria.transmission) params.set("transmission", criteria.transmission);
    navigate(`/car-selection?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      {/* Extracted criteria chips */}
      {criteriaChips.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {language === "de" ? "Erkannte Kriterien" : "Understood criteria"}
          </p>
          <div className="flex flex-wrap gap-2">
            {criteriaChips.map((c, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{c.label}</Badge>
            ))}
          </div>
        </div>
      )}

      {criteria.summary && (
        <p className="text-sm text-muted-foreground italic mb-4">"{criteria.summary}"</p>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {language === "de" ? "Keine passenden Autos gefunden. Versuchen Sie eine breitere Beschreibung." : "No matching cars found. Try a broader description."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {results.map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/car/${car.id}`)}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={car.image_url || car.photos?.[0] || "/placeholder.svg"}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-orange text-orange-foreground font-bold text-xs">
                      {car.matchScore}% match
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-bold text-foreground truncate">{car.make} {car.model}</h4>
                  <p className="text-lg font-display font-black text-orange">€{car.price?.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>
                    <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{(car.mileage / 1000).toFixed(0)}k</span>
                    <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel_type}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalMatched > 5 && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={handleViewAll}>
                {language === "de" ? `Alle ${totalMatched} Ergebnisse anzeigen` : `View all ${totalMatched} results`}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default HyperSearchResults;

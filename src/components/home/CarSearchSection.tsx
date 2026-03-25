import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

const PRICE_OPTIONS = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000];
const MILEAGE_OPTIONS = [25000, 50000, 100000, 150000, 200000];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid"];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => currentYear - i);

type CarMakeModel = { make: string; model: string };

const CarSearchSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [makeModelData, setMakeModelData] = useState<CarMakeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [maxMileage, setMaxMileage] = useState("");

  // Load distinct makes + models from available cars
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("cars")
        .select("make, model")
        .eq("status", "available");
      if (data) setMakeModelData(data as CarMakeModel[]);
    };
    load();
  }, []);

  // Derive unique makes
  const makes = useMemo(
    () => [...new Set(makeModelData.map((c) => c.make))].sort(),
    [makeModelData]
  );

  // Derive models for selected make
  const models = useMemo(
    () =>
      make
        ? [...new Set(makeModelData.filter((c) => c.make === make).map((c) => c.model))].sort()
        : [],
    [makeModelData, make]
  );

  // Live result count
  useEffect(() => {
    const fetchCount = async () => {
      let query = supabase
        .from("cars")
        .select("id", { count: "exact", head: true })
        .eq("status", "available");

      if (make) query = query.eq("make", make);
      if (model) query = query.eq("model", model);
      if (maxPrice) query = query.lte("price", Number(maxPrice));
      if (yearFrom) query = query.gte("year", Number(yearFrom));
      if (fuelType) query = query.eq("fuel_type", fuelType);
      if (maxMileage) query = query.lte("mileage", Number(maxMileage));

      const { count } = await query;
      setTotalCount(count ?? 0);
    };
    fetchCount();
  }, [make, model, maxPrice, yearFrom, fuelType, maxMileage]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (yearFrom) params.set("yearFrom", yearFrom);
    if (fuelType) params.set("fuelType", fuelType);
    if (maxMileage) params.set("maxMileage", maxMileage);
    navigate(`/car-selection?${params.toString()}`);
  };

  const cs = t.carSearch;

  return (
    <section id="car-search" className="bg-charcoal py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white text-center mb-8">
          {cs.title}
        </h2>

        <div className="bg-secondary/50 border border-border rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {/* Make */}
            <Select value={make} onValueChange={(v) => { setMake(v); setModel(""); }}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder={cs.make} />
              </SelectTrigger>
              <SelectContent>
                {makes.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Model */}
            <Select value={model} onValueChange={setModel} disabled={!make}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder={cs.model} />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price up to */}
            <Select value={maxPrice} onValueChange={setMaxPrice}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder={cs.priceUpTo} />
              </SelectTrigger>
              <SelectContent>
                {PRICE_OPTIONS.map((p) => (
                  <SelectItem key={p} value={String(p)}>€{p.toLocaleString()}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year from */}
            <Select value={yearFrom} onValueChange={setYearFrom}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder={cs.yearFrom} />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Fuel type */}
            <Select value={fuelType} onValueChange={setFuelType}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder={cs.fuel} />
              </SelectTrigger>
              <SelectContent>
                {FUEL_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mileage up to */}
            <Select value={maxMileage} onValueChange={setMaxMileage}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder={cs.mileageUpTo} />
              </SelectTrigger>
              <SelectContent>
                {MILEAGE_OPTIONS.map((m) => (
                  <SelectItem key={m} value={String(m)}>{m.toLocaleString()} km</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => { setMake(""); setModel(""); setMaxPrice(""); setYearFrom(""); setFuelType(""); setMaxMileage(""); }}
              className="text-sm text-silver/50 hover:text-silver transition-colors"
            >
              {cs.reset}
            </button>

            <Button
              size="lg"
              className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold text-base px-8 py-5 rounded-full"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-4 w-4" />
              {totalCount !== null
                ? `${cs.searchBtn} (${totalCount})`
                : cs.searchBtn}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarSearchSection;

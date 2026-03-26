import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, Users, Baby, Briefcase, Wallet, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

const PRICE_OPTIONS = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000, 200000, -1];
const MILEAGE_OPTIONS = [25000, 50000, 100000, 150000, 200000];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid"];
const PURPOSES = ["daily", "work", "pleasure", "summer", "winter"] as const;
const RELATIONSHIPS = ["single", "married", "divorced"] as const;

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

  const [relationship, setRelationship] = useState("");
  const [hasKids, setHasKids] = useState("");
  const [purpose, setPurpose] = useState("");
  const [budget, setBudget] = useState("");

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

  const makes = useMemo(
    () => [...new Set(makeModelData.map((c) => c.make))].sort(),
    [makeModelData]
  );

  const models = useMemo(
    () =>
      make
        ? [...new Set(makeModelData.filter((c) => c.make === make).map((c) => c.model))].sort()
        : [],
    [makeModelData, make]
  );

  const effectiveMaxPrice = budget || maxPrice;

  useEffect(() => {
    const fetchCount = async () => {
      let query = supabase
        .from("cars")
        .select("id", { count: "exact", head: true })
        .eq("status", "available");

      if (make) query = query.eq("make", make);
      if (model) query = query.eq("model", model);
      if (effectiveMaxPrice && Number(effectiveMaxPrice) > 0) query = query.lte("price", Number(effectiveMaxPrice));
      if (yearFrom) query = query.gte("year", Number(yearFrom));
      if (fuelType) query = query.eq("fuel_type", fuelType);
      if (maxMileage) query = query.lte("mileage", Number(maxMileage));

      const { count } = await query;
      setTotalCount(count ?? 0);
    };
    fetchCount();
  }, [make, model, effectiveMaxPrice, yearFrom, fuelType, maxMileage]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (effectiveMaxPrice) params.set("maxPrice", effectiveMaxPrice);
    if (yearFrom) params.set("yearFrom", yearFrom);
    if (fuelType) params.set("fuelType", fuelType);
    if (maxMileage) params.set("maxMileage", maxMileage);
    if (relationship) params.set("relationship", relationship);
    if (hasKids) params.set("kids", hasKids);
    if (purpose) params.set("purpose", purpose);
    navigate(`/car-selection?${params.toString()}`);
  };

  const resetAll = () => {
    setMake(""); setModel(""); setMaxPrice(""); setYearFrom("");
    setFuelType(""); setMaxMileage(""); setRelationship("");
    setHasKids(""); setPurpose(""); setBudget("");
  };

  const cs = t.carSearch;
  const ls = t.lifestyle;

  return (
    <section id="car-search" className="bg-muted py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground text-center mb-2">
          {cs.title}
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-8">{cs.subtitle}</p>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Lifestyle filters row */}
          <div className="mb-6">
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {ls.sectionTitle}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger className="bg-background border-border text-foreground text-sm">
                  <Heart className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
                  <SelectValue placeholder={ls.relationship} />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r} value={r}>{ls.relationships[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={hasKids} onValueChange={setHasKids}>
                <SelectTrigger className="bg-background border-border text-foreground text-sm">
                  <Baby className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
                  <SelectValue placeholder={ls.kids} />
                </SelectTrigger>
                <SelectContent>
                  {["0", "1", "2", "3", "3+"].map((k) => (
                    <SelectItem key={k} value={k}>{k} {k === "0" ? ls.noKids : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="bg-background border-border text-foreground text-sm">
                  <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
                  <SelectValue placeholder={ls.purpose} />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSES.map((p) => (
                    <SelectItem key={p} value={p}>{ls.purposes[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger className="bg-background border-border text-foreground text-sm">
                  <Wallet className="h-3.5 w-3.5 mr-1 text-muted-foreground shrink-0" />
                  <SelectValue placeholder={ls.budget} />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_OPTIONS.map((p) => (
                    <SelectItem key={p} value={String(p)}>{p === -1 ? "Unlimited" : `€${p.toLocaleString()}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* OR Divider */}
          <div className="relative my-6">
            <div className="border-t border-border" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 py-1 rounded-full text-xs font-bold text-orange uppercase tracking-widest">
              {cs.or}
            </span>
          </div>

          {/* Car spec filters */}
          <div className="mb-3">
            <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" /> {cs.vehicleType}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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
              onClick={resetAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {cs.reset}
            </button>

            <Button
              size="lg"
              className="bg-orange text-orange-foreground hover:bg-orange/90 font-bold text-base px-8 py-5 rounded-lg"
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

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Package, ArrowLeft, FileText, CreditCard, Shield, CheckCircle2, AlertTriangle } from "lucide-react";
import { generateNegotiationPdf } from "@/lib/generateNegotiationPdf";
import { getWorkflow, getAllDocuments, type PartyType, type RoleWorkflow } from "@/lib/roleWorkflow";
import TransactionStepIndicator from "@/components/transaction/TransactionStepIndicator";
import StepMethod from "@/components/transaction/StepMethod";
import StepContract from "@/components/transaction/StepContract";
import StepPayment from "@/components/transaction/StepPayment";
import StepInsurance from "@/components/transaction/StepInsurance";
import StepComplete from "@/components/transaction/StepComplete";
import StepManualComplete from "@/components/transaction/StepManualComplete";
import DocumentChecklist from "@/components/transaction/DocumentChecklist";
import DeadlineManager from "@/components/transaction/DeadlineManager";

interface OfferInfo {
  id: string;
  car_id: string;
  buyer_id: string;
  seller_id: string;
  agreed_price: number;
  status: string;
}

interface CarInfo {
  make: string;
  model: string;
  year: number;
  price: number;
  fair_value_price: number | null;
  vin: string | null;
}

interface Partner {
  id: string;
  name: string;
  type: string;
  base_rate: number;
  description: string | null;
}

const AcquisitionOptions: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [offer, setOffer] = useState<OfferInfo | null>(null);
  const [car, setCar] = useState<CarInfo | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerName, setSellerName] = useState("Seller");
  const [buyerName, setBuyerName] = useState("Buyer");
  const [sellerCountry, setSellerCountry] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Role types
  const [sellerType, setSellerType] = useState<PartyType>("private");
  const [buyerType, setBuyerType] = useState<PartyType>("private");
  const [workflow, setWorkflow] = useState<RoleWorkflow | null>(null);

  // Transaction wizard state
  const [step, setStep] = useState(1);
  const [completionMethod, setCompletionMethod] = useState<string | null>(null);
  const [contractType, setContractType] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [financingPartnerId, setFinancingPartnerId] = useState<string | null>(null);
  const [insuranceTier, setInsuranceTier] = useState<string | null>(null);
  const [insurancePartnerId, setInsurancePartnerId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [contractSignedSeller, setContractSignedSeller] = useState(false);
  const [contractSignedBuyer, setContractSignedBuyer] = useState(false);
  const [contractSignedAt, setContractSignedAt] = useState<string | null>(null);
  const [myKycStatus, setMyKycStatus] = useState<string>("none");
  const [buyerKycVerified, setBuyerKycVerified] = useState(false);
  const [sellerKycVerified, setSellerKycVerified] = useState(false);

  // Record appraisal feedback for future calibration
  const recordAppraisalFeedback = useCallback(async (carId: string, agreedSalePrice: number) => {
    try {
      const { data: existing } = await supabase
        .from("appraisal_feedback" as any)
        .select("id, blended_value")
        .eq("car_id", carId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        const blended = (existing as any).blended_value ?? 0;
        const deviation = blended > 0 ? Math.round(((agreedSalePrice - blended) / blended) * 100) : null;
        await supabase
          .from("appraisal_feedback" as any)
          .update({ agreed_sale_price: agreedSalePrice, deviation_pct: deviation } as any)
          .eq("id", (existing as any).id);
      }
    } catch (e) {
      console.error("Failed to record appraisal feedback:", e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { navigate("/login"); return; }
      if (!offerId) return;
      setCurrentUserId(session.user.id);

      const [offerRes, partnersRes] = await Promise.all([
        supabase.from("offers").select("id, car_id, agreed_price, status, buyer_id, seller_id").eq("id", offerId).single(),
        supabase.from("financing_partners").select("*"),
      ]);

      if (!offerRes.data || (offerRes.data as any).status !== "accepted") {
        toast.error("No accepted deal found");
        navigate("/dashboard");
        return;
      }

      const o = offerRes.data as unknown as OfferInfo;
      setOffer(o);
      if (partnersRes.data) setPartners(partnersRes.data as Partner[]);

      const { data: carData } = await supabase
        .from("cars")
        .select("make, model, year, price, fair_value_price, vin")
        .eq("id", o.car_id)
        .single();

      if (carData) setCar(carData as CarInfo);

      // Fetch names, seller country, user types, and current user KYC
      const [profileRes, buyerRes, myProfileRes] = await Promise.all([
        supabase.from("profiles").select("full_name, country, kyc_status, user_type").eq("user_id", o.seller_id).maybeSingle(),
        supabase.from("profiles").select("full_name, kyc_status, user_type").eq("user_id", o.buyer_id).maybeSingle(),
        supabase.from("profiles").select("kyc_status").eq("user_id", session.user.id).maybeSingle(),
      ]);
      if (profileRes.data?.full_name) setSellerName(profileRes.data.full_name);
      if (profileRes.data?.country) setSellerCountry(profileRes.data.country);
      if (buyerRes.data?.full_name) setBuyerName(buyerRes.data.full_name);
      if (myProfileRes.data) setMyKycStatus((myProfileRes.data as any).kyc_status || "none");

      // Set party types
      const sType = ((profileRes.data as any)?.user_type === "business" ? "business" : "private") as PartyType;
      const bType = ((buyerRes.data as any)?.user_type === "business" ? "business" : "private") as PartyType;
      setSellerType(sType);
      setBuyerType(bType);
      setWorkflow(getWorkflow(sType, bType));

      // Set KYC verification statuses
      const sellerKyc = (profileRes.data as any)?.kyc_status;
      const buyerKyc = (buyerRes.data as any)?.kyc_status;
      setSellerKycVerified(sellerKyc === "verified" || sellerKyc === "approved");
      setBuyerKycVerified(buyerKyc === "verified" || buyerKyc === "approved");

      // Check for existing transaction
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("offer_id", offerId)
        .maybeSingle();

      if (txData) {
        const tx = txData as any;
        setTransactionId(tx.id);
        setCompletionMethod(tx.completion_method);
        setContractType(tx.contract_type);
        setPaymentMethod(tx.payment_method);
        setInsuranceTier(tx.insurance_tier);
        setContractSignedSeller(tx.contract_signed_seller || false);
        setContractSignedBuyer(tx.contract_signed_buyer || false);
        setContractSignedAt(tx.contract_generated_at || null);
        setStep(tx.current_step || 1);
      }

      // Handle payment=success redirect from Stripe
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success" && txData) {
        const tx = txData as any;
        if (tx.current_step === 3 || tx.payment_method === null) {
          // Auto-advance: save card payment and move to insurance step
          await supabase.rpc("transaction_set_payment", {
            _transaction_id: tx.id,
            _payment_method: "card",
            _financing_partner_id: null,
          });
          setPaymentMethod("card");
          setStep(4);
          toast.success("Payment completed successfully!");
          // Clean up URL
          window.history.replaceState({}, "", window.location.pathname);
        }
      }

      setLoading(false);
    };
    init();
  }, [offerId, navigate]);

  const ensureTransaction = useCallback(async (): Promise<string | null> => {
    if (!offer) return null;
    if (transactionId) return transactionId;
    const { data } = await supabase.from("transactions").insert({
      offer_id: offer.id,
      car_id: offer.car_id,
      buyer_id: offer.buyer_id,
      seller_id: offer.seller_id,
      agreed_price: offer.agreed_price,
      seller_type: sellerType,
      buyer_type: buyerType,
    } as any).select("id").single();
    if (data) {
      const id = (data as any).id;
      setTransactionId(id);
      return id;
    }
    return null;
  }, [offer, transactionId, sellerType, buyerType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!offer || !car) {
    return (
      <div className="min-h-screen bg-background text-muted-foreground">
        <Navbar />
        <div className="flex items-center justify-center pt-32 text-muted-foreground">Deal not found</div>
      </div>
    );
  }

  const agreedPrice = offer.agreed_price;
  const isSeller = currentUserId === offer.seller_id;
  const isBuyer = currentUserId === offer.buyer_id;

  const wizardSteps = [
    { label: t.transaction.stepMethod, icon: <Package className="h-4 w-4" /> },
    { label: t.transaction.stepContract, icon: <FileText className="h-4 w-4" /> },
    { label: t.transaction.stepPayment, icon: <CreditCard className="h-4 w-4" /> },
    { label: t.transaction.stepInsurance, icon: <Shield className="h-4 w-4" /> },
    { label: t.transaction.stepComplete, icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const handleMethodSelect = async (method: "digital" | "manual") => {
    setCompletionMethod(method);
    const txId = await ensureTransaction();
    if (!txId) return;
    if (method === "manual") {
      await supabase.rpc("transaction_set_method", {
        _transaction_id: txId,
        _completion_method: "manual",
        _status: "completed",
        _current_step: 5,
      });
      await supabase.from("cars").update({ status: "sold" } as any).eq("id", offer!.car_id);
      recordAppraisalFeedback(offer!.car_id, agreedPrice);
      setStep(99);
    } else {
      await supabase.rpc("transaction_set_method", {
        _transaction_id: txId,
        _completion_method: "digital",
        _status: "contract_pending",
        _current_step: 2,
      });
      setStep(2);
    }
  };

  const handleContractDone = async (type: string) => {
    setContractType(type);
    setContractSignedAt(new Date().toISOString());
    if (!transactionId) return;
    await supabase.rpc("transaction_set_contract", {
      _transaction_id: transactionId,
      _contract_type: type,
    });
    setStep(3);
  };

  const handlePaymentDone = async (method: string, partnerId?: string) => {
    setPaymentMethod(method);
    setFinancingPartnerId(partnerId || null);
    if (!transactionId) return;
    await supabase.rpc("transaction_set_payment", {
      _transaction_id: transactionId,
      _payment_method: method,
      _financing_partner_id: partnerId || null,
    });
    setStep(4);
  };

  const handleInsuranceDone = async (tier: string, partnerId?: string) => {
    setInsuranceTier(tier);
    setInsurancePartnerId(partnerId || null);
    if (!transactionId) return;
    await supabase.rpc("transaction_set_insurance", {
      _transaction_id: transactionId,
      _insurance_tier: tier,
      _insurance_partner_id: partnerId || null,
      _insurance_confirmed: true,
    });
    if (offer) recordAppraisalFeedback(offer.car_id, agreedPrice);
    setStep(5);
  };

  const handleInsuranceSkip = async () => {
    if (!transactionId) return;
    await supabase.rpc("transaction_set_insurance", {
      _transaction_id: transactionId,
      _insurance_tier: null,
      _insurance_partner_id: null,
      _insurance_confirmed: false,
    });
    if (offer) recordAppraisalFeedback(offer.car_id, agreedPrice);
    setStep(5);
  };

  const handleDownload = () => {
    generateNegotiationPdf({
      car: { ...car, price: car.price, fair_value_price: car.fair_value_price },
      offer: {
        amount: agreedPrice,
        agreed_price: agreedPrice,
        counter_amount: null,
        current_round: 1,
        max_rounds: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any,
      sellerName,
      buyerName,
    });
  };

  const myRole: "buyer" | "seller" = isSeller ? "seller" : "buyer";

  return (
    <div className="min-h-screen bg-background text-muted-foreground">
      <SEO title={`${t.transaction.title} — ${car.year} ${car.make} ${car.model}`} description="Complete your vehicle transaction" path={`/acquire/${offerId}`} noIndex />
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Package className="h-4 w-4" /> {t.transaction.title}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-foreground">
            {car.year} {car.make} {car.model}
          </h1>
        </motion.div>

        {/* Deal summary */}
        <motion.div
          className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8 grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <div>
            <p className="text-xs text-muted-foreground">{t.acquisition.askingPrice}</p>
            <p className="text-lg font-display font-bold text-muted-foreground line-through">€{car.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.acquisition.agreedPrice}</p>
            <p className="text-2xl font-display font-black text-primary">€{agreedPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.acquisition.saved}</p>
            <p className="text-lg font-display font-bold text-primary">€{(car.price - agreedPrice).toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Step indicator (only for digital flow) */}
        {step !== 99 && step <= 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <TransactionStepIndicator steps={wizardSteps} currentStep={step} />
          </motion.div>
        )}

        {/* Wizard content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {/* Step 1: only buyer picks method */}
          {step === 1 && (
            isBuyer ? (
              <StepMethod onSelect={handleMethodSelect} />
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t.transaction.sellerWaitingForBuyer}</p>
                <Button variant="ghost" className="mt-4 text-muted-foreground" onClick={() => navigate("/dashboard")}>
                  {t.transaction.backToDashboard}
                </Button>
              </div>
            )
          )}

          {/* Step 2: Contract (both roles) */}
          {step === 2 && completionMethod === "digital" && (
            myKycStatus !== "verified" && myKycStatus !== "approved" ? (
              <div className="text-center py-12 space-y-4">
                <AlertTriangle className="h-12 w-12 text-orange mx-auto" />
                <h3 className="text-xl font-display font-bold text-foreground">{(t as any).kyc?.title || "Identity Verification Required"}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">{(t as any).kyc?.subtitle || "You must verify your identity before signing a contract."}</p>
                <Button className="bg-primary text-primary-foreground" onClick={() => navigate("/kyc")}>
                  <Shield className="mr-2 h-4 w-4" /> {(t as any).kyc?.startVerification || "Start Verification"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <StepContract
                  car={{ make: car.make, model: car.model, year: car.year, vin: car.vin || undefined }}
                  agreedPrice={agreedPrice}
                  sellerCountry={sellerCountry}
                  buyerName={buyerName}
                  sellerName={sellerName}
                  transactionId={transactionId}
                  onContinue={isBuyer ? handleContractDone : undefined}
                  role={myRole}
                  contractSignedSeller={contractSignedSeller}
                  contractSignedBuyer={contractSignedBuyer}
                  buyerKycVerified={buyerKycVerified}
                  sellerKycVerified={sellerKycVerified}
                  sellerType={sellerType}
                  buyerType={buyerType}
                  workflow={workflow || undefined}
                  onSellerSign={isSeller ? async () => {
                    if (!transactionId) return;
                    await supabase.rpc("transaction_seller_sign_contract", { _transaction_id: transactionId });
                    setContractSignedSeller(true);
                    toast.success(t.transaction.contractSigned);
                  } : undefined}
                />
                {transactionId && workflow && (
                  <DocumentChecklist
                    transactionId={transactionId}
                    documents={getAllDocuments(workflow)}
                    role={myRole}
                  />
                )}
              </div>
            )
          )}

          {/* Step 3: Payment (both roles) */}
          {step === 3 && completionMethod === "digital" && (
            isBuyer ? (
              <StepPayment
                agreedPrice={agreedPrice}
                partners={partners}
                onContinue={handlePaymentDone}
                onBack={() => setStep(2)}
                carId={offer?.car_id}
                transactionId={transactionId || undefined}
                carTitle={car ? `${car.year} ${car.make} ${car.model}` : undefined}
              />
            ) : (
              <div className="space-y-6">
                {/* Seller payment status */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                  <CreditCard className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-display font-bold text-foreground mb-1">
                    {t.transaction?.sellerPaymentTitle || "Payment In Progress"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t.transaction?.sellerPaymentDesc || "The buyer is completing their payment. Once confirmed, you'll be notified and can proceed with vehicle delivery."}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    {t.transaction?.awaitingPayment || "Awaiting Buyer Payment"}
                  </div>
                </div>

                {/* Delivery preparation checklist */}
                <div className="bg-secondary/50 border border-border rounded-2xl p-6">
                  <h4 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    {t.transaction?.deliveryPrep || "Prepare for Vehicle Delivery"}
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t.transaction?.deliveryPrepDesc || "While waiting for the buyer's payment, prepare these items for a smooth handover:"}
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: t.transaction?.prepKeys || "Gather all vehicle keys (main + spare)", icon: "🔑" },
                      { label: t.transaction?.prepDocs || "Prepare registration documents (Zulassungsschein Teil I & II)", icon: "📄" },
                      { label: t.transaction?.prepService || "Locate service book and maintenance receipts", icon: "📋" },
                      { label: t.transaction?.prepInspection || "Ensure §57a Gutachten (Pickerl) is available", icon: "✅" },
                      { label: t.transaction?.prepClean || "Clean the vehicle inside and out", icon: "🚗" },
                      { label: t.transaction?.prepPersonal || "Remove all personal belongings from the vehicle", icon: "📦" },
                      { label: t.transaction?.prepDeregister || "Plan visit to Zulassungsstelle for deregistration", icon: "🏛️" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-background/50 rounded-xl border border-border/50">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <span className="text-sm text-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deal summary for seller */}
                <div className="bg-secondary/50 border border-border rounded-2xl p-5">
                  <h4 className="font-display font-bold text-foreground mb-3 text-sm">
                    {t.transaction?.sellerPaymentSummary || "Payment Summary"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.acquisition?.agreedPrice || "Agreed Price"}</span>
                      <span className="text-primary font-bold text-lg">€{agreedPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.transaction?.sellerReceives || "You Receive"}</span>
                      <span className="text-foreground font-semibold">€{agreedPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 {t.transaction?.sellerNoDeductions || "You receive the full agreed price — all transaction fees are covered by the buyer."}
                    </p>
                  </div>
                </div>

                {transactionId && workflow && (
                  <DocumentChecklist transactionId={transactionId} documents={getAllDocuments(workflow)} role="seller" />
                )}
                {transactionId && workflow && contractSignedAt && (
                  <DeadlineManager transactionId={transactionId} deadlines={workflow.deadlines} contractSignedAt={contractSignedAt} />
                )}
              </div>
            )
          )}

          {/* Step 4: Insurance (both roles) */}
          {step === 4 && completionMethod === "digital" && (
            isBuyer ? (
              <StepInsurance
                agreedPrice={agreedPrice}
                partners={partners}
                onContinue={handleInsuranceDone}
                onSkip={handleInsuranceSkip}
              />
            ) : (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-display font-bold text-foreground">{t.transaction.stepInsurance}</h3>
                  <p className="text-muted-foreground text-sm mt-1">Waiting for buyer to complete insurance selection.</p>
                </div>
                {transactionId && workflow && (
                  <DocumentChecklist transactionId={transactionId} documents={getAllDocuments(workflow)} role="seller" />
                )}
                {transactionId && workflow && contractSignedAt && (
                  <DeadlineManager transactionId={transactionId} deadlines={workflow.deadlines} contractSignedAt={contractSignedAt} />
                )}
              </div>
            )
          )}

          {/* Step 5: Complete (both roles) — includes read-only contract */}
          {step === 5 && completionMethod === "digital" && (
            <div className="space-y-6">
              <StepComplete
                car={car}
                agreedPrice={agreedPrice}
                completionMethod={completionMethod || "digital"}
                contractType={contractType}
                paymentMethod={paymentMethod}
                insuranceTier={insuranceTier}
                carId={offer?.car_id}
                fairValuePrice={car?.fair_value_price}
                onDashboard={() => navigate("/dashboard")}
                onDownload={handleDownload}
              />
              {/* Full online contract (read-only, with Print/Save as PDF) */}
              <StepContract
                car={{ make: car.make, model: car.model, year: car.year, vin: car.vin || undefined }}
                agreedPrice={agreedPrice}
                sellerCountry={sellerCountry}
                buyerName={buyerName}
                sellerName={sellerName}
                transactionId={transactionId}
                role={myRole}
                contractSignedSeller={contractSignedSeller}
                contractSignedBuyer={contractSignedBuyer}
                buyerKycVerified={buyerKycVerified}
                sellerKycVerified={sellerKycVerified}
                sellerType={sellerType}
                buyerType={buyerType}
                workflow={workflow || undefined}
              />
              {transactionId && workflow && (
                <DocumentChecklist transactionId={transactionId} documents={getAllDocuments(workflow)} role={myRole} />
              )}
              {transactionId && workflow && (
                <DeadlineManager transactionId={transactionId} deadlines={workflow.deadlines} contractSignedAt={contractSignedAt || new Date().toISOString()} />
              )}
            </div>
          )}

          {/* Manual complete (both roles) */}
          {step === 99 && (
            <StepManualComplete
              car={car}
              agreedPrice={agreedPrice}
              sellerCountry={sellerCountry}
              carId={offer?.car_id}
              fairValuePrice={car?.fair_value_price}
              onDashboard={() => navigate("/dashboard")}
              onDownload={handleDownload}
            />
          )}
        </motion.div>

        {/* Back */}
        {step === 1 && isBuyer && (
          <div className="mt-8 text-center">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate(`/negotiate/${offerId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t.acquisition.backToNegotiation}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcquisitionOptions;

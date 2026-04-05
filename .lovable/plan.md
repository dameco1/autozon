
## Phase: Role-Based Workflow Engine & Offline Deadline Manager

### 1. Database Changes

**New table: `transaction_documents`**
- Tracks required document uploads per transaction (e.g., Zulassungsschein, invoices, Gewerbeschein)
- Columns: id, transaction_id, document_type, label, required, uploaded_url, uploaded_at, verified

**New table: `transaction_deadlines`**
- Tracks offline step deadlines (inspection, registration, handover, NoVA)
- Columns: id, transaction_id, step_type, deadline_at, completed_at, reminded_at, status (pending/completed/overdue)

**Alter `transactions` table:**
- Add `seller_type` (private/business) and `buyer_type` (private/business)
- Add `warranty_type` (none/statutory/extended) — determines warranty rules based on role combo

### 2. Role-Based Contract Templates

Current contract is one-size-fits-all. We'll generate different clauses based on 4 role combos:

| Combo | Warranty | Special Clauses |
|-------|---------|-----------------|
| Private→Private | Gewährleistungsausschluss (no warranty) | As-is sale, both parties verified |
| Business→Private | 2-year statutory warranty (Gewährleistung) | Consumer protection applies, complaint procedure |
| Private→Business | No warranty | Professional buyer accepts as-is |
| Business→Business | Negotiable/limited warranty | B2B terms, commercial law applies |

Update `generateContractPdf.ts` to accept `sellerType`/`buyerType` and generate appropriate clauses.

### 3. Document Checklists

Per role combination, different documents are required:

**Private seller:** Zulassungsschein (Part I+II), Serviceheft, Pickerl (§57a)
**Business seller:** Zulassungsschein, Gewerbeschein, invoice/Rechnung, warranty certificate
**Private buyer:** ID verified (KYC), proof of payment
**Business buyer:** UID-Nummer confirmation, Firmenbuchauszug, authorized representative proof

UI: Checklist component in the acquisition flow showing required docs with upload capability.

### 4. Offline Deadline Manager

After digital contract signing, offline steps with deadlines:
- **Vehicle inspection**: 72 hours from contract signing
- **Registration transfer**: 7 days
- **Vehicle handover**: 14 days  
- **NoVA payment** (if applicable): 15 days

Each deadline shows a countdown timer. Overdue deadlines trigger warnings. Both parties can mark steps as completed.

### 5. Implementation Order

1. DB migration (tables + columns)
2. Role-based contract generation logic
3. Document checklist component + upload
4. Deadline manager component + display
5. Wire everything into AcquisitionOptions flow

### Files to Create/Modify
- **Migration**: New tables + alter transactions
- `src/lib/generateContractPdf.ts` — role-based clauses
- `src/lib/roleWorkflow.ts` — NEW: defines document requirements & deadlines per role combo
- `src/components/transaction/DocumentChecklist.tsx` — NEW
- `src/components/transaction/DeadlineManager.tsx` — NEW
- `src/pages/AcquisitionOptions.tsx` — integrate new components
- `src/components/transaction/StepContract.tsx` — pass role types
- `src/components/transaction/StepComplete.tsx` — show deadlines after completion

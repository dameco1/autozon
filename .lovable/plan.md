

## Add Q&A Page from Investor Document

### Overview
Create a new `/qa` page displaying the 7 investor Q&A items from the uploaded PDF, formatted as an accordion-style FAQ. Add a "Q&A" link in the Navbar. Replace all "Canada" references with "Worldwide".

### Content (7 Q&A pairs, reformulated as generic questions)

1. **Q: How does Autozon solve the trade-off between selling fast (dealer) and selling for more (private)?**
   Answer: Autozon removes the forced choice by creating a verified, cross-border buyer network...

2. **Q: How is Autozon different from existing platforms like Autotrader or Mobile.de?**
   Answer: Traditional platforms are classified ad marketplaces...

3. **Q: In some markets, trade-ins offer tax benefits. How does Autozon compete?**
   Answer: (Original says "Canada" — changed to "Worldwide") In many markets, tax credits make trade-ins attractive...

4. **Q: There are many websites where you post photos and wait for buyers. What's different?**
   Answer: Autozon replaces the "post and wait" model...

5. **Q: People already post free or paid ads to sell privately. Why use Autozon?**
   Answer: The core problem with free/paid ads...

6. **Q: Valuation tools already tell you retail value. What more does Autozon offer?**
   Answer: Valuation tools give a number but don't create a transaction...

7. **Q: How is Autozon different from the many car apps available worldwide?**
   Answer: (Original says "for Canada" — changed to "worldwide") Most car apps are catalogues...

### Technical Changes

| File | Change |
|---|---|
| `src/pages/QA.tsx` | New page with accordion-based Q&A using existing Accordion components |
| `src/i18n/translations.ts` | Add `nav.qa: "Q&A"` / `"Fragen"` to both EN and DE nav sections |
| `src/components/Navbar.tsx` | Add Q&A link in both desktop and mobile menus |
| `src/App.tsx` | Add `/qa` route (public) |

### Design Details
- Uses existing `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` from shadcn
- Same dark theme as other pages (Navbar + dark background)
- Questions reformulated as generic/universal (not investor-conversation-style)
- All "Canada" references replaced with "Worldwide" or "many markets"
- SEO component included
- Back-to-home link like other legal pages


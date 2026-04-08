/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Autozon'
const LOGO_URL = 'https://heykhsoumvklotycuzya.supabase.co/storage/v1/object/public/email-assets/logo.png'

interface CarPurchaseReceiptProps {
  carTitle?: string
  agreedPrice?: string
  fees?: string
  totalAmount?: string
  date?: string
  transactionId?: string
}

const CarPurchaseReceiptEmail = ({
  carTitle,
  agreedPrice,
  fees,
  totalAmount,
  date,
  transactionId,
}: CarPurchaseReceiptProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Zahlungsbestätigung – Fahrzeugkauf {carTitle || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Autozon" width="140" height="40" style={logo} />
        <Heading style={h1}>Zahlungsbestätigung</Heading>
        <Text style={text}>
          Deine Zahlung für den Fahrzeugkauf wurde erfolgreich verarbeitet. Der nächste Schritt ist die Eigentumsübertragung.
        </Text>
        <Section style={receiptBox}>
          <Text style={receiptLabel}>Fahrzeug</Text>
          <Text style={receiptValue}>{carTitle || '–'}</Text>
          <Hr style={divider} />
          <Text style={receiptLabel}>Fahrzeugpreis</Text>
          <Text style={receiptValue}>{agreedPrice || '–'}</Text>
          <Hr style={divider} />
          <Text style={receiptLabel}>Gebühren</Text>
          <Text style={receiptValue}>{fees || '–'}</Text>
          <Hr style={divider} />
          <Text style={receiptLabel}>Gesamtbetrag</Text>
          <Text style={receiptValueHighlight}>{totalAmount || '–'}</Text>
          <Hr style={divider} />
          <Text style={receiptLabel}>Datum</Text>
          <Text style={receiptValue}>{date || '–'}</Text>
          {transactionId && (
            <>
              <Hr style={divider} />
              <Text style={receiptLabel}>Transaktions-ID</Text>
              <Text style={receiptValue}>{transactionId}</Text>
            </>
          )}
        </Section>
        <Button style={button} href="https://autozon.lovable.app/dashboard">
          Zur Eigentumsübertragung
        </Button>
        <Text style={footer}>Beste Grüße, dein {SITE_NAME}-Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: CarPurchaseReceiptEmail,
  subject: (data: Record<string, any>) =>
    `Zahlungsbestätigung – Fahrzeugkauf ${data.carTitle || ''}`.trim(),
  displayName: 'Fahrzeugkauf-Zahlungsbeleg',
  previewData: {
    carTitle: '2022 Audi A4 Avant 40 TDI',
    agreedPrice: '€8.500,00',
    fees: '€496,30',
    totalAmount: '€8.996,30',
    date: '08.04.2026',
    transactionId: 'a1b2c3d4',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 28px' }
const logo = { margin: '0 0 20px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: 'hsl(220, 20%, 14%)',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: 'hsl(220, 10%, 46%)',
  lineHeight: '1.6',
  margin: '0 0 25px',
}
const receiptBox = {
  backgroundColor: '#f9f9f9',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '0 0 25px',
}
const receiptLabel = {
  fontSize: '12px',
  color: '#999999',
  margin: '0 0 2px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}
const receiptValue = {
  fontSize: '15px',
  color: 'hsl(220, 20%, 14%)',
  fontWeight: '600' as const,
  margin: '0 0 4px',
}
const receiptValueHighlight = {
  fontSize: '18px',
  color: 'hsl(24, 85%, 48%)',
  fontWeight: '700' as const,
  margin: '0 0 4px',
}
const divider = { borderColor: '#e5e5e5', margin: '12px 0' }
const button = {
  backgroundColor: 'hsl(24, 85%, 48%)',
  color: '#ffffff',
  fontSize: '15px',
  borderRadius: '12px',
  padding: '14px 24px',
  textDecoration: 'none',
  fontWeight: '600' as const,
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }

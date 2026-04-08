/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
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

interface PlacementReceiptProps {
  carTitle?: string
  amount?: string
  date?: string
}

const PlacementReceiptEmail = ({ carTitle, amount, date }: PlacementReceiptProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Zahlungsbestätigung – Inserat für {carTitle || 'dein Fahrzeug'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Autozon" width="140" height="40" style={logo} />
        <Heading style={h1}>Zahlungsbestätigung</Heading>
        <Text style={text}>
          Deine Zahlung für die Platzierung deines Inserats wurde erfolgreich verarbeitet. Dein Fahrzeug ist jetzt live und für passende Käufer sichtbar.
        </Text>
        <Section style={receiptBox}>
          <Text style={receiptLabel}>Fahrzeug</Text>
          <Text style={receiptValue}>{carTitle || '–'}</Text>
          <Hr style={divider} />
          <Text style={receiptLabel}>Betrag</Text>
          <Text style={receiptValue}>{amount || '–'}</Text>
          <Hr style={divider} />
          <Text style={receiptLabel}>Datum</Text>
          <Text style={receiptValue}>{date || '–'}</Text>
          <Hr style={divider} />
          <Text style={receiptLabel}>Leistung</Text>
          <Text style={receiptValue}>Premium-Inserat-Platzierung</Text>
        </Section>
        <Text style={text}>
          Du findest dein Inserat und passende Käufer jederzeit in deinem Dashboard.
        </Text>
        <Text style={footer}>Beste Grüße, dein {SITE_NAME}-Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PlacementReceiptEmail,
  subject: (data: Record<string, any>) =>
    `Zahlungsbestätigung – Inserat ${data.carTitle || ''}`.trim(),
  displayName: 'Platzierungs-Zahlungsbeleg',
  previewData: { carTitle: '2021 BMW X5 xDrive30d', amount: '€9,99', date: '08.04.2026' },
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
const divider = { borderColor: '#e5e5e5', margin: '12px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }

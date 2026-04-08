/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Autozon'
const LOGO_URL = 'https://heykhsoumvklotycuzya.supabase.co/storage/v1/object/public/email-assets/logo.png'

interface WelcomeEmailProps {
  name?: string
}

const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html lang="de" dir="ltr">
    <Head />
    <Preview>Willkommen bei {SITE_NAME}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Autozon" width="40" height="40" style={logo} />
        <Heading style={h1}>
          {name ? `Willkommen, ${name}!` : 'Willkommen bei Autozon!'}
        </Heading>
        <Text style={text}>
          Schön, dass du dabei bist! Mit Autozon findest du dein nächstes Auto oder verkaufst dein aktuelles – fair, transparent und mit KI-Unterstützung.
        </Text>
        <Button style={button} href="https://autozon.lovable.app/dashboard">
          Jetzt loslegen
        </Button>
        <Text style={footer}>Beste Grüße, dein {SITE_NAME}-Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Willkommen bei Autozon!',
  displayName: 'Willkommens-E-Mail',
  previewData: { name: 'Max' },
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

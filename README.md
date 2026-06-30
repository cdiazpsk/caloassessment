# Caliber Asset Assessment

A Next.js and Supabase web app for remote hospitality PM condition assessments.

## Core Idea

Customers submit a structured remote property assessment with photos and videos. Caliber receives a readiness score, estimated production cadence, recommended program, and pricing guidance.

## Features

### Customer Assessment
- Property information
- Operational conditions
- Condition scores
- Top issues
- Photo and video uploads
- Auto-generated readiness score
- Estimated rooms per day
- Recommended program type

### Internal Dashboard
- View submitted assessments
- Review readiness score and recommended pricing
- Download or review submitted files in Supabase
- Add internal notes and update status

## Deployment

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add Supabase project URL and anon key.
5. Run locally:

```bash
npm install
npm run dev
```

6. Push to GitHub.
7. Deploy to Netlify.
8. Set environment variables in Netlify.

## Netlify Notes

This package includes `netlify.toml` and uses the Netlify Next.js plugin.

## Supabase Notes

Keep RLS enabled. Public users can insert assessments and upload files. Only authenticated users can read assessments and files.

## Recommended Roadmap

### Phase 1
Customer assessment and uploads.

### Phase 2
Internal dashboard with authenticated review.

### Phase 3
Proposal generator.

### Phase 4
AI photo and video analysis.

## Suggested domain

assessment.caliberlodging.com

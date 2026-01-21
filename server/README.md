# Email API Server

Simple Express server for Gmail and Outlook integration.

## Setup

```bash
npm install
cp .env.example .env  # Add your OAuth credentials
npm run dev
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `/auth/google` | Start Google OAuth |
| `/auth/google/callback` | Returns access token |
| `/gmail` | List emails (Bearer token) |
| `/auth/microsoft` | Start Microsoft OAuth |
| `/auth/microsoft/callback` | Returns access token |
| `/outlook` | List emails (Bearer token) |

## Usage

1. Visit `/auth/google` to authenticate
2. Copy the `access_token` from the response
3. Fetch emails:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/gmail
```

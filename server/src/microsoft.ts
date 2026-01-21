import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';

const msalClient = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}`,
  },
});

const SCOPES = ['https://graph.microsoft.com/Mail.Read'];

export async function getAuthUrl(): Promise<string> {
  return msalClient.getAuthCodeUrl({
    scopes: SCOPES,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || '',
  });
}

export async function getTokens(code: string) {
  const result = await msalClient.acquireTokenByCode({
    code,
    scopes: SCOPES,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || '',
  });

  return {
    access_token: result.accessToken,
    expires_on: result.expiresOn,
  };
}

export async function listEmails(accessToken: string) {
  const client = Client.init({
    authProvider: (done) => done(null, accessToken),
  });

  const response = await client
    .api('/me/mailFolders/inbox/messages')
    .top(10)
    .select('id,subject,from,receivedDateTime,bodyPreview')
    .get();

  return (response.value || []).map((msg: any) => ({
    id: msg.id,
    subject: msg.subject,
    from: msg.from?.emailAddress?.address,
    date: msg.receivedDateTime,
    snippet: msg.bodyPreview,
  }));
}

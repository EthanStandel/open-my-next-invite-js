import { Environment } from "../environment";
import { openInBrowser } from "../utils/openInBrowser";
import { terminalPrompt } from "../utils/terminalPrompt";

import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export const oauthClient: Promise<OAuth2Client> =
  (async (): Promise<OAuth2Client> => {
    const {
      client_secret,
      client_id,
      redirect_uris: [redirect_uri],
    } = Environment.googleCalendar.credentials.installed;
    const oauthClient = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uri
    );

    const authUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      scope: Environment.googleCalendar.scopes,
    });

    openInBrowser(authUrl);

    const code = await terminalPrompt("Enter code: ");

    return await new Promise((resolve, reject) => {
      oauthClient.getToken(code, (error, token) => {
        if (error || !token) {
          console.error("Failed to retrieve access token", error);
          reject(error);
        } else {
          oauthClient.setCredentials(token);
          resolve(oauthClient);
        }
      });
    });
  })();

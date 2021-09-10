import { Environment } from "../environment";
import { BrowserUtils } from "../utils/BrowserUtils";
import { FileUtils } from "../utils/FileUtils";
import { TerminalUtils } from "../utils/TerminalUtils";

import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

const tokenStoragePath = "~/.open-my-next-invite-token";

export const OauthClient = {
  async create(): Promise<OAuth2Client> {
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

    if (await FileUtils.fileExists(tokenStoragePath)) {
      oauthClient.setCredentials(
        JSON.parse(await FileUtils.getFile(tokenStoragePath))
      );

      return oauthClient;
    }

    const authUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      scope: Environment.googleCalendar.scopes,
    });

    BrowserUtils.open(authUrl);

    const code = await TerminalUtils.prompt("Enter code: ");

    return await new Promise((resolve, reject) => {
      oauthClient.getToken(code, (error, token) => {
        if (error || !token) {
          console.error("Failed to retrieve access token", error);
          reject(error);
        } else {
          FileUtils.saveFile(tokenStoragePath, JSON.stringify(token));
          oauthClient.setCredentials(token);
          resolve(oauthClient);
        }
      });
    });
  },
};

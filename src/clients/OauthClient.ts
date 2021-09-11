import { Environment } from "../environment";
import { BrowserUtils } from "../utils/BrowserUtils";
import { FileUtils } from "../utils/FileUtils";
import { TerminalUtils } from "../utils/TerminalUtils";

import { OAuth2Client } from "google-auth-library";
import type { Credentials } from "google-auth-library";
import { google } from "googleapis";

const credentialsStoragePath = "~/.open-my-next-invite-credentials.json";

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

    // Save credentials file
    oauthClient.on("tokens", async credentials => {
      if (TerminalUtils.argExists("--no-save", "-ns")) {
        console.log("--no-save (-ns): Will not save credentials for later use");
      } else {
        try {
          await FileUtils.deleteFile(credentialsStoragePath);
        } catch {
          // Silent
        }
        await FileUtils.saveFile(
          credentialsStoragePath,
          JSON.stringify(credentials)
        );
      }
      oauthClient.setCredentials(credentials);
    });

    if (TerminalUtils.argExists("--new-user", "-nu")) {
      console.log("--new-user (-nu): Clearing user credentials");
      try {
        await FileUtils.deleteFile(credentialsStoragePath);
      } catch {
        // silent fail, we don't care
      }
    } else if (await FileUtils.fileExists(credentialsStoragePath)) {
      const credentials = JSON.parse(
        await FileUtils.getFile(credentialsStoragePath)
      ) as Credentials;
      oauthClient.setCredentials(credentials);
      return oauthClient;
    }

    const authUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      scope: Environment.googleCalendar.scopes,
    });

    BrowserUtils.open(authUrl);

    const code = await TerminalUtils.prompt("Enter code: ");

    return await new Promise((resolve, reject) => {
      oauthClient.getToken(code, async (error, credentials) => {
        if (error || !credentials) {
          console.error("Failed to retrieve access token", error);
          reject(error);
        } else {
          resolve(oauthClient);
        }
      });
    });
  },
};

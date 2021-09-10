import { Environment } from "../environment";
import { BrowserUtils } from "../utils/BrowserUtils";
import { FileUtils } from "../utils/FileUtils";
import { TerminalUtils } from "../utils/TerminalUtils";

import { OAuth2Client } from "google-auth-library";
import type { Credentials } from "google-auth-library";
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

    if (TerminalUtils.argExists("--new-user", "-nu")) {
      console.log("--new-user (-nu): Clearing user credentials");
      await FileUtils.deleteFile(tokenStoragePath);
    } else if (await FileUtils.fileExists(tokenStoragePath)) {
      const credentials = JSON.parse(
        await FileUtils.getFile(tokenStoragePath)
      ) as Credentials;
      if (new Date(credentials.expiry_date as number) > new Date()) {
        oauthClient.setCredentials(
          JSON.parse(await FileUtils.getFile(tokenStoragePath))
        );

        return oauthClient;
      } else {
        console.log("Client credentials expired.");
        await FileUtils.deleteFile(tokenStoragePath);
      }
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
          if (TerminalUtils.argExists("--no-save", "-ns")) {
            console.log(
              "--no-save (-ns): Will not save credentials for later use"
            );
          } else {
            FileUtils.saveFile(tokenStoragePath, JSON.stringify(token));
          }
          oauthClient.setCredentials(token);
          resolve(oauthClient);
        }
      });
    });
  },
};

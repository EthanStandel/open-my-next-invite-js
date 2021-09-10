import { exec } from "child_process";

export const openInBrowser = (url: string): void => {
  if (process.platform === "darwin") {
    exec(`open "${url}"`);
  } else {
    console.error(
      "Sorry, this app only supports auto-opening URLs with MacOS at the moment."
    );
    console.log(`Please open this URL and login:\n${url}`);
  }
};

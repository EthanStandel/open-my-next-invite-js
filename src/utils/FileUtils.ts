import { terminalPrompt } from "./terminalPrompt";

import fs from "fs";

export const FileUtils = {
  transformPath(path: string): string {
    if (path.startsWith("~")) {
      const userRootDir =
        process.env.HOME ?? process.env.HOMEPATH ?? process.env.USERPROFILE;

      if (!userRootDir) {
        const error = "Couldn't resolve path for ~";
        console.error(error);
        throw new Error(error);
      }

      return path.replace("~", userRootDir);
    } else {
      return path;
    }
  },
  async fileExists(path: string): Promise<boolean> {
    return fs.existsSync(this.transformPath(path));
  },
  async getFile(path: string): Promise<string> {
    return fs.readFileSync(this.transformPath(path), { encoding: "utf-8" });
  },
  async saveFile(
    inputPath: string,
    data: string,
    verifyOverwrite = true
  ): Promise<void> {
    const path = this.transformPath(inputPath);
    const fileExists = fs.existsSync(path);

    if (fileExists && verifyOverwrite) {
      if (
        (await terminalPrompt(`Overwrite "${path}"? (Y/n)\n`))
          .toUpperCase()
          .startsWith("Y")
      ) {
        fs.unlinkSync(path);
        fs.writeFileSync(path, data);
      }
    } else {
      fs.writeFileSync(path, data);
    }
  },
};

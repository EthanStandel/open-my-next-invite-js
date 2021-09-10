import readLine from "readline";

export const TerminalUtils = {
  rl: readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  }),

  prompt(request: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(request, response => {
        resolve(response);
      });
    });
  },

  argExists(...names: Array<string>): boolean {
    return process.argv.some(arg => names.some(name => arg === name));
  },
};

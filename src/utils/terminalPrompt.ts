import readLine from "readline";

export const terminalPrompt = (request: string): Promise<string> => {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(request, response => {
      rl.close();
      resolve(response);
    });
  });
};

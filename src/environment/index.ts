import env from "./env.json";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEnvironment {}

// This line just verifies the type of env.json
export const Environment: IEnvironment = env;

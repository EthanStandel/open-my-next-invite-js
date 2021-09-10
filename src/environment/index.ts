import env from "./env.json";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IEnvironment {
  // GCP Oauth2 ClientId file contents
  googleCalendar: {
    scopes: Array<string>;
    credentials: {
      installed: {
        client_id: string;
        project_id: string;
        auth_uri: string;
        token_uri: string;
        auth_provider_x509_cert_url: string;
        client_secret: string;
        redirect_uris: Array<string>;
      };
    };
  };
}

// This line just verifies the type of env.json
export const Environment: IEnvironment = env;

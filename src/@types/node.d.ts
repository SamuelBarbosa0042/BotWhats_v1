declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      readonly DISC_WEBHOOK: string;
    }
  }
}

export {};

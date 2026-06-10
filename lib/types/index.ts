export type ActionResponse<T = unknown, E = unknown> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | {
      success: false;
      message: string;
      errors?: {
        [K in keyof E]?: string[];
      };
      globalError?: string;
    };

export type ActionResponse<T = unknown> =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      errors: {
        [K in keyof T]?: string[];
      };
    };

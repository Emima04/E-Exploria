// Safe stub for Supabase client
export const supabase = {
  from: (_table: string) => ({
    select: (_cols?: string) => ({
      eq: (_col: string, _val: any) => ({
        order: (_col: string, _opts: any) => Promise.resolve({ data: [], error: null }),
      }),
    }),
    upsert: (_values: any, _options?: any) => Promise.resolve({ error: null }),
  }),
} as any;

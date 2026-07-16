import 'server-only';

import type { RequestHistoryInsert } from '@/lib/history/analytics';
import { recordRequestAnalytics } from '@/lib/history/analytics';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { RequestHistory } from '@/types/history';

export const db = {
  query: {
    requests: {
      findMany: async (userId: string): Promise<RequestHistory[]> => {
        try {
          const supabase = await createSupabaseServerClient();
          const { data, error } = await supabase
            .from('request_history')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });

          if (error) {
            throw new Error(error.message);
          }

          return (data ?? []) as RequestHistory[];
        } catch (err) {
          console.error('Failed to fetch history:', err);
          return [];
        }
      },
      insert: async (record: RequestHistoryInsert): Promise<void> => {
        const supabase = await createSupabaseServerClient();
        await recordRequestAnalytics(supabase, record);
      },
    },
  },
};

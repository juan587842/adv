import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useTenantId() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTenantId() {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('tenant_id')
            .eq('id', userData.user.id)
            .single();
          
          if (profile && profile.tenant_id) {
            setTenantId(profile.tenant_id);
          }
        }
      } catch (error) {
        console.error('Error fetching tenant ID:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTenantId();
  }, []);

  return { tenantId, loading };
}

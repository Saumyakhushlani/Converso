'use server';

import {auth} from '@clerk/nextjs/server';
import { createSupabaseClient } from '../supabase';

export const createCompanion = async (formData: CreateCompanion) => {
    const {userId: author} = await auth();
    const supabase = createSupabaseClient();
    const {data, error} = await supabase
        .from('companions')
        .insert({...formData, author})
        .select();

        if (error|| !data ) {
            throw new Error(error?.message||'Failed to create a companion');
        }
        return data[0];
}


export const GetAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient();
  let query = supabase.from("companions").select("*");

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }
  else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  }
  else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) {
    throw new Error(error?.message || "Failed to fetch companions");
  }

  return companions;
};


export const getCompanion = async (id: string) => {
  const supabase = createSupabaseClient();
  const { data: companion, error } = await supabase.from("companions").select("*").eq("id", id).single();
  if (error) {
    throw new Error(error?.message || "Failed to fetch companion");
  }
  return companion;
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    if(error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    
    if(!userId) {
        console.error('No userId found in newCompanionPermissions');
        return false;
    }

    const supabase = createSupabaseClient();

    // Check for subscription status in Supabase first (if you store it there)
    // This is a more reliable way to check subscriptions
    let userData = null;
    try {
        const { data } = await supabase
            .from('users')
            .select('subscription_plan, has_pro_plan')
            .eq('clerk_id', userId)
            .single();
        userData = data;
    } catch (err) {
        // Table might not exist or user might not be in the table - ignore
        console.log('Note: Could not check user subscription in database (this is okay)');
    }

    // If subscription is stored in database and user has pro
    if (userData?.has_pro_plan === true || userData?.subscription_plan === 'pro') {
        console.log('✅ User has pro plan (from database) - unlimited companions allowed');
        return true;
    }

    // Check for pro plan via Clerk has() method
    // Try different possible plan names and variations
    const hasProPlan = has({ plan: 'pro' }) 
        || has({ plan: 'Pro' }) 
        || has({ plan: 'PRO' })
        || has({ plan: 'pro_plan' })
        || has({ plan: 'premium' })
        || has({ plan: 'Premium' });
    
    // Also check organization metadata or features that indicate pro plan
    const hasProFeature = has({ feature: 'unlimited_companions' }) 
        || has({ feature: 'pro_plan' })
        || has({ feature: 'premium' });

    console.log('=== Companion Permission Check ===');
    console.log('User ID:', userId);
    console.log('Has plan "pro":', has({ plan: 'pro' }));
    console.log('Has plan "Pro":', has({ plan: 'Pro' }));
    console.log('Has plan "PRO":', has({ plan: 'PRO' }));
    console.log('Has pro plan (combined):', hasProPlan);
    console.log('Has pro feature:', hasProFeature);
    console.log('Database subscription status:', userData);
    
    // If user has pro plan or pro features, allow unlimited
    if(hasProPlan || hasProFeature) {
        console.log('✅ User has pro plan - unlimited companions allowed');
        return true;
    }

    // Set limits based on features
    let limit = 1; // Default free tier - allow 1 companion
    
    if(has({ feature: "10_active_companions" })) {
        limit = 10;
        console.log('User has 10_active_companions feature');
    } else if(has({ feature: "2_active_companions" })) {
        limit = 2;
        console.log('User has 2_active_companions feature');
    } else if(has({ feature: "2_active_companoins" })) { // Keep old typo for backward compatibility
        limit = 2;
        console.log('User has 2_active_companoins feature (typo variant)');
    } else {
        console.log('User on free tier - limit: 1 companion');
    }

    // Get current companion count for the user
    const { data, error, count } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if(error) {
        console.error('Error checking companion count:', error);
        throw new Error(error.message);
    }

    const companionCount = count ?? data?.length ?? 0;
    console.log(`User has ${companionCount} companions, limit is ${limit}`);

    // Return true if under limit, false if at or over limit
    const canCreate = companionCount < limit;
    console.log(`Can create companion: ${canCreate}`);
    console.log('=== End Permission Check ===');
    
    // TEMPORARY WORKAROUND: If you have pro plan but it's not being detected,
    // you can temporarily uncomment the line below to allow unlimited companions
    // This is for testing purposes - remove after proper subscription setup
    // TODO: Configure Clerk subscription properly or store subscription status in database
    // return true; // Uncomment this line to allow all users temporarily
    
    return canCreate;
}

// Supabase Client Wrapper
// This allows us to connect to a real database easily

const SupabaseService = {
    client: null,
    
    init: function() {
        const url = localStorage.getItem('sb_url');
        const key = localStorage.getItem('sb_key');
        
        if (url && key && window.supabase) {
            this.client = window.supabase.createClient(url, key);
            console.log('Supabase connected');
            return true;
        }
        return false;
    },

    isConnected: function() {
        return !!this.client;
    },

    // --- Sync Methods ---

    // 1. Sync User Profile
    async syncUser(localUser) {
        if (!this.client) return null;
        
        // Try to get remote user
        const { data: remoteUser, error } = await this.client
            .from('profiles')
            .select('*')
            .eq('email', localUser.email)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase error:', error);
            return null;
        }

        if (remoteUser) {
            // Merge: Remote takes precedence for timestamp check usually, 
            // but here we just return remote to update local
            return remoteUser;
        } else {
            // Create remote
            await this.client.from('profiles').insert(localUser);
            return localUser;
        }
    },

    // 2. Sync Projects
    async syncProjects(localProjects) {
        if (!this.client) return null;

        // Simple strategy: Fetch all remote, if empty -> upload local. 
        // If remote exists -> overwrite local (assuming cloud is truth).
        // A real sync engine is complex, this is a starter.
        
        const { data: remoteProjects, error } = await this.client
            .from('projects')
            .select('*');

        if (error) {
            console.error('Supabase error:', error);
            return null;
        }

        if (remoteProjects && remoteProjects.length > 0) {
            return remoteProjects;
        } else if (localProjects.length > 0) {
            // Upload local projects to cloud
            for (const p of localProjects) {
                // Ensure format matches DB schema (remove extra UI fields if any)
                await this.client.from('projects').insert(p);
            }
            return localProjects;
        }
        return [];
    }
};

// Expose
window.SupabaseService = SupabaseService;

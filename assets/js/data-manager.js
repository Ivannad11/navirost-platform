const DataManager = {
    PROJECTS_KEY: 'navirost_projects',
    CURRENT_PROJECT_KEY: 'navirost_current_project',
    USER_KEY: 'navirost_user_profile', // Changed from 'user' to avoid conflict/ambiguity, but need to migrate

    // --- User Management ---
    getUser: function() {
        // Fallback for legacy simple string 'user'
        const legacyUser = localStorage.getItem('user');
        const profile = localStorage.getItem(this.USER_KEY);
        
        if (profile) return JSON.parse(profile);
        
        if (legacyUser) {
            // Migrate
            const newUser = {
                name: legacyUser,
                company: '',
                city: '',
                email: 'user@example.com',
                plan: 'Pro Plan', // Add plan
                onboarding: {
                    projectCreated: false,
                    unitCalc: false,
                    docGenerated: false
                }
            };
            this.saveUser(newUser);
            return newUser;
        }
        return null;
    },

    saveUser: function(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        // Keep legacy key for simple auth checks in other files
        localStorage.setItem('user', user.name); 
        
        // Sync
        if (window.SupabaseService && window.SupabaseService.isConnected()) {
            window.SupabaseService.syncUser(user);
        }
    },

    updateUserOnboarding: function(key) {
        const user = this.getUser();
        if (user && user.onboarding && !user.onboarding[key]) {
            user.onboarding[key] = true;
            this.saveUser(user);
            return true; // status changed
        }
        return false;
    },

    // --- Project Management ---
    getProjects: function() {
        const data = localStorage.getItem(this.PROJECTS_KEY);
        return data ? JSON.parse(data) : [];
    },

    getCurrentProjectId: function() {
        return localStorage.getItem(this.CURRENT_PROJECT_KEY);
    },

    setCurrentProjectId: function(id) {
        if (id) {
            localStorage.setItem(this.CURRENT_PROJECT_KEY, id);
        } else {
            localStorage.removeItem(this.CURRENT_PROJECT_KEY);
        }
    },

    getProject: function(id) {
        const projects = this.getProjects();
        return projects.find(p => p.id === id);
    },

    createProject: function(name) {
        const projects = this.getProjects();
        const newProject = {
            id: 'proj_' + Date.now(),
            name: name,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            unitData: null,
            pnlData: null,
            stats: {
                revenue: 0,
                profit: 0,
                margin: 0
            }
        };
        projects.push(newProject);
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
        
        // Update Onboarding
        this.updateUserOnboarding('projectCreated');

        // Sync
        if (window.SupabaseService && window.SupabaseService.isConnected()) {
            window.SupabaseService.syncProjects(projects);
        }
        
        return newProject;
    },

    updateProject: function(id, type, data) {
        const projects = this.getProjects();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index].updated = new Date().toISOString();
            
            if (type === 'unit') {
                projects[index].unitData = data;
                if (data.margin) projects[index].stats.margin = data.margin;
                this.updateUserOnboarding('unitCalc');
            } else if (type === 'pnl') {
                projects[index].pnlData = data;
                if (data.revenue) projects[index].stats.revenue = data.revenue;
                if (data.profit) projects[index].stats.profit = data.profit;
            }
            
            localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
            
            // Sync
            if (window.SupabaseService && window.SupabaseService.isConnected()) {
                window.SupabaseService.syncProjects(projects);
            }

            return projects[index];
        }
        return null;
    },

    deleteProject: function(id) {
        const projects = this.getProjects();
        const filteredProjects = projects.filter(p => p.id !== id);
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(filteredProjects));
        
        // Sync
        if (window.SupabaseService && window.SupabaseService.isConnected()) {
            // Note: Simplistic sync just pushes current state. 
            // Real sync needs to handle deletes explicitly (soft delete or ID tracking).
            // But for MVP overwriting works if we trust client is truth.
            window.SupabaseService.syncProjects(filteredProjects);
        }
        
        // If the deleted project was current, clear current project
        const currentProjectId = this.getCurrentProjectId();
        if (currentProjectId === id) {
            localStorage.removeItem(this.CURRENT_PROJECT_KEY);
        }
    },

    formatDate: function(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 86400000) {
            if (diff < 3600000) return 'Только что';
            const hours = Math.floor(diff / 3600000);
            return `${hours} ч. назад`;
        }
        return date.toLocaleDateString('ru-RU');
    },

    formatMoney: function(amount) {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(amount);
    },

    // --- DB Sync ---
    syncWithDatabase: async function() {
        if (!window.SupabaseService || !window.SupabaseService.isConnected()) return;
        
        console.log('Syncing with database...');
        
        // Sync User
        const localUser = this.getUser();
        if (localUser) {
            const remoteUser = await window.SupabaseService.syncUser(localUser);
            if (remoteUser) {
                // Update local with merged/remote data (e.g. if logged in elsewhere)
                // Avoid infinite loop by not calling saveUser directly if possible, or just accept it.
                // Here we just update storage directly to avoid triggering another sync immediately if logic is simple.
                localStorage.setItem(this.USER_KEY, JSON.stringify(remoteUser));
            }
        }

        // Sync Projects
        const localProjects = this.getProjects();
        const remoteProjects = await window.SupabaseService.syncProjects(localProjects);
        if (remoteProjects) {
            localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(remoteProjects));
            // Trigger UI refresh if needed (reload page)
            // window.location.reload(); // Aggressive but effective
        }
        
        console.log('Sync complete');
        return true;
    }
};

window.DataManager = DataManager;

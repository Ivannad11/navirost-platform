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
            return projects[index];
        }
        return null;
    },

    deleteProject: function(id) {
        const projects = this.getProjects();
        const filteredProjects = projects.filter(p => p.id !== id);
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(filteredProjects));
        
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
    }
};

window.DataManager = DataManager;

document.addEventListener('DOMContentLoaded', () => {
    // Ensure AppConfig is loaded
    if (typeof AppConfig === 'undefined') {
        console.error('AppConfig not loaded. Sidebar cannot render.');
        return;
    }
    renderSidebar();
});

function resolvePath(path) {
    if (!path || path.startsWith('/') || path.startsWith('http') || path.startsWith('#')) return path;
    
    // Check if we are in a subdirectory (tools or resources) inside platform
    const currentPath = window.location.pathname;
    // Simple heuristic: count how deep we are relative to platform root
    // If we are in /platform/tools/unit.html, we need ../ for assets
    // But this function is for links.
    
    if (currentPath.includes('/tools/') || currentPath.includes('/resources/') || currentPath.includes('/auth/')) {
        return '../' + path;
    }
    return path;
}

function renderSidebar() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    navMenu.innerHTML = '';

    // 1. Main Category (Home)
    const mainModules = AppConfig.modules.filter(m => m.category === 'main' && m.showInSidebar);
    mainModules.forEach(m => navMenu.appendChild(createNavItem(m)));

    // 2. My Projects (Accordion)
    const projects = typeof DataManager !== 'undefined' ? DataManager.getProjects() : [];
    const currentPid = typeof DataManager !== 'undefined' ? DataManager.getCurrentProjectId() : null;
    
    // Create Project Group Header
    const projectLi = document.createElement('li');
    projectLi.className = 'nav-item';
    projectLi.style.marginTop = '24px';
    
    // Group Title
    const projTitle = document.createElement('div');
    projTitle.style.padding = '0 12px 8px';
    projTitle.style.fontSize = '11px';
    projTitle.style.fontWeight = '600';
    projTitle.style.color = 'var(--text-tertiary)';
    projTitle.style.textTransform = 'uppercase';
    projTitle.innerText = 'Проекты';
    projectLi.appendChild(projTitle);

    // Projects List Container
    const projList = document.createElement('div');
    projList.id = 'sidebar-projects-list';
    
    if (projects.length === 0) {
        const empty = document.createElement('div');
        empty.style.padding = "4px 12px";
        empty.style.fontSize = "12px";
        empty.style.color = "var(--text-tertiary)";
        empty.innerText = "Нет проектов";
        projList.appendChild(empty);
    } else {
        projects.forEach(p => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = `nav-link ${p.id === currentPid ? 'active' : ''}`;
            // Small dot indicator
            link.innerHTML = `
                <span style="width:6px;height:6px;border-radius:50%;background:${p.id === currentPid ? 'var(--primary)' : 'var(--border-strong)'};margin-right:8px;"></span>
                ${p.name}
            `;
            link.onclick = (e) => {
                e.preventDefault();
                DataManager.setCurrentProjectId(p.id);
                window.location.href = resolvePath('project.html');
            };
            projList.appendChild(link);
        });
    }
    projectLi.appendChild(projList);

    // New Project Button
    const newProjButton = document.createElement('a');
    newProjButton.href = '#';
    newProjButton.className = 'nav-link';
    newProjButton.style.color = 'var(--text-tertiary)';
    newProjButton.innerHTML = '<span>+</span> Новый проект';
    newProjButton.onclick = (e) => {
        e.preventDefault();
        if (typeof createNewProject === 'function') {
            createNewProject();
        } else if (typeof Modal !== 'undefined') {
            Modal.prompt('Новый проект', 'Введите название:', (name) => {
                DataManager.createProject(name);
                window.location.reload();
            });
        }
    };
    projectLi.appendChild(newProjButton);
    navMenu.appendChild(projectLi);


    // 3. Tools (Group)
    const toolModules = AppConfig.modules.filter(m => m.category === 'tools' && m.showInSidebar);
    if (toolModules.length > 0) {
        const toolsLi = document.createElement('li');
        toolsLi.className = 'nav-item';
        toolsLi.style.marginTop = '24px';
        
        const toolsTitle = document.createElement('div');
        toolsTitle.style.padding = '0 12px 8px';
        toolsTitle.style.fontSize = '11px';
        toolsTitle.style.fontWeight = '600';
        toolsTitle.style.color = 'var(--text-tertiary)';
        toolsTitle.style.textTransform = 'uppercase';
        toolsTitle.innerText = 'Инструменты';
        toolsLi.appendChild(toolsTitle);
        
        toolModules.forEach(m => {
            const a = document.createElement('a');
            a.href = resolvePath(m.url);
            
            let isActive = false;
            const currentPath = window.location.pathname;
            if (currentPath.includes(m.url)) isActive = true;
            
            a.className = `nav-link ${isActive ? 'active' : ''}`;
            a.innerHTML = `<span>${m.icon}</span> ${m.title}`;
            toolsLi.appendChild(a);
        });
        navMenu.appendChild(toolsLi);
    }

    // 4. Resources (Group)
    const resModules = AppConfig.modules.filter(m => m.category === 'resources' && m.showInSidebar);
    if (resModules.length > 0) {
        const resLi = document.createElement('li');
        resLi.className = 'nav-item';
        resLi.style.marginTop = '24px';
        
        const resTitle = document.createElement('div');
        resTitle.style.padding = '0 12px 8px';
        resTitle.style.fontSize = '11px';
        resTitle.style.fontWeight = '600';
        resTitle.style.color = 'var(--text-tertiary)';
        resTitle.style.textTransform = 'uppercase';
        resTitle.innerText = 'Ресурсы';
        resLi.appendChild(resTitle);
        
        resModules.forEach(m => {
            const a = document.createElement('a');
            a.href = resolvePath(m.url);
            let isActive = window.location.pathname.includes(m.url);
            a.className = `nav-link ${isActive ? 'active' : ''}`;
            a.innerHTML = `<span>${m.icon}</span> ${m.title}`;
            resLi.appendChild(a);
        });
        navMenu.appendChild(resLi);
    }
    
    // 5. User Profile (Append to sidebar bottom if not present)
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !sidebar.querySelector('.user-profile')) {
        const user = typeof DataManager !== 'undefined' ? DataManager.getUser() : null;
        if (user) {
            const profile = document.createElement('div');
            profile.className = 'user-profile';
            profile.onclick = () => window.location.href = resolvePath('settings.html');
            profile.innerHTML = `
                <div class="avatar">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                <div class="user-info">
                    <div class="user-name">${user.name || 'User'}</div>
                    <div class="user-plan">${user.plan || 'Free Plan'}</div>
                </div>
            `;
            sidebar.appendChild(profile);
        }
    }
}

function createNavItem(module) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    
    const a = document.createElement('a');
    a.href = resolvePath(module.url);
    
    let isActive = false;
    const currentPath = window.location.pathname;
    
    // Special case for home
    if (module.id === 'home' && (currentPath.endsWith('/platform/') || currentPath.endsWith('home.html'))) {
        isActive = true;
    } else if (currentPath.includes(module.url) && module.id !== 'home') {
        isActive = true;
    }

    a.className = `nav-link ${isActive ? 'active' : ''}`;
    a.innerHTML = `<span>${module.icon}</span> ${module.title}`;
    
    li.appendChild(a);
    return li;
}

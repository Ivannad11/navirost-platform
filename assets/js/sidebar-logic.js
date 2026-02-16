document.addEventListener('DOMContentLoaded', () => {
    // Ensure AppConfig is loaded
    if (typeof AppConfig === 'undefined') {
        console.error('AppConfig not loaded. Sidebar cannot render.');
        return;
    }
    renderSidebar();
});

function renderSidebar() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    navMenu.innerHTML = '';

    // 1. Main Category
    const mainModules = AppConfig.modules.filter(m => m.category === 'main' && m.showInSidebar);
    mainModules.forEach(m => navMenu.appendChild(createNavItem(m)));

    // 2. My Projects (Accordion)
    const projects = typeof DataManager !== 'undefined' ? DataManager.getProjects() : [];
    const currentPid = typeof DataManager !== 'undefined' ? DataManager.getCurrentProjectId() : null;
    
    const projectsGroup = document.createElement('li');
    projectsGroup.className = `nav-group ${projects.length > 0 ? 'open' : ''}`;
    
    const header = document.createElement('div');
    header.className = 'nav-group-header';
    header.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
            <span>🚀</span>
            <span>Мои Проекты</span>
        </div>
        <span class="nav-arrow">▼</span>
    `;
    header.onclick = () => projectsGroup.classList.toggle('open');
    
    const subMenu = document.createElement('div');
    subMenu.className = 'nav-sub-menu';
    
    if (projects.length === 0) {
        const empty = document.createElement('div');
        empty.style.padding = "8px 16px";
        empty.style.fontSize = "12px";
        empty.style.color = "var(--text-tertiary)";
        empty.innerText = "Нет проектов";
        subMenu.appendChild(empty);
    } else {
        projects.forEach(p => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = `nav-sub-link ${p.id === currentPid ? 'active' : ''}`;
            link.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:${p.id === currentPid ? '#3B82F6' : '#CBD5E1'};"></span> ${p.name}`;
            link.onclick = (e) => {
                e.preventDefault();
                DataManager.setCurrentProjectId(p.id);
                window.location.href = '/platform/project.html';
            };
            subMenu.appendChild(link);
        });
    }
    
    // Add "New Project" button
    const addBtn = document.createElement('div');
    addBtn.className = 'nav-sub-link';
    addBtn.style.color = '#3B82F6';
    addBtn.style.cursor = 'pointer';
    addBtn.innerHTML = '<span>+</span> Новый проект';
    addBtn.onclick = () => {
        if (typeof createNewProject === 'function') {
            createNewProject();
        } else if (typeof Modal !== 'undefined' && typeof DataManager !== 'undefined') {
            Modal.prompt('Новый проект', 'Введите название:', (name) => {
                DataManager.createProject(name);
                window.location.reload(); // Fallback reload to refresh sidebar
            });
        }
    };
    subMenu.appendChild(addBtn);

    projectsGroup.appendChild(header);
    projectsGroup.appendChild(subMenu);
    navMenu.appendChild(projectsGroup);

    // 3. Tools
    const toolModules = AppConfig.modules.filter(m => m.category === 'tools' && m.showInSidebar);
    toolModules.forEach(m => navMenu.appendChild(createNavItem(m)));

    // 4. Resources
    const resModules = AppConfig.modules.filter(m => m.category === 'resources' && m.showInSidebar);
    resModules.forEach(m => navMenu.appendChild(createNavItem(m)));
    
    // 5. System (Settings)
    const sysModules = AppConfig.modules.filter(m => m.category === 'system' && m.showInSidebar);
    sysModules.forEach(m => {
        const item = createNavItem(m);
        item.style.marginTop = 'auto'; // Push to bottom
        navMenu.appendChild(item);
    });

    // 6. User Profile
    const user = typeof DataManager !== 'undefined' ? DataManager.getUser() : null;
    if (user) {
        let userProfile = navMenu.parentElement.querySelector('.user-profile');
        if (!userProfile) {
            userProfile = document.createElement('div');
            userProfile.className = 'user-profile';
            navMenu.parentElement.appendChild(userProfile);
        }
        userProfile.onclick = () => window.location.href = '/platform/settings.html';
        userProfile.innerHTML = `
            <div class="avatar">${user.name ? user.name.charAt(0).toUpperCase() : ''}</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-role">${user.plan || 'Free Plan'}</div>
            </div>
        `;
    }
}

function createNavItem(module) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    
    const a = document.createElement('a');
    a.href = module.url;
    
    let isActive = false;
    const href = module.url;
    
    // Special case for home
    if (href === '/platform/home.html' && (window.location.pathname.endsWith('/') || window.location.pathname.includes('home.html'))) {
        isActive = true;
    }
    
    // Add active class if pathname matches
    if (window.location.pathname.includes(href)) isActive = true;

    a.className = `nav-link ${isActive ? 'active' : ''}`;
    a.innerHTML = `<span>${module.icon}</span><span>${module.title}</span>`;
    
    li.appendChild(a);
    return li;
}

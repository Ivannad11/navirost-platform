document.addEventListener('DOMContentLoaded', () => {
    // Ensure AppConfig is loaded
    if (typeof AppConfig === 'undefined') {
        console.error('AppConfig not loaded. Sidebar cannot render.');
        return;
    }
    renderSidebar();
});

function resolvePath(targetPath) {
    if (!targetPath || targetPath.startsWith('/') || targetPath.startsWith('http') || targetPath.startsWith('#')) return targetPath;
    
    const currentPath = window.location.pathname;
    
    // Scenarios:
    // 1. /platform/home.html -> target: tools/unit.html => tools/unit.html
    // 2. /platform/tools/unit.html -> target: home.html => ../home.html
    // 3. /platform/tools/unit.html -> target: tools/pnl.html => ../tools/pnl.html (works)
    // 4. /index.html (Landing) -> target: platform/home.html => platform/home.html
    // 5. /tools/unit-economics.html (Public) -> target: tools/pnl.html => pnl.html
    
    // Check if we are in a subdirectory of platform
    const isPlatform = currentPath.includes('/platform/');
    const isTools = currentPath.includes('/platform/tools/');
    const isAuth = currentPath.includes('/auth/');
    const isPublicTools = currentPath.includes('/tools/') && !isPlatform;
    
    if (isTools) {
        return '../' + targetPath;
    }
    
    if (isAuth) {
        return '../platform/' + targetPath; 
    }

    if (isPublicTools) {
        // We are in public tools folder e.g. /tools/
        // If target is 'tools/foo.html', we need just 'foo.html'
        if (targetPath.startsWith('tools/')) {
            return targetPath.replace('tools/', '');
        }
        // If target is 'platform/foo.html' (e.g. login), go up
        return '../' + targetPath;
    }

    return targetPath;
}

function renderSidebar() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    navMenu.innerHTML = '';
    const user = typeof DataManager !== 'undefined' ? DataManager.getUser() : null;
    const currentPath = window.location.pathname;
    
    // Logic:
    // 1. If user is NOT logged in -> Guest Sidebar
    // 2. If user IS logged in, but is on a PUBLIC page (not in /platform/) -> Guest Sidebar
    // 3. If user IS logged in, and is on a PLATFORM page (in /platform/) -> Auth Sidebar

    const isPlatformPage = currentPath.includes('/platform/');
    
    // Force guest sidebar if not on platform page, even if logged in
    if (!user || !isPlatformPage) {
        renderGuestSidebar(navMenu);
        return;
    }

    // --- AUTHENTICATED MODE (Only on Platform pages) ---
    renderAuthSidebar(navMenu);
}

function renderGuestSidebar(navMenu) {
    // 1. Back Button (Top)
    const backLi = document.createElement('li');
    backLi.className = 'nav-item';
    backLi.style.marginBottom = '12px';
    
    // Determine path to root index.html
    let backUrl = '../index.html'; // Default from platform/
    if (window.location.pathname.includes('/tools/')) {
        backUrl = '../../index.html'; // From platform/tools/
    }
    
    backLi.innerHTML = `<a href="${backUrl}" class="nav-link" style="color:var(--text-tertiary)"><span>←</span> Назад</a>`;
    navMenu.appendChild(backLi);

    // 2. Calculators Dropdown
    const toolsModule = AppConfig.modules.find(m => m.id === 'tools');
    if (toolsModule && toolsModule.children) {
        const li = document.createElement('li');
        li.className = 'nav-item has-submenu open'; // Default open for guest
        
        // Parent Item
        const div = document.createElement('div');
        div.className = 'nav-link parent';
        div.innerHTML = `
            <div style="display:flex; align-items:center;">
                ${toolsModule.title}
            </div>
            <span class="arrow">▼</span>
        `;
        div.onclick = (e) => {
            e.preventDefault();
            li.classList.toggle('open');
            // Toggle submenu display directly if CSS doesn't handle it
            const submenu = li.querySelector('.submenu');
            if (submenu) {
                submenu.style.display = li.classList.contains('open') ? 'block' : 'none';
            }
        };
        li.appendChild(div);

        // Submenu
        const ul = document.createElement('ul');
        ul.className = 'submenu';
        ul.style.display = 'block'; // Force display since we start open
        
        toolsModule.children.forEach(tool => {
            const subLi = document.createElement('li');
            const subA = document.createElement('a');
            
            // Fix path resolution for public tools
            let finalUrl = resolvePath(tool.url);
            
            subA.href = finalUrl;
            subA.className = 'nav-link';
            
            // Robust active check
            const toolFilename = tool.url.split('/').pop();
            if (window.location.pathname.endsWith(toolFilename)) {
                subA.classList.add('active');
            }
            
            subA.innerHTML = tool.title;
            subLi.appendChild(subA);
            ul.appendChild(subLi);
        });
        
        li.appendChild(ul);
        navMenu.appendChild(li);
    }

    // 3. Remove any existing CTA if present (cleanup)
    const sidebar = document.querySelector('.sidebar');
    const existingCta = sidebar.querySelector('.guest-cta');
    if (existingCta) existingCta.remove();
}

function renderAuthSidebar(navMenu) {
    AppConfig.modules.forEach(module => {
        if (!module.showInSidebar) return;
        if (module.category === 'footer') return; // Render footer items separately or at end? 
        // Actually typically settings is at bottom, but let's just render in order for now or separate
        
        if (module.children) {
            // Dropdown Menu
            const li = document.createElement('li');
            li.className = 'nav-item has-submenu';
            
            // Check if any child is active to open menu by default
            let isActive = false;
            if (module.id === 'projects') {
                 // Check if we are on project page
                 if (window.location.pathname.includes('project.html') || window.location.pathname.includes('projects.html')) isActive = true;
            } else {
                module.children.forEach(child => {
                    if (child.url && window.location.pathname.includes(child.url)) isActive = true;
                });
            }
            
            if (isActive) {
                li.classList.add('open');
            }

            // Parent Item
            const div = document.createElement('div');
            div.className = 'nav-link parent';
            div.innerHTML = `
                <div style="display:flex; align-items:center;">
                    ${module.title}
                </div>
                <span class="arrow">▼</span>
            `;
            div.onclick = (e) => {
                e.preventDefault();
                li.classList.toggle('open');
                // Explicitly toggle submenu visibility for Auth Sidebar as well
                const submenu = li.querySelector('.submenu');
                if (submenu) {
                    submenu.style.display = li.classList.contains('open') ? 'block' : 'none';
                }
            };
            li.appendChild(div);

            // Submenu
            const ul = document.createElement('ul');
            ul.className = 'submenu';
            // Force display if open
            if (isActive) {
                ul.style.display = 'block';
            }

            // Populate Submenu
            if (module.id === 'projects') {
                renderProjectsSubmenu(ul);
            } else {
                module.children.forEach(child => {
                    const subLi = document.createElement('li');
                    const subA = document.createElement('a');
                    subA.href = resolvePath(child.url);
                    subA.className = 'nav-link';
                    if (child.url && window.location.pathname.includes(child.url)) subA.classList.add('active');
                    
                    subA.innerHTML = child.title;
                    subLi.appendChild(subA);
                    ul.appendChild(subLi);
                });
            }
            li.appendChild(ul);
            navMenu.appendChild(li);

        } else {
            // Standard Item
            navMenu.appendChild(createNavItem(module));
        }
    });

    // Footer Items (Settings, etc)
    const footerModules = AppConfig.modules.filter(m => m.category === 'footer');
    if (footerModules.length > 0) {
        const divider = document.createElement('div');
        divider.style.height = '1px';
        divider.style.background = 'var(--border-subtle)';
        divider.style.margin = '12px 16px';
        navMenu.appendChild(divider);
        
        footerModules.forEach(m => navMenu.appendChild(createNavItem(m)));
    }
    
    // User Profile
    renderUserProfile();
}

function renderProjectsSubmenu(ul) {
    const projects = typeof DataManager !== 'undefined' ? DataManager.getProjects() : [];
    const currentPid = typeof DataManager !== 'undefined' ? DataManager.getCurrentProjectId() : null;

    // 1. "All Projects" link
    const allLi = document.createElement('li');
    allLi.innerHTML = `<a href="projects.html" class="nav-link ${window.location.pathname.includes('projects.html') ? 'active' : ''}">Все проекты</a>`;
    ul.appendChild(allLi);

    // 2. Project List
    if (projects.length > 0) {
        projects.forEach(p => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.className = `nav-link ${p.id === currentPid ? 'active' : ''}`;
            a.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:${p.color || 'var(--primary)'};margin-right:8px; display:inline-block;"></span>${p.name}`;
            
            a.onclick = (e) => {
                e.preventDefault();
                DataManager.setCurrentProjectId(p.id);
                // If we are already on project.html, reload? Or just redirect
                window.location.href = 'project.html'; // Assuming project.html handles loading current project
            };
            li.appendChild(a);
            ul.appendChild(li);
        });
    }

    // 3. New Project Action
    const newLi = document.createElement('li');
    newLi.innerHTML = `<a href="#" class="nav-link" style="color:var(--text-primary); font-weight:500;">+ Новый проект</a>`;
    newLi.onclick = (e) => {
        e.preventDefault();
        createNewProjectGlobal();
    };
    ul.appendChild(newLi);
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
    } else if (module.url && currentPath.includes(module.url) && module.id !== 'home') {
        isActive = true;
    }

    a.className = `nav-link ${isActive ? 'active' : ''}`;
    a.innerHTML = `<span>${module.title}</span>`;
    
    li.appendChild(a);
    return li;
}

function renderUserProfile() {
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

// Global Helper for creating project
function createNewProjectGlobal() {
    if (typeof DataManager === 'undefined') return;
    
    const name = prompt('Название нового проекта:');
    if (name) {
        DataManager.createProject(name);
        // Refresh sidebar
        renderSidebar();
        // Go to new project
        // DataManager automatically sets current project on create? No, check implementation.
        // Usually we want to switch to it.
        const projects = DataManager.getProjects();
        const newProj = projects[projects.length - 1]; // Assuming appended
        if (newProj) {
            DataManager.setCurrentProjectId(newProj.id);
            window.location.href = 'project.html';
        }
    }
}

// ===== EDUCONNECT - APLICAÇÃO PRINCIPAL =====

// Variáveis globais
let mentorsData = [];
let currentMentors = [];
let favoriteMentors = JSON.parse(localStorage.getItem('favoriteMentors')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let userGroups = JSON.parse(localStorage.getItem('userGroups')) || [];
let sharedMaterials = JSON.parse(localStorage.getItem('sharedMaterials')) || [];
let currentPage = 1;
const mentorsPerPage = 6;

// Dados dos grupos de estudo (mock)
const studyGroups = [
    {
        id: 1,
        title: "JavaScript Avançado",
        description: "Grupo para estudar conceitos avançados de JavaScript como closures, promises e async/await.",
        tags: ["JavaScript", "Programação", "Web"],
        materials: [
            { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide" },
            { title: "You Don't Know JS", url: "https://github.com/getify/You-Dont-Know-JS" },
            { title: "JavaScript.info", url: "https://javascript.info/" }
        ]
    },
    {
        id: 2,
        title: "Data Science com Python",
        description: "Explorando análise de dados, machine learning e visualização usando Python.",
        tags: ["Python", "Data Science", "ML"],
        materials: [
            { title: "Python Data Science Handbook", url: "https://jakevdp.github.io/PythonDataScienceHandbook/" },
            { title: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
            { title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" },
            { title: "Scikit-learn Tutorials", url: "https://scikit-learn.org/stable/tutorial/" }
        ]
    },
    {
        id: 3,
        title: "UX/UI Design Moderno",
        description: "Discussões sobre tendências, ferramentas e metodologias em design de interfaces.",
        tags: ["Design", "UX", "UI"],
        materials: [
            { title: "Laws of UX", url: "https://lawsofux.com/" },
            { title: "Figma Academy", url: "https://www.figma.com/academy/" },
            { title: "Material Design", url: "https://material.io/design" }
        ]
    },
    {
        id: 4,
        title: "Preparação ENEM",
        description: "Grupo de estudos focado na preparação para o ENEM com cronograma e simulados.",
        tags: ["ENEM", "Vestibular", "Educação"],
        materials: [
            { title: "Questões ENEM", url: "https://www.gov.br/inep/pt-br" },
            { title: "Redação ENEM", url: "https://redacaoenem.com.br/" },
            { title: "Khan Academy", url: "https://pt.khanacademy.org/" },
            { title: "Brasil Escola", url: "https://brasilescola.uol.com.br/" }
        ]
    },
    {
        id: 5,
        title: "Inglês para Negócios",
        description: "Prática de inglês voltada para o ambiente corporativo e apresentações.",
        tags: ["Inglês", "Business", "Carreira"],
        materials: [
            { title: "Business English Pod", url: "https://www.businessenglishpod.com/" },
            { title: "Harvard Business Review", url: "https://hbr.org/" },
            { title: "TED Talks Business", url: "https://www.ted.com/topics/business" }
        ]
    }
];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('EduConnect iniciado');
    
    // Inicializar componentes
    initializeApp();
    checkAuthentication();
    loadMentors();
    initializeEventListeners();
    updateFavoritesDisplay();
    populateMentorSelect();
    renderStudyGroups();
    checkActiveMentorship();
    
    console.log('App inicializado com sucesso');
});

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
function initializeApp() {
    // Configurar data mínima para agendamento (hoje)
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        dateInput.min = today;
    }
    
    // Configurar contador de caracteres
    const messageTextarea = document.getElementById('booking-message');
    const counter = document.getElementById('message-counter');
    
    if (messageTextarea && counter) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            counter.textContent = `${count}/500 caracteres`;
            if (count > 400) {
                counter.style.color = count > 500 ? '#dc2626' : '#d97706';
            } else {
                counter.style.color = '#64748b';
            }
        });
    }
}

// ===== CARREGAMENTO DE DADOS =====
async function loadMentors() {
    const loadingSkeleton = document.getElementById('loading-skeleton');
    const mentorsGrid = document.getElementById('mentors-grid');
    const errorState = document.getElementById('error-state');
    
    try {
        // Mostrar skeleton
        if (loadingSkeleton) loadingSkeleton.style.display = 'grid';
        if (mentorsGrid) mentorsGrid.innerHTML = '';
        if (errorState) errorState.style.display = 'none';
        
        // Simular delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch('./data/mentors.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        mentorsData = data.mentors || [];
        currentMentors = [...mentorsData];
        
        // Esconder skeleton
        if (loadingSkeleton) loadingSkeleton.style.display = 'none';
        
        // Renderizar mentores
        renderMentors();
        populateAreaFilter();
        updateResultsCount();
        
        console.log(`${mentorsData.length} mentores carregados`);
        
    } catch (error) {
        console.error('Erro ao carregar mentores:', error);
        
        // Esconder skeleton e mostrar erro
        if (loadingSkeleton) loadingSkeleton.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
        
        // Configurar botão de retry
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.onclick = () => loadMentors();
        }
    }
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Navegação mobile
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            hamburger.classList.toggle('active');
            
            // Atualizar aria-expanded
            const isExpanded = navMenu.classList.contains('show');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Busca e filtros
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const areaFilter = document.getElementById('area-filter');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const attendanceFilter = document.getElementById('attendance-filter');
    const sortFilter = document.getElementById('sort-filter');
    const clearFilters = document.getElementById('clear-filters');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
    
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
    if (areaFilter) areaFilter.addEventListener('change', applyFilters);
    if (priceMin) priceMin.addEventListener('input', debounce(applyFilters, 500));
    if (priceMax) priceMax.addEventListener('input', debounce(applyFilters, 500));
    if (attendanceFilter) attendanceFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            // Limpar todos os campos
            if (searchInput) searchInput.value = '';
            if (areaFilter) areaFilter.value = '';
            if (priceMin) priceMin.value = '';
            if (priceMax) priceMax.value = '';
            if (attendanceFilter) attendanceFilter.value = '';
            if (sortFilter) sortFilter.value = 'rating';
            
            // Reaplicar filtros
            applyFilters();
        });
    }
    
    // Botão carregar mais
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreMentors);
    }
    
    // Modal
    const modal = document.getElementById('mentor-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBookBtn = document.getElementById('modal-book-btn');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Formulário de agendamento
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Grupos de estudo
    const groupsSearch = document.getElementById('groups-search');
    const groupsTagFilter = document.getElementById('groups-tag-filter');
    
    if (groupsSearch) {
        groupsSearch.addEventListener('input', debounce(filterGroups, 300));
    }
    
    if (groupsTagFilter) {
        groupsTagFilter.addEventListener('change', filterGroups);
    }
}

// ===== RENDERIZAÇÃO DE MENTORES =====
function renderMentors() {
    const mentorsGrid = document.getElementById('mentors-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (!mentorsGrid) return;
    
    // Calcular mentores para a página atual
    const startIndex = (currentPage - 1) * mentorsPerPage;
    const endIndex = startIndex + mentorsPerPage;
    const mentorsToShow = currentMentors.slice(0, endIndex);
    
    if (mentorsToShow.length === 0) {
        mentorsGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    mentorsGrid.innerHTML = mentorsToShow.map(mentor => createMentorCard(mentor)).join('');
    
    // Atualizar botão "Carregar mais"
    updateLoadMoreButton();
    updatePaginationInfo();
}

function createMentorCard(mentor) {
    const isFavorite = favoriteMentors.includes(mentor.id);
    const stars = '★'.repeat(Math.floor(mentor.rating)) + '☆'.repeat(5 - Math.floor(mentor.rating));
    
    return `
        <div class="mentor-card" role="gridcell" tabindex="0">
            <div class="mentor-card-header">
                <img src="${mentor.photo}" alt="Foto de ${mentor.name}" class="mentor-avatar" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNkMWQ1ZGIiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxOCIgeT0iMTgiPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCAxMiA0QzkuNzkwODYgNCA4IDUuNzkwOSA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC4xMzQwMSAxNCA1IDE3LjEzNCA1IDIxSDMxOVYyMUMxOSAxNy4xMzQgMTUuODY2IDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cgo8L3N2Zz4='"
                     loading="lazy">
                <div class="mentor-info">
                    <h3>${mentor.name}</h3>
                    <p class="mentor-area">${mentor.area}</p>
                </div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="toggleFavorite(${mentor.id})" 
                        aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
                        aria-pressed="${isFavorite ? 'true' : 'false'}"
                        title="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                    ${isFavorite ? '♥' : '♡'}
                </button>
            </div>
            <div class="mentor-details">
                <div class="price-rating">
                    <span class="price">R$ ${mentor.price}/h</span>
                    <div class="rating" title="Avaliação: ${mentor.rating} estrelas">
                        <span class="stars" aria-hidden="true">${stars}</span>
                        <span class="rating-value">${mentor.rating}</span>
                    </div>
                </div>
                <div class="mentor-tags">
                    ${mentor.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    ${mentor.tags.length > 3 ? `<span class="tag">+${mentor.tags.length - 3}</span>` : ''}
                </div>
            </div>
            <div class="mentor-actions">
                <button class="btn-outline" onclick="openMentorModal(${mentor.id})" 
                        aria-label="Ver perfil de ${mentor.name}">
                    Ver Perfil
                </button>
            </div>
        </div>
    `;
}

// ===== FILTROS E BUSCA =====
function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const selectedArea = document.getElementById('area-filter')?.value || '';
    const minPrice = parseFloat(document.getElementById('price-min')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('price-max')?.value) || Infinity;
    const selectedAttendance = document.getElementById('attendance-filter')?.value || '';
    const sortBy = document.getElementById('sort-filter')?.value || 'rating';
    
    // Filtrar mentores
    currentMentors = mentorsData.filter(mentor => {
        const matchesSearch = !searchTerm || 
            mentor.name.toLowerCase().includes(searchTerm) ||
            mentor.area.toLowerCase().includes(searchTerm) ||
            mentor.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
        const matchesArea = !selectedArea || mentor.area === selectedArea;
        const matchesPrice = mentor.price >= minPrice && mentor.price <= maxPrice;
        const matchesAttendance = !selectedAttendance || mentor.attendance === selectedAttendance;
        
        return matchesSearch && matchesArea && matchesPrice && matchesAttendance;
    });
    
    // Ordenar mentores
    currentMentors.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'rating':
            default:
                return b.rating - a.rating;
        }
    });
    
    // Reset pagination
    currentPage = 1;
    
    // Renderizar resultados
    renderMentors();
    updateResultsCount();
}

function populateAreaFilter() {
    const areaFilter = document.getElementById('area-filter');
    if (!areaFilter || mentorsData.length === 0) return;
    
    const areas = [...new Set(mentorsData.map(mentor => mentor.area))].sort();
    
    // Limpar opções existentes (exceto a primeira)
    while (areaFilter.children.length > 1) {
        areaFilter.removeChild(areaFilter.lastChild);
    }
    
    // Adicionar áreas
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaFilter.appendChild(option);
    });
}

// ===== UTILITÁRIOS =====
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const total = currentMentors.length;
        const showing = Math.min(currentPage * mentorsPerPage, total);
        
        if (total === 0) {
            resultsCount.textContent = 'Nenhum resultado encontrado';
        } else if (total === 1) {
            resultsCount.textContent = '1 mentor encontrado';
        } else {
            resultsCount.textContent = `${total} mentores encontrados`;
        }
    }
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        const hasMore = currentPage * mentorsPerPage < currentMentors.length;
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }
}

function updatePaginationInfo() {
    const paginationText = document.getElementById('pagination-text');
    if (paginationText) {
        const showing = Math.min(currentPage * mentorsPerPage, currentMentors.length);
        const total = currentMentors.length;
        
        if (total > 0) {
            paginationText.textContent = `Mostrando ${showing} de ${total} mentores`;
        } else {
            paginationText.textContent = '';
        }
    }
}

function loadMoreMentors() {
    currentPage++;
    renderMentors();
}

// ===== FUNÇÕES DE FAVORITOS =====
function toggleFavorite(mentorId) {
    const index = favoriteMentors.indexOf(mentorId);
    
    if (index === -1) {
        favoriteMentors.push(mentorId);
    } else {
        favoriteMentors.splice(index, 1);
    }
    
    // Salvar no localStorage
    localStorage.setItem('favoriteMentors', JSON.stringify(favoriteMentors));
    
    // Atualizar UI
    renderMentors();
    updateFavoritesDisplay();
}

function updateFavoritesDisplay() {
    const favoritesGrid = document.getElementById('favorites-grid');
    if (!favoritesGrid) return;
    
    const favoritesMentors = mentorsData.filter(mentor => favoriteMentors.includes(mentor.id));
    
    if (favoritesMentors.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-favorites">
                <h3>Você ainda não tem favoritos</h3>
                <p>Clique no ♥ nos cards dos mentores para salvá-los aqui.</p>
            </div>
        `;
    } else {
        favoritesGrid.innerHTML = favoritesMentors.map(mentor => createMentorCard(mentor)).join('');
    }
}

// ===== MODAL =====
function openMentorModal(mentorId) {
    const mentor = mentorsData.find(m => m.id === mentorId);
    if (!mentor) return;
    
    const modal = document.getElementById('mentor-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalBookBtn = document.getElementById('modal-book-btn');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = `Perfil - ${mentor.name}`;
    
    modalBody.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <img src="${mentor.photo}" alt="Foto de ${mentor.name}" 
                 style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;"
                 onerror="this.style.display='none'">
            <h3>${mentor.name}</h3>
            <p style="color: var(--gray-600);">${mentor.area}</p>
            <div style="display: flex; justify-content: center; gap: 2rem; margin: 1rem 0;">
                <div><strong>R$ ${mentor.price}/h</strong></div>
                <div>⭐ ${mentor.rating}</div>
                <div>📍 ${mentor.city}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4>Sobre</h4>
            <p>${mentor.bio}</p>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4>Especialidades</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${mentor.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h4>Disponibilidade</h4>
            <div style="display: grid; gap: 0.5rem;">
                ${mentor.availability.map(day => `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: var(--gray-100); border-radius: 0.5rem;">
                        <strong>${day.day}:</strong>
                        <span>${day.slots.join(', ')}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div>
            <h4>Tipo de Atendimento</h4>
            <p style="text-transform: capitalize;">${mentor.attendance}</p>
        </div>
    `;
    
    // Configurar botão de agendamento
    if (modalBookBtn) {
        modalBookBtn.onclick = () => {
            closeModal();
            scrollToBookingForm();
            selectMentorInForm(mentorId);
        };
    }
    
    // Mostrar modal
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Focar no modal para acessibilidade
    setTimeout(() => {
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();
        }
    }, 100);
    
    // Trap focus in modal
    trapFocusInModal(modal);
}

function closeModal() {
    const modal = document.getElementById('mentor-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to the trigger element
        const triggerElement = document.activeElement;
        if (triggerElement && triggerElement.getAttribute('onclick')) {
            triggerElement.focus();
        }
    }
}

// Trap focus within modal for accessibility
function trapFocusInModal(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }
    
    modal.addEventListener('keydown', handleTabKey);
    
    // Remove listener when modal closes
    const originalClose = closeModal;
    window.closeModal = function() {
        modal.removeEventListener('keydown', handleTabKey);
        originalClose();
    };
}

// ===== FORMULÁRIO DE AGENDAMENTO =====
function populateMentorSelect() {
    const select = document.getElementById('mentor-select');
    if (!select) return;
    
    // Aguardar carregamento dos dados
    if (mentorsData.length === 0) {
        setTimeout(populateMentorSelect, 1000);
        return;
    }
    
    // Limpar opções existentes (exceto a primeira)
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // Adicionar mentores ordenados por nome
    mentorsData
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(mentor => {
            const option = document.createElement('option');
            option.value = mentor.id;
            option.textContent = `${mentor.name} - ${mentor.area} (R$ ${mentor.price}/h)`;
            select.appendChild(option);
        });
}

function selectMentorInForm(mentorId) {
    const select = document.getElementById('mentor-select');
    if (select) {
        select.value = mentorId;
        select.focus();
    }
}

function scrollToBookingForm() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Verificar se usuário está logado
    if (!currentUser) {
        alert('Você precisa estar logado para agendar uma sessão.');
        openAuthModal();
        return;
    }
    
    const formData = {
        mentorId: document.getElementById('mentor-select').value,
        date: document.getElementById('booking-date').value,
        time: document.getElementById('booking-time').value,
        message: document.getElementById('booking-message').value
    };
    
    // Validação básica
    if (!formData.mentorId || !formData.date || !formData.time) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Salvar no localStorage
    appointments.push({
        id: Date.now(),
        ...formData,
        userId: currentUser.id,
        status: 'pending',
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Feedback para o usuário
    alert('Agendamento solicitado com sucesso! O mentor entrará em contato em breve.');
    
    // Atualizar estatísticas
    updateStats();
    renderUserSessions();
    
    // Limpar formulário
    e.target.reset();
}

// ===== GRUPOS DE ESTUDO =====
function renderStudyGroups() {
    const groupsGrid = document.getElementById('groups-grid');
    const groupsTagFilter = document.getElementById('groups-tag-filter');
    
    if (!groupsGrid) return;
    
    // Popular filtro de tags
    if (groupsTagFilter && groupsTagFilter.children.length <= 1) {
        const allTags = [...new Set(studyGroups.flatMap(group => group.tags))].sort();
        
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            groupsTagFilter.appendChild(option);
        });
    }
    
    // Renderizar grupos
    groupsGrid.innerHTML = studyGroups.map(group => createGroupCard(group)).join('');
}

function createGroupCard(group) {
    const isParticipant = currentUser && userGroups.includes(group.id);
    const participantCount = group.participants ? group.participants.length : 1;
    
    return `
        <div class="group-card">
            ${isParticipant ? '<div class="group-status">Participando</div>' : ''}
            
            <h3>${group.title}</h3>
            <p>${group.description}</p>
            
            <div class="group-participants">
                👥 ${participantCount} participante${participantCount !== 1 ? 's' : ''}
            </div>
            
            <div class="group-materials">
                <h4>Materiais de Estudo:</h4>
                ${group.materials && group.materials.length > 0 ? 
                    group.materials.map(material => `
                        <div class="material-item">
                            <div class="material-info">
                                <a href="${material.url}" target="_blank" class="material-link" 
                                   rel="noopener noreferrer">${material.title}</a>
                                ${material.description ? `<p>${material.description}</p>` : ''}
                                ${material.sharedByName ? `<small>Por: ${material.sharedByName}</small>` : ''}
                            </div>
                        </div>
                    `).join('') : 
                    '<p style="font-style: italic; color: #64748b;">Nenhum material compartilhado ainda.</p>'
                }
            </div>
            
            <div class="mentor-tags">
                ${group.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <div class="group-actions">
                ${!isParticipant ? `
                    <button class="btn-primary btn-small" onclick="joinGroup(${group.id})">
                        Participar
                    </button>
                ` : `
                    <button class="btn-secondary btn-small" onclick="openShareMaterialModal(${group.id})">
                        Compartilhar Material
                    </button>
                    <button class="btn-outline btn-small" onclick="leaveGroup(${group.id})">
                        Sair do Grupo
                    </button>
                `}
            </div>
        </div>
    `;
}

function filterGroups() {
    const searchTerm = document.getElementById('groups-search')?.value.toLowerCase() || '';
    const selectedTag = document.getElementById('groups-tag-filter')?.value || '';
    const participationFilter = document.getElementById('groups-participation-filter')?.value || '';
    
    const filteredGroups = studyGroups.filter(group => {
        const matchesSearch = !searchTerm || 
            group.title.toLowerCase().includes(searchTerm) ||
            group.description.toLowerCase().includes(searchTerm);
            
        const matchesTag = !selectedTag || group.tags.includes(selectedTag);
        
        const matchesParticipation = !participationFilter || 
            (participationFilter === 'joined' && currentUser && userGroups.includes(group.id)) ||
            (participationFilter === 'available' && (!currentUser || !userGroups.includes(group.id)));
        
        return matchesSearch && matchesTag && matchesParticipation;
    });
    
    const groupsGrid = document.getElementById('groups-grid');
    if (groupsGrid) {
        if (filteredGroups.length === 0) {
            groupsGrid.innerHTML = `
                <div class="empty-sessions">
                    <h3>Nenhum grupo encontrado</h3>
                    <p>Tente ajustar os filtros ou criar um novo grupo.</p>
                    ${currentUser ? `<button class="btn-primary" onclick="openCreateGroupModal()">Criar Grupo</button>` : ''}
                </div>
            `;
        } else {
            groupsGrid.innerHTML = filteredGroups.map(group => createGroupCard(group)).join('');
        }
    }
}

// ===== SISTEMA DE AUTENTICAÇÃO =====
function checkAuthentication() {
    if (currentUser) {
        showAuthenticatedUI();
    } else {
        showUnauthenticatedUI();
    }
}

function showAuthenticatedUI() {
    // Esconder botão de login
    const navLogin = document.getElementById('nav-login');
    const navUser = document.getElementById('nav-user');
    const navDashboard = document.getElementById('nav-dashboard');
    const navSessions = document.getElementById('nav-sessions');
    const createGroupBtn = document.getElementById('create-group-btn');
    
    if (navLogin) navLogin.style.display = 'none';
    if (navUser) navUser.style.display = 'block';
    if (navDashboard) navDashboard.style.display = 'block';
    if (navSessions) navSessions.style.display = 'block';
    if (createGroupBtn) createGroupBtn.style.display = 'block';
    
    // Atualizar nome do usuário
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = currentUser.name.split(' ')[0];
    }
    
    // Atualizar dashboard
    updateDashboard();
    renderUserSessions();
}

function showUnauthenticatedUI() {
    const navLogin = document.getElementById('nav-login');
    const navUser = document.getElementById('nav-user');
    const navDashboard = document.getElementById('nav-dashboard');
    const navSessions = document.getElementById('nav-sessions');
    const createGroupBtn = document.getElementById('create-group-btn');
    
    if (navLogin) navLogin.style.display = 'block';
    if (navUser) navUser.style.display = 'none';
    if (navDashboard) navDashboard.style.display = 'none';
    if (navSessions) navSessions.style.display = 'none';
    if (createGroupBtn) createGroupBtn.style.display = 'none';
}

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }
}

function showAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.querySelector('.auth-tab:first-child');
    const registerTab = document.querySelector('.auth-tab:last-child');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showUnauthenticatedUI();
    hideAllSections();
    scrollToSection('mentors');
    alert('Você foi desconectado com sucesso!');
}

// ===== EVENT LISTENERS PARA AUTENTICAÇÃO =====
function setupAuthEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // Role selector
    const roleSelect = document.getElementById('register-role');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const mentorFields = document.getElementById('mentor-fields');
            if (this.value === 'mentor') {
                mentorFields.style.display = 'block';
                mentorFields.classList.add('active');
                populateAreaSelect();
            } else {
                mentorFields.style.display = 'none';
                mentorFields.classList.remove('active');
            }
        });
    }
}

function populateAreaSelect() {
    const areaSelect = document.getElementById('register-area');
    if (!areaSelect || mentorsData.length === 0) return;
    
    const areas = [...new Set(mentorsData.map(mentor => mentor.area))].sort();
    
    // Limpar opções existentes (exceto a primeira)
    while (areaSelect.children.length > 1) {
        areaSelect.removeChild(areaSelect.lastChild);
    }
    
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
    });
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // ⚠️ DEMO: Este é um sistema de autenticação simulado para demonstração.
    // Em produção, seria necessário um backend seguro com criptografia de senhas.
    if (email && password) {
        currentUser = {
            id: Date.now(),
            name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
            email: email,
            role: 'student', // Padrão
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeAuthModal();
        showAuthenticatedUI();
        
        // Mostrar alerta de demonstração na primeira vez
        const firstLogin = !localStorage.getItem('demoWarningShown');
        if (firstLogin) {
            localStorage.setItem('demoWarningShown', 'true');
            alert('🚀 Login realizado com sucesso!\n\n⚠️ DEMO: Este é um sistema de demonstração. Em produção, seria implementada autenticação segura com backend.');
        } else {
            alert('Login realizado com sucesso!');
        }
        
        // Limpar formulário
        document.getElementById('login-form').reset();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const area = document.getElementById('register-area').value;
    
    if (!name || !email || !password || !role) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (role === 'mentor' && !area) {
        alert('Por favor, selecione uma área de especialização.');
        return;
    }
    
    // Simulação de cadastro
    currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        area: area || null,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeAuthModal();
    showAuthenticatedUI();
    alert('Cadastro realizado com sucesso!');
    
    // Limpar formulário
    document.getElementById('register-form').reset();
    showAuthTab('login');
}

// ===== DASHBOARD =====
function updateDashboard() {
    if (!currentUser) return;
    
    // Atualizar informações do usuário
    const userAvatar = document.getElementById('dashboard-user-avatar');
    const userName = document.getElementById('dashboard-user-name');
    const userRole = document.getElementById('dashboard-user-role');
    const userEmail = document.getElementById('dashboard-user-email');
    
    if (userAvatar) {
        userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff&size=80`;
        userAvatar.alt = `Avatar de ${currentUser.name}`;
    }
    
    if (userName) userName.textContent = currentUser.name;
    if (userRole) userRole.textContent = currentUser.role === 'student' ? 'Estudante' : 'Mentor';
    if (userEmail) userEmail.textContent = currentUser.email;
    
    // Atualizar estatísticas
    updateStats();
}

function updateStats() {
    const statSessions = document.getElementById('stat-sessions');
    const statGroups = document.getElementById('stat-groups');
    const statFavorites = document.getElementById('stat-favorites');
    const statMaterials = document.getElementById('stat-materials');
    
    if (statSessions) statSessions.textContent = appointments.length;
    if (statGroups) statGroups.textContent = userGroups.length;
    if (statFavorites) statFavorites.textContent = favoriteMentors.length;
    if (statMaterials) statMaterials.textContent = sharedMaterials.filter(m => m.sharedBy === currentUser?.id).length;
}

// ===== SESSÕES DO USUÁRIO =====
function renderUserSessions() {
    const sessionsGrid = document.getElementById('sessions-grid');
    if (!sessionsGrid || !currentUser) return;
    
    const userAppointments = appointments.filter(apt => apt.userId === currentUser.id);
    
    if (userAppointments.length === 0) {
        sessionsGrid.innerHTML = `
            <div class="empty-sessions">
                <h3>Você ainda não tem sessões agendadas</h3>
                <p>Agende sua primeira sessão com um mentor!</p>
                <button class="btn-primary" onclick="scrollToSection('booking')">Agendar Sessão</button>
            </div>
        `;
        return;
    }
    
    sessionsGrid.innerHTML = userAppointments.map(session => createSessionCard(session)).join('');
}

function createSessionCard(session) {
    const mentor = mentorsData.find(m => m.id == session.mentorId);
    const statusText = {
        'pending': 'Pendente',
        'confirmed': 'Confirmada',
        'completed': 'Concluída',
        'cancelled': 'Cancelada'
    };
    
    return `
        <div class="session-card ${session.status}">
            <div class="session-header">
                <div class="session-mentor">${mentor ? mentor.name : 'Mentor não encontrado'}</div>
                <div class="session-status ${session.status}">${statusText[session.status]}</div>
            </div>
            <div class="session-details">
                <div class="session-detail">
                    📅 ${new Date(session.date).toLocaleDateString('pt-BR')} às ${session.time}
                </div>
                <div class="session-detail">
                    💼 ${mentor ? mentor.area : 'N/A'}
                </div>
                <div class="session-detail">
                    💰 R$ ${mentor ? mentor.price : '0'}/h
                </div>
                ${session.message ? `<div class="session-detail">💬 ${session.message}</div>` : ''}
            </div>
            <div class="session-actions">
                ${session.status === 'pending' ? `
                    <button class="btn-success btn-small" onclick="updateSessionStatus(${session.id}, 'confirmed')">
                        Confirmar
                    </button>
                    <button class="btn-danger btn-small" onclick="updateSessionStatus(${session.id}, 'cancelled')">
                        Cancelar
                    </button>
                ` : ''}
                ${session.status === 'confirmed' ? `
                    <button class="btn-primary btn-small" onclick="startMentorship(${session.id})">
                        Iniciar Sessão
                    </button>
                ` : ''}
                <button class="btn-secondary btn-small" onclick="viewSessionDetails(${session.id})">
                    Detalhes
                </button>
            </div>
        </div>
    `;
}

function updateSessionStatus(sessionId, newStatus) {
    const sessionIndex = appointments.findIndex(apt => apt.id === sessionId);
    if (sessionIndex !== -1) {
        appointments[sessionIndex].status = newStatus;
        localStorage.setItem('appointments', JSON.stringify(appointments));
        renderUserSessions();
        updateStats();
        
        const statusText = {
            'confirmed': 'confirmada',
            'cancelled': 'cancelada',
            'completed': 'concluída'
        };
        
        alert(`Sessão ${statusText[newStatus]} com sucesso!`);
    }
}

function startMentorship(sessionId) {
    const session = appointments.find(apt => apt.id === sessionId);
    const mentor = mentorsData.find(m => m.id == session.mentorId);
    
    if (session) {
        // Gerar link de sala de mentoria
        const roomId = `educonnect-${sessionId}-${Date.now()}`;
        const meetingUrl = `https://meet.jit.si/${roomId}`;
        
        // Mostrar opções de mentoria
        const response = confirm(`🎥 Iniciar Sessão de Mentoria com ${mentor.name}\n\n` +
                               `Escolha uma opção:\n\n` +
                               `✅ OK - Abrir videoconferência (Jitsi Meet)\n` +
                               `❌ Cancelar - Voltar\n\n` +
                               `Você será redirecionado para uma sala privada de videoconferência.`);
        
        if (response) {
            // Salvar informações da sessão ativa
            const activeMentorship = {
                sessionId: sessionId,
                mentorName: mentor.name,
                meetingUrl: meetingUrl,
                startTime: new Date().toISOString(),
                status: 'active'
            };
            
            localStorage.setItem('activeMentorship', JSON.stringify(activeMentorship));
            
            // Abrir em nova aba
            window.open(meetingUrl, '_blank');
            
            // Mostrar interface de mentoria ativa
            showActiveMentorshipInterface(activeMentorship);
            
            alert(`🚀 Sala de mentoria criada!\n\n` +
                  `📧 Compartilhe este link com seu mentor:\n${meetingUrl}\n\n` +
                  `💡 Dica: Mantenha esta aba aberta para acessar as ferramentas de mentoria.`);
        }
    }
}

function showActiveMentorshipInterface(mentorship) {
    // Criar interface de mentoria ativa
    const mentorshipInterface = `
        <div id="active-mentorship" class="alert alert-success" style="position: fixed; top: 80px; right: 20px; z-index: 1001; min-width: 300px;">
            <h4>🎥 Mentoria Ativa</h4>
            <p><strong>Mentor:</strong> ${mentorship.mentorName}</p>
            <p><strong>Iniciada:</strong> ${new Date(mentorship.startTime).toLocaleTimeString('pt-BR')}</p>
            
            <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn-success btn-small" onclick="openMeetingLink('${mentorship.meetingUrl}')">
                    🎥 Abrir Vídeo
                </button>
                <button class="btn-secondary btn-small" onclick="showMentorshipNotes(${mentorship.sessionId})">
                    📝 Notas
                </button>
                <button class="btn-warning btn-small" onclick="endMentorship(${mentorship.sessionId})">
                    ✋ Finalizar
                </button>
            </div>
        </div>
    `;
    
    // Remover interface anterior se existir
    const existingInterface = document.getElementById('active-mentorship');
    if (existingInterface) {
        existingInterface.remove();
    }
    
    // Adicionar nova interface
    document.body.insertAdjacentHTML('beforeend', mentorshipInterface);
}

function openMeetingLink(url) {
    window.open(url, '_blank');
}

function showMentorshipNotes(sessionId) {
    const notes = localStorage.getItem(`mentorship-notes-${sessionId}`) || '';
    const newNotes = prompt(`📝 Notas da Mentoria:\n\nDigite suas anotações sobre a sessão:`, notes);
    
    if (newNotes !== null) {
        localStorage.setItem(`mentorship-notes-${sessionId}`, newNotes);
        alert('Notas salvas com sucesso! ✅');
    }
}

function endMentorship(sessionId) {
    const confirm = window.confirm('Tem certeza que deseja finalizar a mentoria?');
    
    if (confirm) {
        // Remover interface ativa
        const activeInterface = document.getElementById('active-mentorship');
        if (activeInterface) {
            activeInterface.remove();
        }
        
        // Remover dados da mentoria ativa
        localStorage.removeItem('activeMentorship');
        
        // Marcar sessão como concluída
        updateSessionStatus(sessionId, 'completed');
        
        // Feedback
        alert('🎉 Mentoria finalizada com sucesso!\n\nEsperamos que tenha sido proveitosa!');
    }
}

// Verificar mentoria ativa ao carregar página
function checkActiveMentorship() {
    const activeMentorship = JSON.parse(localStorage.getItem('activeMentorship'));
    if (activeMentorship) {
        showActiveMentorshipInterface(activeMentorship);
    }
}

function viewSessionDetails(sessionId) {
    const session = appointments.find(apt => apt.id === sessionId);
    const mentor = mentorsData.find(m => m.id == session.mentorId);
    
    if (session && mentor) {
        alert(`Detalhes da Sessão:\n\n` +
              `Mentor: ${mentor.name}\n` +
              `Área: ${mentor.area}\n` +
              `Data: ${new Date(session.date).toLocaleDateString('pt-BR')}\n` +
              `Hora: ${session.time}\n` +
              `Status: ${session.status}\n` +
              `Mensagem: ${session.message || 'Nenhuma mensagem'}`);
    }
}

// ===== GRUPOS EXPANDIDOS =====
function openCreateGroupModal() {
    if (!currentUser) {
        alert('Você precisa estar logado para criar um grupo.');
        return;
    }
    
    const modal = document.getElementById('create-group-modal');
    if (modal) {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeCreateGroupModal() {
    const modal = document.getElementById('create-group-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.getElementById('create-group-form').reset();
    }
}

function createGroup() {
    const title = document.getElementById('group-title').value;
    const description = document.getElementById('group-description').value;
    const tags = document.getElementById('group-tags').value;
    const materialTitle = document.getElementById('group-material-title').value;
    const materialUrl = document.getElementById('group-material-url').value;
    
    if (!title || !description) {
        alert('Por favor, preencha o título e descrição do grupo.');
        return;
    }
    
    const newGroup = {
        id: Date.now(),
        title: title,
        description: description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        materials: [],
        participants: [currentUser.id],
        createdBy: currentUser.id,
        createdAt: new Date().toISOString()
    };
    
    // Adicionar material inicial se fornecido
    if (materialTitle && materialUrl) {
        newGroup.materials.push({
            title: materialTitle,
            url: materialUrl,
            sharedBy: currentUser.id,
            sharedAt: new Date().toISOString()
        });
    }
    
    // Adicionar aos grupos globais
    studyGroups.push(newGroup);
    
    // Adicionar aos grupos do usuário
    userGroups.push(newGroup.id);
    localStorage.setItem('userGroups', JSON.stringify(userGroups));
    
    closeCreateGroupModal();
    renderStudyGroups();
    updateStats();
    
    alert('Grupo criado com sucesso!');
}

function joinGroup(groupId) {
    if (!currentUser) {
        alert('Você precisa estar logado para participar de um grupo.');
        return;
    }
    
    if (userGroups.includes(groupId)) {
        alert('Você já participa deste grupo.');
        return;
    }
    
    const group = studyGroups.find(g => g.id === groupId);
    if (group) {
        // Inicializar participants se não existir
        if (!group.participants) {
            group.participants = [group.createdBy || 1]; // Assumir que criador é participante inicial
        }
        
        // Adicionar usuário aos participantes
        if (!group.participants.includes(currentUser.id)) {
            group.participants.push(currentUser.id);
        }
        
        // Adicionar aos grupos do usuário
        userGroups.push(groupId);
        localStorage.setItem('userGroups', JSON.stringify(userGroups));
        
        // Persistir alterações do grupo
        localStorage.setItem('studyGroupsUpdates', JSON.stringify({
            groupId: groupId,
            participants: group.participants,
            updatedAt: new Date().toISOString()
        }));
        
        renderStudyGroups();
        updateStats();
        
        alert(`✅ Você agora participa do grupo "${group.title}"!\n\n👥 ${group.participants.length} participante${group.participants.length !== 1 ? 's' : ''} no grupo.`);
    }
}

function leaveGroup(groupId) {
    const groupIndex = userGroups.indexOf(groupId);
    if (groupIndex !== -1) {
        userGroups.splice(groupIndex, 1);
        localStorage.setItem('userGroups', JSON.stringify(userGroups));
        
        const group = studyGroups.find(g => g.id === groupId);
        if (group && group.participants) {
            const participantIndex = group.participants.indexOf(currentUser.id);
            if (participantIndex !== -1) {
                group.participants.splice(participantIndex, 1);
            }
        }
        
        renderStudyGroups();
        updateStats();
        
        alert('Você saiu do grupo com sucesso.');
    }
}

function openShareMaterialModal(groupId = null) {
    if (!currentUser) {
        alert('Você precisa estar logado para compartilhar materiais.');
        return;
    }
    
    const modal = document.getElementById('share-material-modal');
    const groupSelect = document.getElementById('material-group');
    
    if (modal && groupSelect) {
        // Limpar e popular select de grupos
        groupSelect.innerHTML = '<option value="">Selecione um grupo</option>';
        
        userGroups.forEach(groupId => {
            const group = studyGroups.find(g => g.id === groupId);
            if (group) {
                const option = document.createElement('option');
                option.value = group.id;
                option.textContent = group.title;
                groupSelect.appendChild(option);
            }
        });
        
        // Pre-selecionar grupo se especificado
        if (groupId) {
            groupSelect.value = groupId;
        }
        
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeShareMaterialModal() {
    const modal = document.getElementById('share-material-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.getElementById('share-material-form').reset();
    }
}

function shareMaterial() {
    const groupId = parseInt(document.getElementById('material-group').value);
    const title = document.getElementById('material-title').value;
    const url = document.getElementById('material-url').value;
    const description = document.getElementById('material-description').value;
    
    if (!groupId || !title || !url) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    const group = studyGroups.find(g => g.id === groupId);
    if (group) {
        const material = {
            title: title,
            url: url,
            description: description || '',
            sharedBy: currentUser.id,
            sharedByName: currentUser.name,
            sharedAt: new Date().toISOString()
        };
        
        group.materials = group.materials || [];
        group.materials.push(material);
        
        // Adicionar aos materiais compartilhados do usuário
        sharedMaterials.push({
            ...material,
            groupId: groupId,
            groupTitle: group.title
        });
        localStorage.setItem('sharedMaterials', JSON.stringify(sharedMaterials));
        
        closeShareMaterialModal();
        renderStudyGroups();
        updateStats();
        
        alert('Material compartilhado com sucesso!');
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====
function hideAllSections() {
    const sections = ['dashboard', 'sessions', 'mentors', 'booking', 'groups', 'favorites'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
}

function scrollToSection(sectionId) {
    // Esconder todas as seções
    hideAllSections();
    
    // Mostrar seção específica
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function openBookingForm() {
    scrollToSection('booking');
}

// Atualizar inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listeners de autenticação
    setupAuthEventListeners();
    
    // Interceptar cliques em links de navegação
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            
            // Verificar autenticação para seções protegidas
            if (['dashboard', 'sessions'].includes(sectionId) && !currentUser) {
                alert('Você precisa estar logado para acessar esta seção.');
                openAuthModal();
                return;
            }
            
            scrollToSection(sectionId);
        });
    });
});

console.log('EduConnect - Sistema expandido carregado!');
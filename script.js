// 유틸리티 허브 애플리케이션
const app = {
    // 상태 관리
    state: {
        currentCategory: 'all',
        currentTool: null,
        toolUsageCount: 0,
        searchQuery: '',
        isMenuOpen: false
    },

    // 도구 데이터
    tools: [
         {
            id: 'sticky_notes',
            title: '온라인 메모장(포스트잇)',
            description: '온라인 메모장, 온라인 포스트잇',
            icon: '📝',
            category: 'generator',
            file: 'tools/sticky_notes.html',
            badge: 'NEW'
        },
        {
            id: 'text-converter',
            title: '텍스트 변환기',
            description: '대소문자 변환, 인코딩/디코딩 등 텍스트 처리 도구',
            icon: '📝',
            category: 'converter',
            file: 'tools/text-converter.html',
            badge: 'NEW'
        },
        {
            id: 'unit-converter',
            title: '단위 변환기',
            description: '길이, 무게, 온도 등 다양한 단위 변환',
            icon: '📏',
            category: 'converter',
            file: 'tools/unit-converter.html'
        },
        {
            id: 'color-picker',
            title: '색상 선택기',
            description: 'HEX, RGB, HSL 색상 코드 변환 및 팔레트',
            icon: '🎨',
            category: 'tools',
            file: 'tools/color-picker.html'
        },
        {
            id: 'password-generator',
            title: '비밀번호 생성기',
            description: '안전한 랜덤 비밀번호 생성',
            icon: '🔐',
            category: 'generator',
            file: 'tools/password-generator.html'
        },
        {
            id: 'qr-generator',
            title: 'QR 코드 생성기',
            description: '텍스트, URL을 QR 코드로 변환',
            icon: '📱',
            category: 'generator',
            file: 'tools/qr_maker.html'
        },  
        {
            id: 'calculator',
            title: '공학 계산기',
            description: '기본 및 공학용 계산기',
            icon: '🧮',
            category: 'calculator',
            file: 'tools/calculator.html'
        },
        {
            id: 'loan-calculator',
            title: '대출 계산기',
            description: '대출 이자 및 상환액 계산',
            icon: '💰',
            category: 'calculator',
            file: 'tools/loan-calculator.html'
        },
        {
            id: 'json-formatter',
            title: 'JSON 포맷터',
            description: 'JSON 데이터 정리 및 검증',
            icon: '{ }',
            category: 'tools',
            file: 'tools/json-formatter.html'
        },
        {
            id: 'image-compressor',
            title: '이미지 압축기',
            description: '이미지 파일 크기 최적화',
            icon: '🖼️',
            category: 'tools',
            file: 'tools/image-compressor.html',
            badge: 'HOT'
        }
    ],

    // 초기화
    init() {
        this.renderTools();
        this.setupEventListeners();
        this.loadState();
    },

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 브라우저 뒤로가기
        window.addEventListener('popstate', (e) => {
            if (this.state.currentTool) {
                this.showHome();
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('fullscreenAd').style.display === 'flex') {
                    this.closeFullscreenAd();
                } else if (this.state.currentTool) {
                    this.showHome();
                }
            }
        });

        // 반응형 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('navMenu');
            const hamburger = document.getElementById('hamburger');
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });
    },

    // 도구 렌더링
    renderTools(category = 'all') {
        const toolsGrid = document.getElementById('toolsGrid');
        toolsGrid.innerHTML = '';

        let filteredTools = this.tools;
        
        // 카테고리 필터
        if (category !== 'all') {
            filteredTools = filteredTools.filter(tool => tool.category === category);
        }

        // 검색어 필터
        if (this.state.searchQuery) {
            const query = this.state.searchQuery.toLowerCase();
            filteredTools = filteredTools.filter(tool => 
                tool.title.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query)
            );
        }

        // 도구 카드 생성
        filteredTools.forEach((tool, index) => {
            const card = this.createToolCard(tool, index);
            toolsGrid.appendChild(card);
        });

        // 결과 없음 메시지
        if (filteredTools.length === 0) {
            toolsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="font-size: 1.25rem; color: var(--text-secondary);">
                        ${this.state.searchQuery ? '검색 결과가 없습니다.' : '해당 카테고리에 도구가 없습니다.'}
                    </p>
                </div>
            `;
        }
    },

    // 도구 카드 생성
    createToolCard(tool, index) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <h3 class="tool-title">${tool.title}</h3>
            <p class="tool-description">${tool.description}</p>
            ${tool.badge ? `<span class="tool-badge">${tool.badge}</span>` : ''}
        `;

        card.addEventListener('click', () => this.openTool(tool));
        
        return card;
    },

    // 도구 열기
    openTool(tool) {
        this.state.toolUsageCount++;
        
        // 3번째 사용마다 전면 광고 표시
        if (this.state.toolUsageCount % 3 === 0) {
            this.triggerInterstitialAd(() => {
                this.loadTool(tool);
            });
        } else {
            this.loadTool(tool);
        }

        // 사용 통계 저장
        this.saveToolStats(tool.id);
    },

    // 도구 로드
    loadTool(tool) {
        this.showLoading(true);
        
        const toolFrame = document.getElementById('toolFrame');
        const toolTitle = document.getElementById('currentToolTitle');
        const mainContainer = document.getElementById('mainContainer');
        const toolContainer = document.getElementById('toolContainer');

        toolTitle.textContent = tool.title;
        this.state.currentTool = tool;

        // iframe 로드 이벤트
        toolFrame.onload = () => {
            this.showLoading(false);
        };

        toolFrame.src = tool.file;

        // 화면 전환
        mainContainer.style.display = 'none';
        toolContainer.style.display = 'block';

        // URL 업데이트
        history.pushState({ tool: tool.id }, tool.title, `#tool-${tool.id}`);
    },

    // 홈으로 돌아가기
    showHome() {
        const mainContainer = document.getElementById('mainContainer');
        const toolContainer = document.getElementById('toolContainer');
        const toolFrame = document.getElementById('toolFrame');

        toolContainer.style.display = 'none';
        mainContainer.style.display = 'block';
        toolFrame.src = '';

        this.state.currentTool = null;
        this.closeMenu();

        // URL 초기화
        history.pushState({ page: 'home' }, '유틸리티 허브', '/');
    },

    // 카테고리 표시
    showCategory(category) {
        this.state.currentCategory = category;
        this.renderTools(category);
        this.updateNavActive(category);
        this.closeMenu();
    },

    // 네비게이션 활성화 상태 업데이트
    updateNavActive(category) {
        const navItems = document.querySelectorAll('.nav-item a');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // 현재 카테고리에 맞는 메뉴 활성화
        const activeItem = Array.from(navItems).find(item => {
            const text = item.textContent.toLowerCase();
            return (category === 'all' && text === '홈') ||
                   (category === 'converter' && text === '변환도구') ||
                   (category === 'calculator' && text === '계산기') ||
                   (category === 'generator' && text === '생성기') ||
                   (category === 'tools' && text === '도구');
        });

        if (activeItem) {
            activeItem.classList.add('active');
        }
    },

    // 도구 검색
    searchTools(query) {
        this.state.searchQuery = query;
        this.renderTools(this.state.currentCategory);
    },

    // 도구 새로고침
    refreshTool() {
        if (this.state.currentTool) {
            const toolFrame = document.getElementById('toolFrame');
            this.showLoading(true);
            toolFrame.src = toolFrame.src;
        }
    },

    // 메뉴 토글
    toggleMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        this.state.isMenuOpen = !this.state.isMenuOpen;
    },

    // 메뉴 닫기
    closeMenu() {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        this.state.isMenuOpen = false;
    },

    // 전면 광고 트리거
    triggerInterstitialAd(callback) {
        const fullscreenAd = document.getElementById('fullscreenAd');
        fullscreenAd.style.display = 'flex';
        
        // 콜백 저장
        this.adCallback = callback;

        // 5초 후 자동 닫기 옵션
        this.adTimer = setTimeout(() => {
            this.closeFullscreenAd();
        }, 5000);
    },

    // 전면 광고 닫기
    closeFullscreenAd() {
        const fullscreenAd = document.getElementById('fullscreenAd');
        fullscreenAd.style.display = 'none';

        // 타이머 정리
        if (this.adTimer) {
            clearTimeout(this.adTimer);
            this.adTimer = null;
        }

        // 콜백 실행
        if (this.adCallback) {
            this.adCallback();
            this.adCallback = null;
        }
    },

    // 로딩 표시
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = show ? 'flex' : 'none';
    },

    // 도구 사용 통계 저장
    saveToolStats(toolId) {
        try {
            const stats = JSON.parse(localStorage.getItem('toolStats') || '{}');
            if (!stats[toolId]) {
                stats[toolId] = { usageCount: 0, lastUsed: null };
            }
            stats[toolId].usageCount++;
            stats[toolId].lastUsed = new Date().toISOString();
            localStorage.setItem('toolStats', JSON.stringify(stats));
        } catch (error) {
            console.error('통계 저장 실패:', error);
        }
    },

    // 상태 저장
    saveState() {
        try {
            localStorage.setItem('appState', JSON.stringify({
                toolUsageCount: this.state.toolUsageCount,
                currentCategory: this.state.currentCategory
            }));
        } catch (error) {
            console.error('상태 저장 실패:', error);
        }
    },

    // 상태 불러오기
    loadState() {
        try {
            const savedState = JSON.parse(localStorage.getItem('appState') || '{}');
            if (savedState.toolUsageCount) {
                this.state.toolUsageCount = savedState.toolUsageCount;
            }
            if (savedState.currentCategory) {
                this.showCategory(savedState.currentCategory);
            }
        } catch (error) {
            console.error('상태 불러오기 실패:', error);
        }
    }
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// 전역 함수 노출 (HTML에서 호출용)
window.app = app;

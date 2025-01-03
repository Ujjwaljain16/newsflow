class NewsApp {
    constructor() {
        this.apiKey = '2c851e1eeb807d3e49e895e9b2110ee2'; // Replace with your actual API key
        this.articles = [];
        this.bookmarkedArticles = new Set();
        this.selectedCategories = new Set();
        this.currentView = 'all';
        this.loading = false;
        this.userPreferences = this.loadUserPreferences();
        this.initializeElements();
        this.setupSentimentAnalyzer();
        this.attachEventListeners();
        this.loadBookmarks();
        this.fetchNews();
        this.modal = document.querySelector('.modal');
        this.countrySelector = document.querySelector('.country-selector');
        this.setupModal();
        this.setupCountrySelector();
    }
    setupSentimentAnalyzer() {
// Basic sentiment analysis implementation
this.analyzeSentiment = (text) => {
    const positiveWords = new Set(['success', 'breakthrough', 'achievement', 'positive', 'growth']);
    const negativeWords = new Set(['crisis', 'failure', 'decline', 'negative', 'loss']);
    
    text = text.toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    
    const analysis = {
        score: 0,
        positive: [],
        negative: [],
        words: words,
        comparative: 0
    };
    
    words.forEach(word => {
        if (positiveWords.has(word)) {
            analysis.score++;
            analysis.positive.push(word);
        } else if (negativeWords.has(word)) {
            analysis.score--;
            analysis.negative.push(word);
        }
    });
    
    analysis.comparative = words.length ? analysis.score / words.length : 0;
    
    return {
        ...analysis,
        category: analysis.score > 0 ? 'positive' : analysis.score < 0 ? 'negative' : 'neutral'
    };
};
}


    renderTimeline() {
const timelineContainer = document.querySelector('.timeline');
const sortedArticles = [...this.articles].sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

timelineContainer.innerHTML = sortedArticles.map(article => `
<div class="timeline-item">
    <img src="${article.image || '/api/placeholder/100/100'}" alt="Thumbnail">
    <h3>${new Date(article.publishedAt).toLocaleDateString()}</h3>
    <p>${article.title.slice(0, 50)}...</p>
</div>
`).join('');
}
    analyzeSentiment(text) {
        const analysis = this.sentiment.analyze(text);
        
        // Get detailed sentiment scores
        const score = analysis.score;
        const comparative = analysis.comparative;
        const words = analysis.words;
        const positive = analysis.positive;
        const negative = analysis.negative;

        // Calculate sentiment category
        let sentiment;
        if (score > 0) {
            sentiment = score > 2 ? 'very positive' : 'positive';
        } else if (score < 0) {
            sentiment = score < -2 ? 'very negative' : 'negative';
        } else {
            sentiment = 'neutral';
        }

        // Return detailed sentiment analysis
        return {
            category: sentiment,
            score: score,
            comparative: comparative,
            positive: positive,
            negative: negative,
            words: words
        };
    }
        initializeElements() {
            this.newsGrid = document.querySelector('.news-grid');
            this.bookmarkedGrid = document.querySelector('.bookmarked-grid');
            this.searchInput = document.querySelector('.search-input');
            this.loadingElement = document.querySelector('.loading');
            this.errorMessage = document.querySelector('.error-message');
            this.bookmarkCount = document.querySelector('.bookmark-count');
            this.toast = document.querySelector('.toast');
        }

        attachEventListeners() {
            // Category selection
            document.querySelectorAll('.tag[data-category]').forEach(tag => {
                tag.addEventListener('click', () => this.toggleCategory(tag));
            });

            // Search functionality
            this.searchInput.addEventListener('input', this.debounce(() => {
                this.filterArticles();
            }, 300));

            // Navigation
            document.getElementById('showAll').addEventListener('click', () => this.showAllNews());
            document.getElementById('showBookmarks').addEventListener('click', () => this.showBookmarks());

            // Sort functionality
            document.querySelector('.sort-select').addEventListener('change', (e) => {
                this.sortArticles(e.target.value);
            });

            // Sentiment filtering
            document.querySelectorAll('.tag[data-sentiment]').forEach(tag => {
                tag.addEventListener('click', () => this.filterBySentiment(tag.dataset.sentiment));
            });
        }
        setupModal() {
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.modal.classList.remove('active');
        });
    }

    setupCountrySelector() {
        this.countrySelector.value = this.userPreferences.country || 'in';
        this.countrySelector.addEventListener('change', (e) => {
            this.userPreferences.country = e.target.value;
            this.saveUserPreferences();
            this.fetchNews();
        });
    }

    async fetchNews() {
try {
    this.setLoading(true);
    const category = Array.from(this.selectedCategories)[0] || 'general';
    const country = this.userPreferences?.country || 'us';
    
    const apiUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=10&apikey=${this.apiKey}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.articles) {
        this.articles = data.articles.map(article => ({
            ...article,
            sentiment: this.analyzeSentiment(article.title + ' ' + (article.description || '')),
            aiInsights: this.generateAIInsights(article),
            relatedTopics: this.generateRelatedTopics(article)
        }));
        
        this.renderArticles();
        this.renderTimeline();
    }
} catch (error) {
    console.error('Error fetching news:', error);
    this.showError('Failed to load news articles. Please try again later.');
} finally {
    this.setLoading(false);
}
}

showError(message) {
const errorElement = document.querySelector('.error-message');
errorElement.textContent = message;
errorElement.classList.add('active');
setTimeout(() => errorElement.classList.remove('active'), 5000);
}

        renderArticles(articles = this.articles) {
            const grid = this.currentView === 'all' ? this.newsGrid : this.bookmarkedGrid;
            grid.innerHTML = articles.map(article => this.createArticleCard(article)).join('');
            
            // Attach bookmark handlers
            grid.querySelectorAll('.bookmark-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest('.news-card');
                    this.toggleBookmark(card.dataset.id);
                });
            });
        }
        createArticleCard(article) {
        const sentimentAnalysis = this.analyzeSentiment(
            article.title + ' ' + (article.description || '')
        );
        
        const sentimentClass = sentimentAnalysis.category.replace(' ', '-');
        const isBookmarked = this.bookmarkedArticles.has(article.url);

        return `
            <article class="news-card" data-id="${article.url}">
                <img src="${article.image || '/api/placeholder/400/320'}" 
                     alt="News Image" 
                     class="card-image"
                     onerror="this.src='/api/placeholder/400/320'">
               <div class="card-content">
                    <div class="sentiment-details">
                        <span class="sentiment ${sentimentClass}">
                            ${sentimentAnalysis.category.toUpperCase()}
                        </span>
                        <div class="sentiment-score">
                            Score: ${sentimentAnalysis.score}
                        </div>
                    </div>
                    <h3 class="card-title">${article.title}</h3>
                    <p class="card-description">${article.description || ''}</p>
                    <div class="ai-insights">
                        <strong>AI Insights:</strong>
                        <p>This article has a ${sentimentAnalysis.category} tone.</p>
                        <p>Positive words: ${sentimentAnalysis.positive.join(', ')}</p>
                        <p>Negative words: ${sentimentAnalysis.negative.join(', ')}</p>
                    </div>
                    <a href="#" class="read-more" onclick="newsApp.showFullArticle('${article.url}'); return false;">
                        Read Full Article
                    </a>
                    <div class="card-actions">
                        <span class="source">${article.source.name}</span>
                        <button class="bookmark-btn">
                            <i class="fa${isBookmarked ? 's' : 'r'} fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }
    showFullArticle(articleUrl) {
        const article = this.articles.find(a => a.url === articleUrl);
        if (!article) return;

        const modalContent = `
            <h2>${article.title}</h2>
            <p><strong>Source:</strong> ${article.source.name}</p>
            <div class="ai-insights">
                <strong>AI Analysis:</strong>
                <p>${article.aiInsights}</p>
            </div>
            <div class="article-content">
                <p>${article.content}</p>
                <div class="related-articles">
                    <h3>Related Topics:</h3>
                    <div class="category-tags">
                        ${article.relatedTopics.map(topic => 
                            `<div class="tag">${topic}</div>`
                        ).join('')}
                    </div>
                </div>
            </div>
            <a href="${article.url}" target="_blank" class="read-more">
                Read Original Article
            </a>
        `;

        this.modal.querySelector('.modal-body').innerHTML = modalContent;
        this.modal.classList.add('active');
    }
    async generateAIInsights(article) {
        // Simulate AI analysis - In a real app, this would call an AI API
        const topics = this.extractKeyTopics(article.title + ' ' + article.description);
        const sentiment = this.analyzeSentiment(article.title + ' ' + article.description);
        
        return `This article discusses ${topics.join(', ')}. The overall tone is ${sentiment}, 
                suggesting ${this.getSentimentInsight(sentiment)}. Based on current trends, 
                this topic has ${this.getRelevanceScore(topics)} relevance to current events.`;
    }

    extractKeyTopics(text) {
        // Simple keyword extraction - could be replaced with actual NLP
        const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const topics = words.filter(word => 
            !commonWords.has(word) && word.length > 3
        ).slice(0, 3);
        
        return [...new Set(topics)];
    }

    generateRelatedTopics(article) {
        const mainTopics = this.extractKeyTopics(article.title);
        const relatedTerms = {
            technology: ['AI', 'Innovation', 'Digital'],
            business: ['Economy', 'Market', 'Industry'],
            politics: ['Policy', 'Government', 'International'],
            science: ['Research', 'Discovery', 'Development']
        };

        return mainTopics.flatMap(topic => 
            Object.values(relatedTerms).flat().slice(0, 3)
        );
    }

    getSentimentInsight(sentiment) {
        const insights = {
            positive: 'potential opportunities or improvements in this area',
            negative: 'challenges that may need attention',
            neutral: 'balanced perspective on the subject'
        };
        return insights[sentiment] || 'mixed implications';
    }

    getRelevanceScore(topics) {
        // Simulate relevance scoring - could be replaced with actual trend analysis
        return 'high';
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('userPreferences');
        return saved ? JSON.parse(saved) : {
            country: 'in',
            preferredCategories: [],
            readingHistory: []
        };
    }

    saveUserPreferences() {
        localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
    }
        toggleBookmark(articleId) {
            if (this.bookmarkedArticles.has(articleId)) {
                this.bookmarkedArticles.delete(articleId);
                this.showToast('Article removed from bookmarks');
            } else {
                this.bookmarkedArticles.add(articleId);
                this.showToast('Article bookmarked successfully');
            }
            this.updateBookmarkCount();
            this.saveBookmarks();
            this.renderArticles();
        }

        toggleCategory(tag) {
            const category = tag.dataset.category;
            if (this.selectedCategories.has(category)) {
                this.selectedCategories.delete(category);
                tag.style.background = 'var(--accent)';
            } else {
                this.selectedCategories.add(category);
                tag.style.background = 'var(--secondary)';
            }
            this.fetchNews();
        }

        filterArticles() {
            const searchTerm = this.searchInput.value.toLowerCase();
            const filtered = this.articles.filter(article => 
                article.title.toLowerCase().includes(searchTerm) ||
                (article.description || '').toLowerCase().includes(searchTerm)
            );
            this.renderArticles(filtered);
        }

        sortArticles(sortBy) {
            const sorted = [...this.articles].sort((a, b) => {
                const dateA = new Date(a.publishedAt);
                const dateB = new Date(b.publishedAt);
                return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
            });
            this.renderArticles(sorted);
        }

        filterBySentiment(sentiment) {
            const filtered = this.articles.filter(article => article.sentiment === sentiment);
            this.renderArticles(filtered);
        }

        analyzeSentiment(text) {
            // Simple sentiment analysis based on keyword matching
            const positiveWords = ['success', 'breakthrough', 'achievement', 'positive', 'growth'];
            const negativeWords = ['crisis', 'failure', 'decline', 'negative', 'loss'];
            
            text = text.toLowerCase();
            let score = 0;
            
            positiveWords.forEach(word => {
                if (text.includes(word)) score++;
            });
            
            negativeWords.forEach(word => {
                if (text.includes(word)) score--;
            });

            return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
        }

        showAllNews() {
            this.currentView = 'all';
            document.querySelector('.bookmarked-section').classList.remove('active');
            this.renderArticles();
        }

        showBookmarks() {
            this.currentView = 'bookmarks';
            document.querySelector('.bookmarked-section').classList.add('active');
            const bookmarkedArticles = this.articles.filter(article => 
                this.bookmarkedArticles.has(article.url)
            );
            this.renderArticles(bookmarkedArticles);
        }

        updateBookmarkCount() {
            this.bookmarkCount.textContent = this.bookmarkedArticles.size;
        }

        saveBookmarks() {
            localStorage.setItem('bookmarks', JSON.stringify(Array.from(this.bookmarkedArticles)));
        }

        loadBookmarks() {
            const saved = localStorage.getItem('bookmarks');
            if (saved) {
                this.bookmarkedArticles = new Set(JSON.parse(saved));
                this.updateBookmarkCount();
            }
        }

        setLoading(isLoading) {
            this.loading = isLoading;
            this.loadingElement.classList.toggle('active', isLoading);
        }

        showToast(message) {
            this.toast.textContent = message;
            this.toast.classList.add('active');
            setTimeout(() => {
                this.toast.classList.remove('active');
            }, 3000);
        }

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }



    // Initialize the app
    document.addEventListener('DOMContentLoaded', () => {
    const newsApp = new NewsApp();
});
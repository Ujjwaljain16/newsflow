

# **AI-Powered Personalized News Aggregator**

An intelligent news aggregator app that curates and analyzes news articles based on user preferences. With features like sentiment analysis, bookmarking, category filtering, and AI-generated insights, it delivers a personalized news-reading experience.


## **Features**
- **User Preferences:** Select favorite news categories and preferred country for tailored news.
- **Sentiment Analysis:** Automatic analysis of article tone (positive, negative, or neutral).
- **AI Insights:** Generate insights and related topics for each article.
- **Bookmarks:** Save favorite articles for easy access.
- **Search Functionality:** Quickly find articles by keyword.
- **Timeline View:** Display articles in chronological order.
- **Country Selector:** Fetch news based on the selected country.

---

## **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/news-aggregator.git
   cd news-aggregator
   ```

2. Open the `index.html` file in your browser:
   ```bash
   open index.html
   ```

3. (Optional) Serve the project locally:
   ```bash
   npm install -g http-server
   http-server
   ```

---

## **Usage**

### **Run the App**
- Open the app in your browser.
- Browse news articles, filter by category, and bookmark your favorites.

### **Key Components**
1. **Homepage**:
   - Browse the latest news articles.
   - Click on a category tag to filter news.
2. **Bookmarks**:
   - Access your saved articles in the "Bookmarks" section.
3. **Search**:
   - Use the search bar to filter articles by keywords.
4. **Sentiment Filtering**:
   - Filter articles based on their sentiment (positive, neutral, or negative).

---

## **Tech Stack**
- **Frontend**: HTML, CSS, JavaScript
- **API**: [GNews API](https://gnews.io/)
- **Storage**: LocalStorage for user preferences and bookmarks

---

## **How It Works**
1. **News Fetching**:
   - Fetches news articles from the GNews API based on user-selected categories and country preferences.
   
2. **Sentiment Analysis**:
   - Uses a keyword-based algorithm to classify article tone as positive, negative, or neutral.

3. **AI Insights**:
   - Extracts keywords and related topics using basic natural language processing techniques.

4. **User Preferences**:
   - Saves preferences (e.g., country, categories) in LocalStorage for a personalized experience.

---

## **Code Overview**

### **Key Files**
- **`index.html`**: Structure of the app.
- **`style.css`**: Styling for the UI/UX.
- **`app.js`**: Core logic for fetching news, analyzing sentiment, and rendering the UI.

### **Important Classes and Methods**
- **`NewsApp`**: The main class handling app initialization and logic.
  - `fetchNews()`: Fetches news articles using the GNews API.
  - `analyzeSentiment(text)`: Performs sentiment analysis.
  - `generateAIInsights(article)`: Generates AI-driven insights for articles.
  - `toggleBookmark(articleId)`: Handles bookmarking/unbookmarking articles.
  - `renderArticles()`: Renders articles dynamically on the page.

---


## **Future Enhancements**
- Integrate a machine learning-based sentiment analysis API for more accuracy.
- Enable multi-language support for international users.
- Add push notifications for breaking news.
- Build a backend using Node.js for user authentication and database storage.


---

## **Acknowledgments**
- [GNews API](https://gnews.io/) for news data.
- [Font Awesome](https://fontawesome.com/) for icons.

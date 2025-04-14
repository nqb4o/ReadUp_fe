import React, { useState, useEffect } from "react";
import MainContent from "../components/MainContent.js";
import Article from "../components/ArticleBox.js";
import Latest from "../components/Latest.js";
import { fetchArticleApi } from "../../services/ArticleService.js"; // Import API function

function ArticlePage() {
    const [selectedTag, setSelectedTag] = useState("All categories");
    const [searchTerm, setSearchTerm] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const response = await fetchArticleApi();
                setArticles(response.data); // Lưu danh sách bài viết từ API
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleTagSelect = (tag) => {
        setSelectedTag(tag);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <>
            <MainContent
                onTagSelect={handleTagSelect}
                onSearch={handleSearch}
                selectedTag={selectedTag}
            />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Article
                        articles={articles}
                        selectedTag={selectedTag}
                        searchTerm={searchTerm}
                    />
                    <Latest
                        articles={articles}
                        selectedTag={selectedTag}
                        searchTerm={searchTerm}
                    />
                </>
            )}
        </>
    );
}

export default ArticlePage;
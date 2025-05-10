import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    TextField,
    Modal,
} from "@mui/material";
import {
    fetchArticleApi,
    createArticleApi,
    updateArticleApi,
} from "../../services/ArticleService";

const ArticleManagement = () => {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        publicationDate: "",
        image: "", // Field for image URL
    });

    // Fetch articles from backend
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetchArticleApi();
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };
        fetchArticles();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (formData.id) {
                // Update existing article
                const response = await updateArticleApi(formData.id, formData);
                setArticles(
                    articles.map((article) =>
                        article.id === formData.id ? response.data : article
                    )
                );
            } else {
                // Create new article
                const response = await createArticleApi(formData);
                setArticles([...articles, response.data]);
            }
        } catch (error) {
            console.error("Error submitting article:", error);
        }
    };

    return (
        <Box>
            <Button variant="contained" onClick={() => setFormData({})}>Add Article</Button>
            <Modal open={!!formData} onClose={() => setFormData(null)}>
                <Paper>
                    <TextField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                    />
                    <TextField
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleFormChange}
                    />
                    <TextField
                        label="Publication Date"
                        name="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleFormChange}
                    />
                    <TextField
                        label="Image URL" // Input for image URL
                        name="image"
                        value={formData.image}
                        onChange={handleFormChange}
                    />
                    <Button onClick={handleSubmit}>Submit</Button>
                </Paper>
            </Modal>
        </Box>
    );
};

export default ArticleManagement;
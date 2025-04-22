import React from "react";
import {
    Box,
    Typography,
    Container,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    styled,
    alpha,
    Stack,
    Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TranslateIcon from "@mui/icons-material/Translate";
import TimerIcon from "@mui/icons-material/Timer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Styled components
const FeatureSection = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow:
        theme.palette.mode === "light"
            ? "0 5px 20px rgba(0, 0, 0, 0.08)"
            : `0 5px 20px ${alpha(theme.palette.common.black, 0.2)}`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        scale: "1.05",
    },
    animationFillMode: "forwards",
    opacity: 1,
    backgroundColor: "#f7d9ff",
}));

const FeatureImage = styled(CardMedia)(({ theme }) => ({
    borderRadius: theme.spacing(1),
    transition: "transform 0.3s ease",
}));

const StatCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: "center",
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[8],
    },
    backgroundColor: "#fff",
    height: "100%"
}));

const MethodCard = styled(Card)(({ theme }) => ({
    height: "100%",
    borderRadius: theme.spacing(2),
    overflow: "hidden",
    boxShadow: theme.shadows[3],
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[8],
    },
}));

const PurpleButton = styled(Button)(({ theme }) => ({
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "50px",
    textTransform: "none",
    padding: theme.spacing(1.5, 4),
    fontSize: "1rem",
    backgroundColor: "#4255ff",
    border: "none",
    "&:hover": {
        backgroundColor: "#423ed8",
    },
}));

const VocabularyLanding = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    backgroundColor: "#d4ffc8",
                    width: "100vw",
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                    paddingTop: 16,
                }}
            >
                <Container maxWidth="lg"  >
                    <FeatureSection
                        sx={{
                            px: 4,
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            "&:hover": {
                                scale: 1,
                            },
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6} sx={{}}>
                                <Typography variant="h2" fontWeight="bold" gutterBottom>
                                    Học từ vựng thông minh
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="text.secondary"
                                    sx={{ mb: 4 }}
                                >
                                    Phương pháp học từ vựng hiệu quả với công nghệ spaced repetition và trí tuệ nhân tạo.
                                    Tăng vốn từ vựng của bạn nhanh chóng và nhớ lâu hơn.
                                </Typography>
                                <Box sx={{ mb: 6 }}>
                                    <Stack spacing={3}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <TranslateIcon sx={{ fontSize: 40, color: "#4255ff" }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Dịch tức thì
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Dịch ngay lập tức các từ mới bạn gặp trong bài đọc
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <LibraryBooksIcon sx={{ fontSize: 40, color: "#4255ff" }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Thư viện từ vựng cá nhân
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Tự động lưu trữ tất cả từ vựng bạn học được
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <TimerIcon sx={{ fontSize: 40, color: "#4255ff" }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Ôn tập thông minh
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Hệ thống nhắc nhở thông minh giúp bạn nhớ từ vựng lâu hơn
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Box>
                                <PurpleButton
                                    size="large"
                                    onClick={() => navigate("/vocabulary/learn")}
                                >
                                    Bắt đầu học ngay
                                </PurpleButton>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FeatureImage
                                    component="img"
                                    image="https://images.prismic.io/quizlet-web/YWZjMDdiMzQtZjNkOS00YTFiLWE1N2QtNzIxMjNhOGM2NjA2_ee031c32-3c69-4b72-9a97-d1ffdc4db9af_04flashcards.gif?auto=compress,format&rect=0,0,800,1079&w=800&h=1079"
                                    alt="Học từ vựng"
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                    </FeatureSection>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container sx={{ py: 8 }} maxWidth="lg">
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    textAlign="center"
                    gutterBottom
                >
                    Tại sao chọn chúng tôi?
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
                >
                    Phương pháp học từ vựng hiệu quả được chứng minh bởi nhiều người học
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="#4255ff"
                                gutterBottom
                            >
                                85%
                            </Typography>
                            <Typography variant="body1">
                                người dùng cải thiện điểm số sau 2 tuần sử dụng
                            </Typography>
                        </StatCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="#4255ff"
                                gutterBottom
                            >
                                5x
                            </Typography>
                            <Typography variant="body1">
                                tăng tốc độ ghi nhớ từ vựng so với phương pháp truyền thống
                            </Typography>
                        </StatCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="#4255ff"
                                gutterBottom
                            >
                                10M+
                            </Typography>
                            <Typography variant="body1">
                                từ vựng đã được thêm vào thư viện cá nhân của người dùng
                            </Typography>
                        </StatCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color="#4255ff"
                                gutterBottom
                            >
                                92%
                            </Typography>
                            <Typography variant="body1">
                                người dùng tiếp tục sử dụng sau tháng đầu tiên
                            </Typography>
                        </StatCard>
                    </Grid>
                </Grid>
            </Container>

            {/* How It Works Section */}
            <Box
                sx={{
                    backgroundColor: "#fff",
                    py: 8,
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        textAlign="center"
                        gutterBottom
                    >
                        Cách hoạt động
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ mb: 6, maxWidth: 800, mx: "auto" }}
                    >
                        Học từ vựng hiệu quả chỉ với 3 bước đơn giản
                    </Typography>

                    <Grid container spacing={4} alignItems="stretch">
                        <Grid item xs={12} md={4}>
                            <MethodCard>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="https://images.prismic.io/quizlet-web/NjY5ODJkY2MtMGNmMi00ZjI2LWIyMjEtMDc0MzE5YWMzNzdh_31c85d7d-9e36-40a4-9fae-5027c355ddee_flashcards-1.gif?auto=compress,format&rect=0,0,1000,680&w=1000&h=680"
                                    alt="Đọc và thu thập từ vựng"
                                />
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        1. Đọc và thu thập từ vựng
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Đọc các bài báo trên nền tảng của chúng tôi và nhấp vào bất kỳ từ nào bạn muốn học.
                                        Hệ thống sẽ tự động thêm từ này vào thư viện cá nhân của bạn.
                                    </Typography>
                                </CardContent>
                            </MethodCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MethodCard>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="https://images.prismic.io/quizlet-web/ZGI4ZTI1ZWUtYzI2MC00NWIyLWExNzMtNzlhMDNjYTkxYWQ1_413f92d0-ab2e-48bf-b90c-dc2d53540504_fromuni.png?auto=compress,format&rect=0,0,1001,1000&w=1001&h=1000"
                                    alt="Học với flashcard"
                                />
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        2. Học với flashcard
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Sử dụng hệ thống flashcard thông minh để ôn tập từ vựng.
                                        Chế độ học đa dạng: lật thẻ, trắc nghiệm, viết đáp án, và nhiều hơn nữa.
                                    </Typography>
                                </CardContent>
                            </MethodCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MethodCard>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="https://images.prismic.io/quizlet-web/ZGU5NGZkZTAtNzRlOS00MWUxLWI1YmUtOTQ1ZjkzMmE2YjZl_7ae82b39-4edc-4d12-963e-cc864b6d9a05_learnandtest-mobile2.gif?auto=compress,format&rect=0,0,800,593&w=800&h=593"
                                    alt="Theo dõi tiến độ"
                                />
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        3. Theo dõi tiến độ
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        AI phân tích việc học của bạn và đề xuất khi nào nên ôn tập lại từng từ.
                                        Theo dõi tiến độ học tập và thấy vốn từ vựng của bạn phát triển.
                                    </Typography>
                                </CardContent>
                            </MethodCard>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container sx={{ py: 8 }} maxWidth="lg">
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <FeatureImage
                            component="img"
                            image="https://images.prismic.io/quizlet-web/NWM1MDNiYzQtY2JjYy00ZjRkLTgyNmEtOGY4ZjBmZTc3MDNi_1d359d1f-be06-481d-af18-30a4d93b3b0f_commute-image.png?auto=compress,format&rect=0,0,1001,1000&w=1001&h=1000"
                            alt="AI phân tích từ vựng"
                            sx={{ width: "100%", borderRadius: 2 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            AI phân tích từ vựng
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 4 }}
                        >
                            Hệ thống AI của chúng tôi phân tích mức độ khó của từng từ dựa trên nhiều yếu tố:
                            tần suất xuất hiện, độ phức tạp, và khả năng nhớ của bạn.
                        </Typography>
                        <Stack spacing={3} sx={{ mb: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <TrendingUpIcon sx={{ color: "#4255ff", fontSize: 30 }} />
                                <Typography variant="body1">
                                    <strong>Phân tích tiến độ học tập</strong> - Theo dõi quá trình học và nhận báo cáo chi tiết
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <TrendingUpIcon sx={{ color: "#4255ff", fontSize: 30 }} />
                                <Typography variant="body1">
                                    <strong>Lịch học cá nhân hóa</strong> - Gợi ý thời điểm tối ưu để ôn tập từng từ
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <TrendingUpIcon sx={{ color: "#4255ff", fontSize: 30 }} />
                                <Typography variant="body1">
                                    <strong>Đề xuất từ liên quan</strong> - Học thêm các từ cùng chủ đề để mở rộng vốn từ
                                </Typography>
                            </Box>
                        </Stack>
                        <PurpleButton
                            size="large"
                            onClick={() => navigate("/vocabulary/analytics")}
                        >
                            Xem demo phân tích
                        </PurpleButton>
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile App Section */}
            <Box
                sx={{
                    backgroundColor: "#f7d9ff",
                    py: 8,
                    width: "100vw",
                    position: "relative",
                    left: "50%",
                    right: "50%",
                    marginLeft: "-50vw",
                    marginRight: "-50vw",
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Học mọi lúc mọi nơi
                            </Typography>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ mb: 4 }}
                            >
                                Tải ứng dụng di động của chúng tôi để học từ vựng bất cứ khi nào bạn có thời gian rảnh -
                                trên xe buýt, khi chờ đợi, hoặc trước khi đi ngủ.
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4 }}>
                                Đồng bộ hóa từ vựng giữa các thiết bị. Bạn sẽ không bao giờ bỏ lỡ lịch ôn tập
                                với thông báo thông minh từ ứng dụng của chúng tôi.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button
                                    sx={{
                                        width: 130,
                                        height: 40,
                                        backgroundImage: `url("https://assets.quizlet.com/_next/static/media/apple.4170bb1a.png")`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        borderRadius: 1,
                                        padding: 0,
                                        minWidth: 0,
                                    }}
                                />
                                <Button
                                    sx={{
                                        width: 130,
                                        height: 40,
                                        backgroundImage: `url("https://assets.quizlet.com/_next/static/media/google_play.fca45251.png")`,
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        borderRadius: 1,
                                        padding: 0,
                                        minWidth: 0,
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    position: "relative",
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.prismic.io/quizlet-web/NWM1MDNiYzQtY2JjYy00ZjRkLTgyNmEtOGY4ZjBmZTc3MDNi_1d359d1f-be06-481d-af18-30a4d93b3b0f_commute-image.png?auto=compress,format&rect=0,0,1001,1000&w=1001&h=1000"
                                    alt="Mobile App"
                                    sx={{
                                        width: "80%",
                                        maxWidth: 300,
                                        borderRadius: 2,
                                        boxShadow: 10,
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Container sx={{ py: 10 }} maxWidth="md">
                <Box
                    sx={{
                        textAlign: "center",
                        backgroundColor: "#4255ff",
                        borderRadius: 4,
                        p: 6,
                        color: "white",
                    }}
                >
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Sẵn sàng cải thiện vốn từ vựng?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Bắt đầu hành trình học từ vựng hiệu quả ngay hôm nay.
                        Đăng ký miễn phí và trải nghiệm sự khác biệt.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            backgroundColor: "white",
                            color: "#4255ff",
                            fontWeight: "bold",
                            borderRadius: 50,
                            px: 4,
                            py: 1.5,
                            fontSize: "1.1rem",
                            textTransform: "none",
                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.9)",
                            },
                        }}
                        onClick={() => navigate("/register")}
                    >
                        Đăng ký miễn phí
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default VocabularyLanding;
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Container,
    IconButton,
    Avatar,
    CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/AppAppBar';

function Payment(props) {
    const navigate = useNavigate();
    const { cartItems, removeFromCart } = useCart();

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const shipmentCost = 6.50;
    const taxCost = 0.80;
    const total = subtotal + shipmentCost + taxCost;

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle payment processing
        console.log('Payment submitted', { formData, cartItems });
        // Clear cart or show success modal
        cartItems.forEach(item => removeFromCart(item.book_id));
        navigate('/order-confirmation');
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Container maxWidth="lg" sx={{ mt: 12 }}>
                <Box sx={{ my: 4 }}>
                    {/* Back Navigation */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <IconButton onClick={() => navigate(-1)}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography>Back</Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            {/* Shipping Address */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Shipping Address</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography>First Name</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Last Name</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>Phone Number</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>Street Address</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Payment Details */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Payment Details</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography>Cardholder Name</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="cardHolderName"
                                            value={formData.cardHolderName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>Card Number</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Expiration Date</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>CVV</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            type="password"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Order Details */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Order Details</Typography>
                                {cartItems.map((item) => (
                                    <Box
                                        key={item.book_id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            src={item.image}
                                            alt={item.title}
                                            sx={{ width: 60, height: 60, mr: 2 }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography><strong>{item.title}</strong></Typography>
                                            <Typography>Price: ${item.price}</Typography>
                                            <Typography>Quantity: {item.quantity}</Typography>
                                        </Box>
                                        <Typography>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Grid>

                            {/* Order Summary */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>Subtotal ({cartItems.length} items):</Typography>
                                        <Typography>${subtotal.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>Shipment Cost:</Typography>
                                        <Typography>$6.50</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>Tax:</Typography>
                                        <Typography>$0.80</Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 2,
                                        pt: 2,
                                        borderTop: '1px solid #ddd'
                                    }}>
                                        <Typography variant="h6">Total:</Typography>
                                        <Typography variant="h6">
                                            ${total.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Confirm Payment
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
        </AppTheme >
    );
}

export default Payment;
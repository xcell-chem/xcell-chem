<?php

// create_order.php
// Add your comments here.

onApprove: function(data, actions) {
    // Capture the payment after approval
    return actions.order.capture().then(function(details) {
        alert('Transaction completed by ' + details.payer.name.given_name);

        // Prepare data to be sent to your server
        const totalAmount = parseFloat(document.getElementById('totalAmount').textContent);
        const referralCookie = document.cookie.split('; ').find(row => row.startsWith('referral='));
        const referralCode = referralCookie ? referralCookie.split('=')[1] : null;

        const salesData = {
            sales_ID: 'sales_' + Date.now(), // Unique sales ID
            basket: JSON.stringify(cart), // Cart items in JSON format
            total: totalAmount,
            referral: referralCode
        };

        // Send the sales data to your server after the payment is approved
        fetch('insert_sales.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(salesData) // Send data to insert_sales.php
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Record added successfully:', data);
            } else {
                console.error('Error adding record:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

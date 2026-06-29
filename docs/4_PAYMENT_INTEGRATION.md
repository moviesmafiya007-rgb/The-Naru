# 4. Payment Integration & Subscription Guide

## Complete Payment System Implementation

### Supported Payment Gateways
- **Razorpay** (Recommended for India)
- **Stripe** (Global)
- **PayPal** (Optional)

---

## Backend Payment APIs

### 1. SUBSCRIPTION ENDPOINTS

#### 1.1 Get Available Plans
```
GET /subscriptions/plans

Response (200):
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Free Trial",
            "price": 0,
            "billing_cycle": "monthly",
            "duration_days": 30,
            "features": ["5 free quizzes/month", "Limited materials"],
            "max_quizzes_per_day": 1,
            "helpdesk_priority": "low"
        },
        {
            "id": 2,
            "name": "Basic",
            "price": 299,
            "billing_cycle": "monthly",
            "duration_days": 30,
            "features": ["Unlimited quizzes", "All materials", "Priority support"],
            "max_quizzes_per_day": 10,
            "helpdesk_priority": "medium"
        },
        {
            "id": 3,
            "name": "Premium",
            "price": 699,
            "billing_cycle": "monthly",
            "duration_days": 30,
            "features": ["Everything in Basic", "Advanced analytics", "1-on-1 mentoring"],
            "max_quizzes_per_day": 999,
            "helpdesk_priority": "high"
        },
        {
            "id": 4,
            "name": "Pro Yearly",
            "price": 5999,
            "billing_cycle": "yearly",
            "duration_days": 365,
            "features": ["Everything in Premium", "Live sessions", "24/7 support"],
            "max_quizzes_per_day": 999,
            "helpdesk_priority": "high"
        }
    ]
}
```

#### 1.2 Get Current Subscription
```
GET /subscriptions/current
Authorization: Bearer <token>

Response (200):
{
    "success": true,
    "data": {
        "id": 5,
        "plan": {
            "id": 2,
            "name": "Basic",
            "price": 299
        },
        "status": "active",
        "subscription_start_date": "2026-06-01T00:00:00Z",
        "subscription_end_date": "2026-07-01T00:00:00Z",
        "renewal_date": "2026-07-01T00:00:00Z",
        "days_remaining": 2,
        "is_auto_renew": true,
        "features": [...]
    }
}
```

#### 1.3 Subscribe to Plan
```
POST /subscriptions/subscribe
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "plan_id": 2,
    "promo_code": "SAVE20",
    "payment_method_id": "card_123"
}

Response (201):
{
    "success": true,
    "message": "Payment initiated",
    "data": {
        "subscription_id": 5,
        "amount": 239.20,
        "currency": "INR",
        "promo_discount": 59.80,
        "payment_method": "razorpay",
        "razorpay_order_id": "order_9A33XWu170gUtm",
        "razorpay_key": "rzp_test_1Aa00000000001"
    }
}
```

#### 1.4 Cancel Subscription
```
POST /subscriptions/cancel
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "subscription_id": 5,
    "reason": "Too expensive"
}

Response (200):
{
    "success": true,
    "message": "Subscription cancelled successfully",
    "data": {
        "status": "cancelled",
        "refund_amount": 150,
        "refund_status": "initiated",
        "access_until": "2026-07-01T00:00:00Z"
    }
}
```

#### 1.5 Pause Subscription
```
POST /subscriptions/pause
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "subscription_id": 5,
    "pause_days": 30
}

Response (200):
{
    "success": true,
    "message": "Subscription paused for 30 days",
    "resume_date": "2026-07-29T00:00:00Z"
}
```

---

### 2. PAYMENT ENDPOINTS

#### 2.1 Create Payment Order (Razorpay)
```
POST /payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "plan_id": 2,
    "amount": 299,
    "currency": "INR",
    "promo_code": "SAVE20"
}

Response (200):
{
    "success": true,
    "data": {
        "order_id": "order_9A33XWu170gUtm",
        "amount": 239.20,
        "currency": "INR",
        "key": "rzp_test_1Aa00000000001",
        "user_email": "user@example.com",
        "user_phone": "+91-9876543210",
        "receipt": "receipt_9A33XWu170gUtm"
    }
}
```

#### 2.2 Verify Payment (Razorpay)
```
POST /payments/verify
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "razorpay_order_id": "order_9A33XWu170gUtm",
    "razorpay_payment_id": "pay_9A34xOmPzg8X5s",
    "razorpay_signature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a"
}

Response (200):
{
    "success": true,
    "message": "Payment verified successfully",
    "data": {
        "payment_id": 123,
        "status": "completed",
        "subscription_activated": true,
        "subscription_valid_until": "2026-07-01T00:00:00Z",
        "invoice_url": "https://..."
    }
}
```

#### 2.3 Get Payment History
```
GET /payments/history?page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
    "success": true,
    "data": [
        {
            "id": 123,
            "amount": 299,
            "currency": "INR",
            "plan_name": "Basic",
            "status": "completed",
            "transaction_id": "pay_9A34xOmPzg8X5s",
            "paid_at": "2026-06-01T10:30:00Z",
            "invoice_url": "https://...",
            "receipt_url": "https://..."
        }
    ]
}
```

---

### 3. PROMOTIONAL CODE ENDPOINTS

#### 3.1 Validate Promotional Code
```
POST /promotions/validate
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
    "code": "SAVE20",
    "plan_id": 2
}

Response (200):
{
    "success": true,
    "data": {
        "code": "SAVE20",
        "discount_type": "percentage",
        "discount_value": 20,
        "original_price": 299,
        "discount_amount": 59.80,
        "final_price": 239.20,
        "valid_until": "2026-12-31T00:00:00Z"
    }
}
```

---

### 4. ACCESS CONTROL ENDPOINTS

#### 4.1 Check Quiz Access
```
GET /access/quiz/:quizId
Authorization: Bearer <token>

Response (200):
{
    "success": true,
    "data": {
        "has_access": true,
        "requires_subscription": false,
        "min_plan_required": null,
        "your_plan": "Basic",
        "message": "You have access to this quiz"
    }
}

Response (403):
{
    "success": false,
    "error": {
        "code": "SUBSCRIPTION_REQUIRED",
        "message": "Premium subscription required to access this quiz",
        "required_plan": "Premium",
        "upgrade_url": "https://..."
    }
}
```

#### 4.2 Check Material Access
```
GET /access/material/:materialId
Authorization: Bearer <token>

Response (200/403): Similar to quiz access
```

---

## Frontend Integration (React)

### Payment Integration with Razorpay

```javascript
// File: frontend/src/components/PaymentButton.jsx

import React, { useState } from 'react';
import axios from 'axios';

const PaymentButton = ({ planId, planPrice, planName }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/create-order`,
        { plan_id: planId, amount: planPrice },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const options = {
        key: data.data.key,
        amount: data.data.amount * 100,
        currency: 'INR',
        name: 'The Naru',
        description: `${planName} Subscription`,
        order_id: data.data.order_id,
        handler: async (response) => {
          // Verify payment
          const verifyRes = await axios.post(
            `${process.env.REACT_APP_API_URL}/payments/verify`,
            {
              razorpay_order_id: data.data.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          if (verifyRes.data.success) {
            alert('Payment successful!');
            window.location.href = '/dashboard';
          }
        },
        prefill: {
          email: localStorage.getItem('userEmail'),
          contact: localStorage.getItem('userPhone')
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    >
      {loading ? 'Processing...' : `Subscribe for ₹${planPrice}`}
    </button>
  );
};

export default PaymentButton;
```

### Subscription Plans Display

```javascript
// File: frontend/src/pages/SubscriptionPlans.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaymentButton from '../components/PaymentButton';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/subscriptions/plans`
      );
      setPlans(data.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading plans...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      {plans.map((plan) => (
        <div key={plan.id} className="border rounded-lg p-6 shadow-lg">
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <div className="text-3xl font-bold mb-2">
            ₹{plan.price}
            <span className="text-sm text-gray-600">/{plan.billing_cycle}</span>
          </div>
          <ul className="mb-6 space-y-2">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <PaymentButton
            planId={plan.id}
            planPrice={plan.price}
            planName={plan.name}
          />
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
```

---

## Webhook Handling (Payment Status Updates)

```javascript
// File: backend/src/routes/webhooks.js

const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

router.post('/razorpay', async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === 'payment.authorized' || event === 'payment.captured') {
      // Update payment status in database
      await updatePaymentStatus(
        payload.payment.entity.id,
        'completed'
      );

      // Activate subscription
      await activateSubscription(
        payload.payment.entity.notes.user_id,
        payload.payment.entity.notes.subscription_id
      );
    }

    if (event === 'payment.failed') {
      await updatePaymentStatus(
        payload.payment.entity.id,
        'failed'
      );
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Security Considerations

1. **PCI Compliance**: Never store credit card details
2. **Signature Verification**: Always verify payment signatures
3. **HTTPS Only**: All payment endpoints must use HTTPS
4. **Rate Limiting**: Implement rate limiting on payment APIs
5. **Encryption**: Encrypt sensitive payment data
6. **Audit Logs**: Log all payment transactions

---

**Last Updated**: June 29, 2026
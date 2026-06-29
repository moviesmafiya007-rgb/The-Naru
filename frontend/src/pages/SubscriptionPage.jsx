import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/subscriptions/plans`
        );
        setPlans(response.data.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-gray-800">⭐ Subscription Plans</h1>
        <p className="text-gray-600 mb-12">Choose the perfect plan for your exam preparation</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`rounded-lg p-6 transition transform hover:scale-105 ${
                currentPlan?.id === plan.id
                  ? 'bg-blue-50 border-2 border-blue-600'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              <div className="text-4xl font-bold mb-2 text-blue-600">
                ₹{plan.price}
                <span className="text-sm text-gray-600">/{plan.billing_cycle}</span>
              </div>

              <ul className="mb-6 space-y-2">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {currentPlan?.id === plan.id ? (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-2 rounded-lg font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  {plan.price === 0 ? 'Start Free' : 'Upgrade Now'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
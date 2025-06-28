// services/subscriptionService.js
import { apiConfig } from '../config/apiConfig';

export const saveSubscriptionToAzure = async (user, userInfo, stripeData) => {
  try {
    const userId = user.localAccountId || user.username;
    const userCountry = userInfo?.country || 'United States';
    
    // Determine tier from product name or price
    let tier = 'standard';
    if (stripeData.productName?.toLowerCase().includes('silver')) tier = 'silver';
    else if (stripeData.productName?.toLowerCase().includes('gold')) tier = 'gold';
    else if (stripeData.productName?.toLowerCase().includes('platinum')) tier = 'platinum';
    
    const response = await fetch(`${apiConfig.backendUrl}/save-subscription?code=${apiConfig.functionKeys.saveSubscription}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.idToken}`
      },
      body: JSON.stringify({
        userId: userId,
        country: userCountry,
        subscriptionInfo: {
          tier: tier,
          status: 'active',
          stripeCustomerId: stripeData.customerId,
          stripeSubscriptionId: stripeData.subscriptionId,
          productName: stripeData.productName,
          currentPeriodStart: stripeData.currentPeriodStart,
          currentPeriodEnd: stripeData.currentPeriodEnd
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
};
// src/services/challengeService.js
import { apiConfig } from '../config/apiConfig';

class ChallengeService {
  // Join a challenge
  async joinChallenge(userId, challengeType, additionalData = {}) {
    try {
      const url = `${apiConfig.backendUrl}/api/challenge-tracker?action=join&userId=${userId}&challengeType=${challengeType}&code=${apiConfig.functionKeys.challengeTracker}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          challengeType,
          ...additionalData
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to join challenge: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }

  // Update challenge progress
  async updateProgress(userId, challengeType, progress) {
    try {
      const url = `${apiConfig.backendUrl}/api/challenge-tracker?action=update&userId=${userId}&challengeType=${challengeType}&code=${apiConfig.functionKeys.challengeTracker}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          challengeType,
          increment: progress // Can be steps, pounds lost, glasses drunk, etc.
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update challenge: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw error;
    }
  }

  // Get user's challenges
  async getUserChallenges(userId) {
    try {
      const url = `${apiConfig.backendUrl}/api/challenge-tracker?action=get&userId=${userId}&code=${apiConfig.functionKeys.challengeTracker}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get challenges: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting challenges:', error);
      throw error;
    }
  }

  // Leave a challenge
  async leaveChallenge(userId, challengeType) {
    try {
      const url = `${apiConfig.backendUrl}/api/challenge-tracker?action=leave&userId=${userId}&challengeType=${challengeType}&code=${apiConfig.functionKeys.challengeTracker}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          challengeType
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to leave challenge: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error leaving challenge:', error);
      throw error;
    }
  }

  // Auto-update step challenges when syncing IoMT data
  async syncStepChallenges(userId, todaySteps) {
    try {
      const challenges = await this.getUserChallenges(userId);
      
      // Check for active step-based challenges
      const stepChallenges = challenges.active?.filter(c => 
        c.type === 'million-steps' && c.status === 'active'
      );
      
      if (stepChallenges && stepChallenges.length > 0) {
        // Update each active step challenge
        for (const challenge of stepChallenges) {
          // Calculate today's contribution (avoid double counting)
          const lastUpdate = new Date(challenge.lastActivity || challenge.startDate);
          const today = new Date();
          
          if (lastUpdate.toDateString() !== today.toDateString()) {
            // New day, update with today's steps
            await this.updateProgress(userId, challenge.type, todaySteps);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing step challenges:', error);
      return false;
    }
  }
}

// Export singleton instance
const challengeService = new ChallengeService();
export default challengeService;
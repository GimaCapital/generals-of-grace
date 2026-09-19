// backend/src/models/Competition.js
const Database = require('../config/database');
const { logger } = require('../utils/logger');
const Soul = require('./Soul');

const COLLECTION = 'competitions';
const PARTICIPANTS = 'competitionParticipants';

class Competition {
  /**
   * Create a new competition (admin only)
   */
  static async create(data) {
    try {
      const comp = {
        name: data.name,
        description: data.description || '',
        theme: data.theme || '',
        startDate: data.startDate,
        endDate: data.endDate,
        goal: data.goal || 0,
        teamType: data.teamType || 'zone', // "zone" | "department" | "age-group"
        status: data.status || 'upcoming',
        createdBy: data.createdBy,
        createdAt: new Date().toISOString(),
      };
      const id = await Database.createDoc(COLLECTION, comp);
      logger.info(`🏆 Competition created: ${comp.name}`);
      return { id, ...comp };
    } catch (error) {
      logger.error('Error creating competition:', error);
      throw error;
    }
  }

  /**
   * Get all competitions
   */
  static async getAll() {
    try {
      const snapshot = await Database.getCollection(COLLECTION).get();
      const comps = [];
      snapshot.forEach((doc) => comps.push({ id: doc.id, ...doc.data() }));
      return comps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      logger.error('Error getting competitions:', error);
      throw error;
    }
  }

  /**
   * Get competitions with status = active
   */
  static async getActive() {
    const all = await this.getAll();
    return all.filter((c) => c.status === 'active');
  }

  /**
   * Get a competition by ID
   */
  static async getById(id) {
    return Database.getDoc(COLLECTION, id);
  }

  /**
   * Update a competition
   */
  static async update(id, data) {
    return Database.updateDoc(COLLECTION, id, data);
  }

  /**
   * Delete a competition
   */
  static async delete(id) {
    return Database.deleteDoc(COLLECTION, id);
  }

  /**
   * Add a participant to a competition (join a team)
   */
  static async join(competitionId, userId, teamId, teamName) {
    try {
      const existing = await Database.getDocs(
        PARTICIPANTS,
        [
          { field: 'competitionId', operator: '==', value: competitionId },
          { field: 'userId', operator: '==', value: userId },
        ]
      );
      if (existing.length > 0) {
        return existing[0];
      }

      const record = {
        competitionId,
        userId,
        teamId,
        teamName,
        soulsWon: 0,
        joinedAt: new Date().toISOString(),
      };
      const id = await Database.createDoc(PARTICIPANTS, record);
      return { id, ...record };
    } catch (error) {
      logger.error('Error joining competition:', error);
      throw error;
    }
  }

  /**
   * Get participant record for a user in a competition
   */
  static async getParticipant(competitionId, userId) {
    try {
      const results = await Database.getDocs(
        PARTICIPANTS,
        [
          { field: 'competitionId', operator: '==', value: competitionId },
          { field: 'userId', operator: '==', value: userId },
        ]
      );
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      logger.error('Error getting participant:', error);
      throw error;
    }
  }

    /**
   * Update a participant's team (used for team changes)
   */
  static async updateParticipant(participantId, data) {
    return Database.updateDoc(PARTICIPANTS, participantId, data);
  }

  /**
   * Change a participant's team (one-time switch only)
   * Returns:
   *   { success: true, participant } on success
   *   { success: false, reason: 'not_joined' | 'already_switched' | 'same_team' }
   */
  static async changeTeam(competitionId, userId, newTeamId, newTeamName) {
    try {
      const participant = await this.getParticipant(competitionId, userId);

      if (!participant) {
        return { success: false, reason: 'not_joined' };
      }

      if (participant.switched === true) {
        return { success: false, reason: 'already_switched' };
      }

      if (participant.teamId === newTeamId) {
        return { success: false, reason: 'same_team' };
      }

      const update = {
        teamId: newTeamId,
        teamName: newTeamName,
        switched: true,
        switchedAt: new Date().toISOString(),
        previousTeamId: participant.teamId,
        previousTeamName: participant.teamName,
      };

      await this.updateParticipant(participant.id, update);

      return {
        success: true,
        participant: { ...participant, ...update },
      };
    } catch (error) {
      logger.error('Error changing team:', error);
      throw error;
    }
  }

  /**
   * Build the full leaderboard for a competition:
   *   - groups participants by team
   *   - counts each team's total souls from the souls collection
   *   - returns team standings sorted by souls desc
   */
  static async getLeaderboard(competitionId) {
    try {
      const participants = await Database.getDocs(
        PARTICIPANTS,
        [{ field: 'competitionId', operator: '==', value: competitionId }]
      );

      // Group by team
      const teams = {};
      for (const p of participants) {
        if (!teams[p.teamId]) {
          teams[p.teamId] = {
            teamId: p.teamId,
            teamName: p.teamName || p.teamId,
            memberIds: [],
            memberCount: 0,
            soulsWon: 0,
          };
        }
        teams[p.teamId].memberIds.push(p.userId);
        teams[p.teamId].memberCount++;
      }

      // Count souls per team (from souls collection)
      for (const teamId of Object.keys(teams)) {
        const team = teams[teamId];
        team.soulsWon = await Soul.countByUsers(team.memberIds);
      }

      // Sort by souls desc
      const leaderboard = Object.values(teams).sort(
        (a, b) => b.soulsWon - a.soulsWon
      );

      // Add rank
      leaderboard.forEach((t, i) => (t.rank = i + 1));

      return leaderboard;
    } catch (error) {
      logger.error('Error building leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get church-wide total souls across all participants
   */
  static async getChurchTotal(competitionId) {
    const leaderboard = await this.getLeaderboard(competitionId);
    return leaderboard.reduce((sum, t) => sum + t.soulsWon, 0);
  }

    /**
   * Auto-start upcoming competitions whose start date has passed
   */
  static async autoStart() {
    try {
      const now = new Date().toISOString();
      const all = await this.getAll();
      const ready = all.filter(
        (c) => c.status === 'upcoming' && c.startDate && c.startDate <= now
      );

      for (const comp of ready) {
        await Database.updateDoc(COLLECTION, comp.id, { status: 'active' });
        logger.info(`▶️  Competition auto-started: ${comp.name}`);
      }

      return ready.length;
    } catch (error) {
      logger.error('Error auto-starting competitions:', error);
      return 0;
    }
  }

  /**
   * Auto-complete active competitions whose end date has passed
   */
  static async autoComplete() {
    try {
      const now = new Date().toISOString();
      const all = await this.getAll();
      const stale = all.filter(
        (c) => c.status === 'active' && c.endDate && c.endDate < now
      );

      for (const comp of stale) {
        await Database.updateDoc(COLLECTION, comp.id, { status: 'completed' });
        logger.info(`🏁 Competition auto-completed: ${comp.name}`);
      }

      return stale.length;
    } catch (error) {
      logger.error('Error auto-completing competitions:', error);
      return 0;
    }
  }
}

module.exports = Competition;
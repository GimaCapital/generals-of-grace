// frontend/src/components/dashboard/tabs/CompetitionsTab.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Loader, Trophy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { competitionsAPI } from '../../../services/api';
import { formatDate, toDate } from '../../../utils';

// ============================================================
// HELPERS
// ============================================================
function getDaysRemaining(endDate) {
  const d = toDate(endDate);
  if (!d) return null;
  const days = Math.ceil((d - new Date()) / 86400000);
  if (days < 0) return 'Ended';
  if (days === 0) return 'Ends today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

function getDaysUntilStart(startDate) {
  const d = toDate(startDate);
  if (!d) return null;
  const days = Math.ceil((d - new Date()) / 86400000);
  if (days <= 0) return 'Starting now';
  if (days === 1) return 'Starts tomorrow';
  return `Starts in ${days} days`;
}

const TEAMS_BY_TYPE = {
  department: ['Choir', 'Ushers', 'Media', 'Youth', 'Prayer', 'Protocol', 'Children'],
  'age-group': ['Children', 'Youth', 'Young Adults', 'Adults', 'Seniors'],
  zone: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6', 'Zone 7'],
};

const getTeamsForType = (teamType) =>
  TEAMS_BY_TYPE[teamType] || TEAMS_BY_TYPE.zone;

// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({ status }) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-700',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        styles[status] || styles.upcoming
      }`}
    >
      {status}
    </span>
  );
}

// ============================================================
// TEAM PICKER (inline within expanded panel)
// ============================================================
function TeamPicker({ competitionId, teamType, mode = 'join', currentTeamId, onSuccess, onCancel }) {
  const teams = getTeamsForType(teamType);
  const [selected, setSelected] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    if (mode === 'change') {
      const ok = window.confirm(
        `Switch to "${selected}"? You can only switch teams once.`
      );
      if (!ok) return;
    }
    setSaving(true);
    try {
      const teamId = selected.toLowerCase().replace(/\s+/g, '-');
      const teamName = selected;
      if (mode === 'join') {
        await competitionsAPI.join(competitionId, { teamId, teamName });
        toast.success(`Joined ${selected}`);
      } else {
        await competitionsAPI.changeTeam(competitionId, { teamId, teamName });
        toast.success(`Switched to ${selected}`);
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const availableTeams =
    mode === 'change' && currentTeamId
      ? teams.filter((t) => t.toLowerCase().replace(/\s+/g, '-') !== currentTeamId)
      : teams;

  const isJoin = mode === 'join';

  return (
    <div className={`p-4 rounded-md border ${isJoin ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
      <p className={`text-sm font-medium mb-3 ${isJoin ? 'text-blue-900' : 'text-amber-900'}`}>
        {isJoin ? 'Select your team to join' : 'Select your new team'}
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
        >
          <option value="">Choose a team...</option>
          {availableTeams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          disabled={!selected || saving}
          className="inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : null}
          {isJoin ? 'Join' : 'Switch'}
        </button>
        {!isJoin && (
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Cancel
          </button>
        )}
      </div>
      <p className={`text-xs mt-2 ${isJoin ? 'text-blue-700' : 'text-amber-700'}`}>
        {isJoin
          ? 'Your choice is final after joining.'
          : '⚠️ You can only switch teams once.'}
      </p>
    </div>
  );
}

// ============================================================
// COMPETITION ROW
// ============================================================
function CompetitionRow({ competition: c, detail, myTeam, onChangeTeam, changing, onCancelChange }) {
  const [expanded, setExpanded] = useState(false);

  const leaderboard = detail?.leaderboard || [];
  const churchTotal = detail?.churchTotal || 0;
  const goal = c.goal || 0;
  const pct = goal > 0 ? Math.min(100, (churchTotal / goal) * 100) : 0;
  const isActive = c.status === 'active';
  const isUpcoming = c.status === 'upcoming';
  const isCompleted = c.status === 'completed';
  const alreadySwitched = myTeam?.participant?.switched === true;

  return (
    <>
      {/* MAIN ROW */}
      <tr
        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-4 text-gray-400 w-8">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </td>

        <td className="px-4 py-4">
          <div className="text-sm font-semibold text-gray-900">{c.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{c.description || '—'}</div>
        </td>

        <td className="px-4 py-4">
          <StatusBadge status={c.status} />
        </td>

        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
          {isActive && getDaysRemaining(c.endDate)}
          {isUpcoming && getDaysUntilStart(c.startDate)}
          {isCompleted && '🏁 Final'}
        </td>

        <td className="px-4 py-4 min-w-[180px]">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="tabular-nums">{churchTotal} / {goal}</span>
            <span className="tabular-nums">{pct.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${isCompleted ? 'bg-gray-500' : 'bg-gray-900'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </td>

        <td className="px-4 py-4 text-sm">
          {myTeam?.team ? (
            <div>
              <div className="font-medium text-gray-900">{myTeam.team.teamName}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {myTeam.team.soulsWon} souls · Rank #{myTeam.team.rank}
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Not joined</span>
          )}
        </td>

        <td className="px-4 py-4 text-sm text-gray-600 text-right tabular-nums">
          {leaderboard.length}
        </td>
      </tr>

      {/* EXPANDED PANEL */}
      {expanded && (
        <tr className="bg-gray-50 border-b border-gray-200">
          <td colSpan={7} className="p-0">
            <div className="p-6 space-y-6">
              {/* DATE RANGE */}
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span>
                  <span className="font-medium text-gray-700">Starts:</span>{' '}
                  {toDate(c.startDate) ? formatDate(toDate(c.startDate)) : '—'}
                </span>
                <span>
                  <span className="font-medium text-gray-700">Ends:</span>{' '}
                  {toDate(c.endDate) ? formatDate(toDate(c.endDate)) : '—'}
                </span>
                <span>
                  <span className="font-medium text-gray-700">Team type:</span>{' '}
                  <span className="capitalize">{c.teamType}</span>
                </span>
              </div>

              {/* JOIN / CHANGE PICKER */}
              {isActive && !myTeam?.team && (
                <TeamPicker
                  competitionId={c.id}
                  teamType={c.teamType}
                  mode="join"
                  onSuccess={onChangeTeam}
                />
              )}

              {isActive && myTeam?.team && changing && (
                <TeamPicker
                  competitionId={c.id}
                  teamType={c.teamType}
                  mode="change"
                  currentTeamId={myTeam.team.teamId}
                  onSuccess={onChangeTeam}
                  onCancel={onCancelChange}
                />
              )}

              {/* MY TEAM INFO */}
              {myTeam?.team && !changing && (
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-3">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Your Team</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5">{myTeam.team.teamName}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Souls</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5 tabular-nums">{myTeam.team.soulsWon}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-gray-500">Rank</div>
                      <div className="text-sm font-semibold text-gray-900 mt-0.5 tabular-nums">#{myTeam.team.rank}</div>
                    </div>
                  </div>

                  {isActive && (
                    <div>
                      {alreadySwitched ? (
                        <span className="text-xs text-gray-400">
                          Team locked · Contact admin to change
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onChangeTeam(c.id, 'change');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded px-3 py-1.5 transition"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Change Team
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* LEADERBOARD */}
              {leaderboard.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      {isCompleted ? 'Final Standings' : 'Team Standings'}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {leaderboard.length} {leaderboard.length === 1 ? 'team' : 'teams'}
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200 bg-gray-50">
                          <th className="px-4 py-2 w-16 font-medium">Rank</th>
                          <th className="px-4 py-2 font-medium">Team</th>
                          <th className="px-4 py-2 font-medium text-right">Members</th>
                          <th className="px-4 py-2 font-medium text-right">Souls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((t) => {
                          const isMine = myTeam?.team?.teamId === t.teamId;
                          const medal =
                            t.rank === 1 ? '🥇' :
                            t.rank === 2 ? '🥈' :
                            t.rank === 3 ? '🥉' : null;
                          return (
                            <tr
                              key={t.teamId}
                              className={`border-b border-gray-100 last:border-0 ${
                                isMine ? 'bg-amber-50' : ''
                              }`}
                            >
                              <td className="px-4 py-2.5 text-sm text-gray-500 tabular-nums">
                                {medal || `#${t.rank}`}
                              </td>
                              <td className="px-4 py-2.5 text-sm">
                                <span className={isMine ? 'font-semibold text-gray-900' : 'text-gray-700'}>
                                  {t.teamName}
                                </span>
                                {isMine && (
                                  <span className="ml-2 text-xs text-amber-700 font-medium">
                                    You
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-sm text-gray-600 text-right tabular-nums">
                                {t.memberCount}
                              </td>
                              <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 text-right tabular-nums">
                                {t.soulsWon}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {isActive && leaderboard.length === 0 && !myTeam?.team && (
                <div className="text-center py-4 text-sm text-gray-500">
                  No teams have joined yet
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ============================================================
// MAIN
// ============================================================
function CompetitionsTab() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [details, setDetails] = useState({});
  const [myTeams, setMyTeams] = useState({});
  const [changing, setChanging] = useState({});

  const loadData = useCallback(async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const res = await competitionsAPI
        .getAll()
        .catch(() => ({ data: { data: [] } }));
      const comps = res.data?.data || [];
      setCompetitions(comps);

      const detailsMap = {};
      const myTeamsMap = {};

      for (const c of comps) {
        const [detailRes, myTeamRes] = await Promise.all([
          competitionsAPI.getById(c.id).catch(() => null),
          competitionsAPI.getMyTeam(c.id).catch(() => null),
        ]);
        detailsMap[c.id] = detailRes?.data?.data || null;
        myTeamsMap[c.id] = myTeamRes?.data?.data || null;
      }

      setDetails(detailsMap);
      setMyTeams(myTeamsMap);
      setChanging({});
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChangeTeam = (compId) => {
    setChanging({ ...changing, [compId]: true });
  };

  const handleCancelChange = (compId) => {
    setChanging({ ...changing, [compId]: false });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 py-16 text-center">
        <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">No competitions right now</p>
        <p className="text-xs text-gray-400 mt-1">
          Check back soon for the next campaign
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3 font-medium">Competition</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Timeline</th>
              <th className="px-4 py-3 font-medium">Church Progress</th>
              <th className="px-4 py-3 font-medium">Your Team</th>
              <th className="px-4 py-3 font-medium text-right">Teams</th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((c) => (
              <CompetitionRow
                key={c.id}
                competition={c}
                detail={details[c.id]}
                myTeam={myTeams[c.id]}
                changing={changing[c.id] === true}
                onChangeTeam={(action, mode) => {
                  if (mode === 'change') handleChangeTeam(c.id);
                  else loadData();
                }}
                onCancelChange={() => handleCancelChange(c.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompetitionsTab;
import { useState } from 'react';
import { CheckCircle2, Copy, Crown, Gift, Heart, MapPin, Sparkles, Target, UserPlus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GROUPS, getGroup } from '../data/community';
import { Avatar } from '../components/Avatar';
import { ConfirmDialog, PageHeader, ProgressBar, SimBadge } from '../components/ui';
import {
  groupContribution,
  groupTotal,
  groupWeeklyContribution,
  leaderboard,
  milestoneInfo,
  weeklyProgress,
} from '../services/selectors';
import { referralCode } from '../services/engine';
import { copyText } from '../services/stickerExport';
import { POINTS, STICKER_THRESHOLDS } from '../services/scoring';
import { formatDateTime } from '../utils/time';

export function CommunityPage() {
  const { state, actions, t, pushToast } = useApp();
  const group = getGroup(state.community.groupId);
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const [switching, setSwitching] = useState(false);

  const showPicker = !group || switching;

  return (
    <div>
      <PageHeader title={t('community.title')} subtitle={t('community.subtitle')} icon={<Users />} />
      <div className="mb-4">
        <SimBadge>{t('community.mock')}</SimBadge>
      </div>

      {showPicker ? (
        <section aria-label="Choose a group">
          <h2 className="mb-3 text-xl font-extrabold">{group ? 'Choose a new group' : 'Choose a group to join'}</h2>
          <ul className="space-y-4">
            {GROUPS.map((g) => (
              <li key={g.id} className="card" style={{ borderTop: `6px solid ${g.color}` }}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-extrabold">{g.name}</h3>
                    <p className="flex items-center gap-1 text-navy-600">
                      <MapPin size={16} /> {g.area} · {g.members.length + 1} members (mock)
                    </p>
                  </div>
                  <span className="chip bg-navy-50 text-navy-800">⭐ {groupTotal(state, g).toLocaleString()} pts</span>
                </div>
                <p className="mt-2 text-navy-700">{g.description}</p>
                <p className="mt-1 text-sm text-navy-600">{g.meetingNote}</p>
                <button
                  className="btn-teal mt-4 w-full sm:w-auto"
                  onClick={() => {
                    actions.joinGroup(g.id);
                    setSwitching(false);
                    pushToast({ kind: 'success', title: `Welcome to ${g.name}!`, detail: 'Your points now also help your group.' });
                  }}
                  disabled={g.id === group?.id}
                  data-testid={`join-${g.id}`}
                >
                  {g.id === group?.id ? t('community.joined') : t('community.join')}
                </button>
              </li>
            ))}
          </ul>
          {switching && (
            <button className="btn-ghost mt-3 w-full" onClick={() => setSwitching(false)}>
              {t('common.cancel')}
            </button>
          )}
        </section>
      ) : (
        group && <JoinedView onSwitch={() => setConfirmSwitch(true)} />
      )}

      {/* Leaderboard (all groups) */}
      <section className="card mt-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Crown className="text-sun-600" /> {t('community.leaderboard')}
        </h2>
        <p className="mt-1 text-navy-600">Neighbourhoods learning together. Every group is making progress!</p>
        <ol className="mt-3 space-y-2">
          {leaderboard(state).map(({ group: g, total }, i) => (
            <li
              key={g.id}
              className={`flex items-center gap-3 rounded-2xl p-3 ${g.id === group?.id ? 'bg-teal-50 ring-2 ring-teal-300' : 'bg-navy-50'}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-extrabold text-navy-700">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{g.name}</span>
                {g.id === group?.id && <span className="text-sm font-semibold text-teal-700">Your group</span>}
              </span>
              <span className="font-extrabold">{total.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      </section>

      <ConfirmDialog
        open={confirmSwitch}
        title="Switch to another group?"
        message="Points you already earned stay with your current group. New points will go to your new group."
        confirmLabel={t('community.switch')}
        cancelLabel={t('common.cancel')}
        onCancel={() => setConfirmSwitch(false)}
        onConfirm={() => {
          setConfirmSwitch(false);
          setSwitching(true);
        }}
      />
    </div>
  );
}

function JoinedView({ onSwitch }: { onSwitch: () => void }) {
  const { state, now, actions, t, pushToast } = useApp();
  const group = getGroup(state.community.groupId)!;
  const total = groupTotal(state, group);
  const ms = milestoneInfo(total, group.milestones);
  const mine = groupContribution(state, group.id);
  const myWeek = groupWeeklyContribution(state, group.id, now);
  const weekly = weeklyProgress(state, now);
  const code = referralCode(state);

  const helpers = [
    ...group.members.map((m) => ({ ...m, isMe: false })),
    { name: `${state.profile?.nickname ?? 'You'} (you)`, avatarId: state.profile?.avatarId ?? 'auntie', weeklyPoints: myWeek, role: undefined, isMe: true },
  ].sort((a, b) => b.weeklyPoints - a.weeklyPoints);

  const inviteMessage = `Hi! Join me on SafeSeniors SG to learn how to spot scams and deepfakes together. Use my invite code ${code} to join ${group.name}! (Demo)`;

  return (
    <>
      <section className="card" style={{ borderTop: `6px solid ${group.color}` }} data-demo="group-progress" data-testid="group-progress">
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">{t('community.joined')}</p>
        <h2 className="text-2xl font-extrabold">{group.name}</h2>
        <p className="text-navy-600">{group.meetingNote}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-navy-50 p-4">
            <p className="font-semibold text-navy-600">{t('community.groupTotal')}</p>
            <p className="text-3xl font-extrabold" data-testid="group-total">
              {total.toLocaleString()} <span className="text-lg">pts</span>
            </p>
            {ms.next ? (
              <>
                <ProgressBar value={ms.pct} className="mt-2" color="bg-sun-400" label="Progress to next group milestone" />
                <p className="mt-2 text-sm text-navy-700">
                  <Target size={16} className="mr-1 inline" />
                  {ms.remaining} pts to {ms.next.toLocaleString()} — unlocks <strong>Team Champion</strong> for helpers
                </p>
              </>
            ) : (
              <p className="mt-2 font-semibold text-teal-700">All milestones reached!</p>
            )}
          </div>
          <div className="rounded-2xl bg-teal-50 p-4">
            <p className="font-semibold text-navy-600">{t('community.yourContribution')}</p>
            <p className="text-3xl font-extrabold">
              {mine} <span className="text-lg">pts</span>
            </p>
            <ProgressBar
              value={(mine / STICKER_THRESHOLDS.COMMUNITY_HERO_CONTRIBUTION) * 100}
              className="mt-2"
              label="Progress to Community Hero sticker"
            />
            <p className="mt-2 text-sm text-navy-700">
              {mine >= STICKER_THRESHOLDS.COMMUNITY_HERO_CONTRIBUTION
                ? 'Community Hero sticker earned. Thank you!'
                : `${STICKER_THRESHOLDS.COMMUNITY_HERO_CONTRIBUTION - mine} more to become a Community Hero`}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-bold">Group milestones</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.milestones.map((m) => {
              const reached = total >= m;
              return (
                <span
                  key={m}
                  className={`chip shrink-0 ${reached ? 'bg-teal-600 text-white' : m === ms.next ? 'bg-sun-200 text-navy-900 ring-2 ring-sun-400' : 'bg-navy-50 text-navy-600'}`}
                >
                  {reached ? <CheckCircle2 size={16} /> : <Sparkles size={16} />} {m.toLocaleString()}
                </span>
              );
            })}
          </div>
        </div>
        <button className="btn-ghost mt-3 px-2 text-sm" onClick={onSwitch}>
          {t('community.switch')}
        </button>
      </section>

      {/* Weekly challenges */}
      <section className="card mt-5" data-testid="weekly-challenges">
        <h2 className="text-xl font-extrabold">{t('community.weekly')}</h2>
        <p className="mt-1 text-navy-600">
          +{POINTS.WEEKLY_CHALLENGE} points each · Resets every Monday. Other members&rsquo; points are mock data.
        </p>
        <ul className="mt-4 space-y-4">
          {weekly.map((w) => (
            <li key={w.id} className="rounded-2xl p-4 ring-1 ring-navy-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-extrabold">{w.title}</p>
                  <p className="text-navy-600">{w.description}</p>
                </div>
                {w.completedAt ? (
                  <span className="chip shrink-0 bg-teal-100 text-teal-800">
                    <CheckCircle2 size={16} /> {t('common.done')}
                  </span>
                ) : (
                  <span className="chip shrink-0 bg-sun-100 text-sun-800">+{POINTS.WEEKLY_CHALLENGE}</span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <ProgressBar value={w.pct} color={w.completedAt ? 'bg-teal-500' : 'bg-sun-400'} label={w.title} />
                <span className="shrink-0 text-sm font-bold">
                  {w.id === 'wk-milestone' ? (w.reached ? 'Reached' : 'Not yet') : `${w.current}/${w.target}`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Helpers */}
      <section className="card mt-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Heart className="text-red-500" /> {t('community.helpers')}
        </h2>
        <p className="mt-1 text-navy-600">Every contribution counts — big or small. (Fictional demo members.)</p>
        <ul className="mt-3 space-y-2">
          {helpers.map((m) => (
            <li key={m.name} className={`flex items-center gap-3 rounded-2xl p-2 pr-3 ${m.isMe ? 'bg-teal-50 ring-2 ring-teal-300' : ''}`}>
              <Avatar id={m.avatarId} size={44} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{m.name}</span>
                {m.role && <span className="block text-sm text-navy-600">{m.role}</span>}
              </span>
              <span className="shrink-0 font-bold text-navy-700">{m.weeklyPoints > 0 ? `+${m.weeklyPoints} pts` : 'Getting started 🌱'}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Invite */}
      <section className="card mt-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <UserPlus className="text-teal-600" /> {t('community.invite')}
        </h2>
        <p className="mt-1 text-navy-600">Share your code with a friend. (Simulated — no real accounts are created.)</p>
        <div className="mt-3 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50 p-4 text-center">
          <p className="text-sm font-semibold text-navy-600">Your referral code</p>
          <p className="select-all text-2xl font-extrabold tracking-wider text-navy-900" data-testid="referral-code">
            {code}
          </p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            className="btn-outline"
            onClick={async () => {
              const ok = await copyText(inviteMessage);
              pushToast(ok ? { kind: 'success', title: 'Invite message copied', detail: 'Paste it into WhatsApp or Telegram.' } : { kind: 'info', title: 'Could not copy', detail: 'Please copy the code manually.' });
            }}
          >
            <Copy /> Copy invite message
          </button>
          <button
            className="btn-teal"
            onClick={() => {
              const name = actions.invite();
              pushToast({ kind: 'success', title: `${name} joined with your code!`, detail: 'Simulated invitation for the demo.' });
            }}
            data-testid="simulate-invite"
          >
            <Gift /> Simulate a friend joining
          </button>
        </div>
        {state.community.invites.length > 0 && (
          <ul className="mt-3 space-y-1">
            {state.community.invites.map((i) => (
              <li key={i.id} className="flex items-center gap-2 text-navy-700">
                <CheckCircle2 size={18} className="text-teal-600" /> {i.friendName} joined (simulated) · {formatDateTime(i.at)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

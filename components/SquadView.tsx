"use client";

import { useState, FormEvent } from 'react';
import {
    Users,
    Mail,
    Link as LinkIcon,
    Copy,
    Check,
    UserPlus,
    Clock,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface SquadViewProps {
    user: UserProfile | null;
    setCurrentTab: (tab: string) => void;
}

interface SquadMember {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    status: 'active' | 'invited';
    invitedTime?: string;
    initials?: string;
}

export default function SquadView({ user, setCurrentTab }: SquadViewProps) {
    // Initial list as seen in description & photo:
    // 1 active leader, 1 vacant spot, 1 pending invite, and another vacant spot (making it 2/4 slots filled)
    const [members, setMembers] = useState<SquadMember[]>([
        {
            id: 'leader',
            name: user?.name || 'Alex Miller',
            role: 'Squad Leader (Admin)',
            status: 'active',
            initials: (user?.name || 'Alex Miller')
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
        },
        {
            id: 'invited-1',
            email: 'sarah.fitness@email.com',
            status: 'invited',
            invitedTime: 'Invited 2 hours ago'
        }
    ]);

    const [inviteEmail, setInviteEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Total permissible slots
    const TOTAL_SLOTS = 4;
    const activeAndInvitedCount = members.length;

    const handleInvite = (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!inviteEmail.trim()) {
            return;
        }

        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inviteEmail)) {
            setErrorMsg('Please enter a valid email address');
            return;
        }

        // Check if slot capacity exceeded
        if (members.length >= TOTAL_SLOTS) {
            setErrorMsg('All 4 slots are occupied. Upgrade your plan for more slots.');
            return;
        }

        // Check duplicate
        const isDuplicate = members.some(m => m.email?.toLowerCase() === inviteEmail.toLowerCase());
        if (isDuplicate) {
            setErrorMsg('This member has already been invited');
            return;
        }

        // Add new invited member
        const newMember: SquadMember = {
            id: `invited-${Date.now()}`,
            email: inviteEmail.trim().toLowerCase(),
            status: 'invited',
            invitedTime: 'Invited just now'
        };

        setMembers([...members, newMember]);
        setInviteEmail('');
    };

    const handleCancelInvite = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
        setErrorMsg('');
    };

    const handleCopyLink = () => {
        const linkText = 'elitefitness.com/join/team-4-x89k2l';
        navigator.clipboard.writeText(linkText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Convert list to a slot presentation mapping up to 4 total spots
    const renderSlots = () => {
        const result = [];

        // 1. Leader (always first)
        const leader = members.find(m => m.id === 'leader');
        if (leader) {
            result.push(
                <div
                    key="slot-leader"
                    className="flex items-center justify-between bg-[#1f1f1f]/50 border border-[#333333]/40 rounded-2xl p-4 sm:p-5 transition-all hover:bg-[#1f1f1f]/80"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm sm:text-base flex items-center justify-center tracking-tight">
                            {leader.initials || 'AM'}
                        </div>
                        <div>
                            <h4 className="font-headline text-sm sm:text-base font-bold text-white transition-colors">
                                {leader.name}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-[#c6c6c7] mt-0.5 font-medium">
                                {leader.role}
                            </p>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#c3f400] bg-[#c3f400]/10 border border-[#c3f400]/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Active
                    </span>
                </div>
            );
        }

        // 2. Map all pending invites
        const invitedList = members.filter(m => m.id !== 'leader');
        invitedList.forEach((invited, idx) => {
            result.push(
                <div
                    key={invited.id}
                    className="flex items-center justify-between bg-[#1f1f1f]/50 border border-[#333333]/40 rounded-2xl p-4 sm:p-5 transition-all hover:bg-[#1f1f1f]/80"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#2a2a2a] border border-[#333333] flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-[#c6c6c7]" />
                        </div>
                        <div className="min-w-0 pr-2">
                            <h4 className="font-sans text-sm sm:text-base font-bold text-white truncate">
                                {invited.email}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-[#c6c6c7] mt-0.5 font-medium">
                                {invited.invitedTime}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCancelInvite(invited.id)}
                        className="text-[11px] font-bold text-red-500 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                        Cancel
                    </button>
                </div>
            );
        });

        // 3. Fill the remaining slots with Vacant Spot representations
        const vacantCount = TOTAL_SLOTS - members.length;
        for (let i = 0; i < vacantCount; i++) {
            result.push(
                <div
                    key={`vacant-${i}`}
                    className="flex items-center justify-between bg-[#1a1a1a]/40 border border-[#333333]/30 border-dashed rounded-2xl p-4 sm:p-5 hover:bg-[#1a1a1a]/60 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1b1b1b] border border-[#333333]/50 flex items-center justify-center shrink-0">
                            <UserPlus className="w-5 h-5 text-[#c6c6c7]" />
                        </div>
                        <div>
                            <h4 className="font-headline text-sm sm:text-base font-semibold text-[#8e8e8f]">
                                Vacant Spot
                            </h4>
                            <p className="text-[11px] sm:text-xs text-[#c6c6c7] font-medium">
                                Ready for your next teammate
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return result;
    };

    return (
        <div className="animate-fade-in text-white py-4 sm:py-8" id="squad-view-container">
            <div className="max-w-2xl mx-auto px-4 text-center">
                {/* Page Titles */}
                <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2" id="squad-headline">
                    Expand Your Elite Squad
                </h1>
                <p className="font-sans text-xs sm:text-sm md:text-base text-[#c6c6c7] max-w-lg mx-auto mb-10 leading-relaxed">
                    Strength in numbers. Bring your team to the next level.
                </p>

                {/* Big Card Wrapper */}
                <div className="bg-[#1a1a1a] border border-[#333333] rounded-3xl p-6 sm:p-8 text-left" id="squad-card">

                    {/* Header information with slot usage info */}
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#333333]/50">
                        <div>
                            <p className="text-[10px] font-bold text-primary-fixed uppercase tracking-widest mb-1.5">
                                Current Plan
                            </p>
                            <h2 className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
                                Team 4 Membership
                            </h2>
                        </div>

                        {/* Dynamic slot progress indicator circular layout */}
                        <div className="flex items-center gap-3 bg-[#1e1e1e] border border-[#333333]/60 px-4 py-2 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-primary-fixed/5 border border-primary-fixed/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary-fixed" />
                            </div>
                            <div>
                                <p className="font-headline text-base sm:text-lg font-extrabold text-white leading-none">
                                    {activeAndInvitedCount}/{TOTAL_SLOTS}
                                </p>
                                <p className="text-[9px] font-semibold text-[#c6c6c7] uppercase tracking-wider mt-0.5">
                                    Slots Filled
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form: Invite by Email */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-[#c6c6c7] uppercase tracking-widest mb-3">
                            Invite by Email
                        </h3>
                        <form onSubmit={handleInvite} className="flex gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-[#c6c6c7]" />
                                </div>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="training-partner@example.com"
                                    className="w-full bg-[#131313] border border-[#333333] focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed rounded-xl py-3 pl-11 pr-4 text-xs sm:text-sm text-white placeholder-[#8e8e8f] transition-all outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#c3f400] text-[#161e00] font-sans font-bold text-xs sm:text-sm px-6 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all select-none cursor-pointer shrink-0"
                            >
                                Invite
                            </button>
                        </form>
                        {errorMsg && (
                            <p className="text-xs font-semibold text-red-500 mt-2 ml-1">
                                {errorMsg}
                            </p>
                        )}
                    </div>

                    {/* Quick Share Link */}
                    <div className="mb-10">
                        <h3 className="text-xs font-bold text-[#c6c6c7] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <LinkIcon className="w-3.5 h-3.5 text-[#c6c6c7]" />
                            <span>Quick Share Link</span>
                        </h3>
                        <div className="flex bg-[#131313] border border-[#333333] rounded-xl overflow-hidden p-1.5 items-center">
                            <input
                                type="text"
                                readOnly
                                value="elitefitness.com/join/team-4-x89k2l"
                                className="w-full bg-transparent border-0 ring-0 focus:ring-0 text-primary-fixed font-mono text-xs sm:text-sm py-2 px-3 outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#1f1f1f] text-white py-2 px-4 rounded-lg text-xs font-bold border border-[#333333] transition-colors select-none active:scale-95 cursor-pointer shrink-0"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-[#c3f400]" />
                                        <span className="text-[#c3f400]">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5 text-[#c6c6c7]" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Squad Members Area */}
                    <div>
                        <h3 className="text-xs font-bold text-[#c6c6c7] uppercase tracking-widest mb-4">
                            Squad Members
                        </h3>
                        <div className="space-y-4">
                            {renderSlots()}
                        </div>
                    </div>

                </div>

                {/* Upgrade Plan Notice Link */}
                <div className="mt-8">
                    <p className="text-xs text-[#c6c6c7]">
                        Need to add more than 4 slots?{' '}
                        <button
                            onClick={() => setCurrentTab('packages')}
                            className="text-[#c3f400] font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer inline-flex items-center gap-0.5 outline-none font-bold"
                        >
                            <span>Upgrade Plan</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}

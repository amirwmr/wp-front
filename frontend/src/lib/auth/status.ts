import type { User } from '$lib/types';

export const isOnboardingComplete = (user: User | null | undefined) => {
	if (!user) return false;
	const baseComplete = user.onboarding_status === 'completed';
	if (user.role === 'vendor') {
		const vendorStatus = user.vendor_profile?.onboarding_status ?? user.onboarding_status;
		return baseComplete && vendorStatus === 'completed';
	}
	return baseComplete;
};

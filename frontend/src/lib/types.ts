export type Locale = 'fa' | 'en';

export type UserRole = 'couple' | 'vendor' | 'admin';

export type OnboardingStatus = 'in_progress' | 'completed';

export interface VendorProfile {
	business_name?: string;
	business_category?: string;
	address?: string;
	documents?: Record<string, unknown>;
	onboarding_status?: OnboardingStatus;
}

export interface User {
	username: string;
	name?: string | null;
	email?: string | null;
	role: UserRole;
	onboarding_status: OnboardingStatus;
	vendor_profile?: VendorProfile | null;
}

export interface SessionTokens {
	access: string;
	refresh: string;
}

export interface OtpVerifyResponse extends SessionTokens {
	user?: User;
	onboarding_status?: OnboardingStatus;
	vendor_profile?: VendorProfile;
}

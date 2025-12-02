import { requireOnboardedUser } from '$lib/server/guards';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	requireOnboardedUser(locals.user, url);
	return {};
};

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if(user) {
		user.wallet.wallet.seed = "xxxxxxxxxxx"
	}
	
	return { user }
}

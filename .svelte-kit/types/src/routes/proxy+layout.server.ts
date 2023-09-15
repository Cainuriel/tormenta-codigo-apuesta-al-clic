// @ts-nocheck
import type { LayoutServerLoad } from './$types'

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	const { user } = await locals.auth.validateUser();
	if(user) {
		user.wallet.wallet.seed = "xxxxxxxxxxx"
	}
	
	return { user }
}

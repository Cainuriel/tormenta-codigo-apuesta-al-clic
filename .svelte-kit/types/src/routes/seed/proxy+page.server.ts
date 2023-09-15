// @ts-nocheck
import type { PageServerLoad } from '../$types'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const { user, session } = await locals.auth.validateUser();
	if(session || user) {
        // console.log(`user`, user.wallet.wallet.seed);
		return {

			value: user.wallet.wallet.seed
		}
	} else {
		
        throw redirect(302, '/');
	}

}




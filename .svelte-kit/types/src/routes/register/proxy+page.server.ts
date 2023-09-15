// @ts-nocheck
import { auth } from '$lib/server/lucia'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import main from "./creationWallet"
export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const session = await locals.auth.validate()
	if (session) {
		throw redirect(302, '/')
	}
}

export const actions = {
	default: async ({ request }: import('./$types').RequestEvent) => {

		const wallet = await main();
		console.log(`wallet`, wallet);
		const { username, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>
		try {
			await auth.createUser({
				primaryKey: {
					providerId: 'username',
					providerUserId: username,
					password
				},
				attributes: {
					wallet: wallet,
					username,
					balance: 0
				}
			})
		} catch (err) {
			console.error(err)
			return fail(400, { message: 'Could not register user' })
		}
		throw redirect(302, '/login')
	}
}
;null as any as Actions;
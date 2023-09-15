import type { Actions, PageServerLoad } from './$types'
import { prisma } from '$lib/server/prisma'
import { error, redirect, fail } from '@sveltejs/kit'
import { SEED  } from '$env/static/private'
import send from '../sendXRP'

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.auth.validateUser()
	if (!session || !user) {
		throw error(401, 'No tiene autorización, malandrín.')
	}
	const userData = await prisma.authUser.findUnique({
		where: {
			id: user?.userId
		}
	});
	//@ts-ignore
	if( userData?.balance === BigInt(0) ) {
		console.log(`El usuario ya ha jugado todos sus intentos`, userData?.balance);
		throw redirect(302, '/');
	} else {
		//@ts-ignore
		console.log(`intentos del jugador: `, userData.balance);
	}
}

export const actions: Actions = {
	createGame: async ({ request, locals }) => {
		const { session, user } = await locals.auth.validateUser();
		console.log(`session, user`, session, user);
		if (!session || !user) {
			throw redirect(302, '/')
		}

		const { title, content } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>

		await registerDataGame(title, content, user);
	},

	updateTimes: async ({ request, locals }) => {
		const { session, user } = await locals.auth.validateUser();
		// console.log(`session, user`, session, user);
		if (!session || !user) {
			throw redirect(302, '/')
		}

		const { updateTimes, isLoser } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>
		console.log(`updateTimes en server.ts: `, updateTimes, isLoser);
		
		if(isLoser === "false") {
			try {
			await prisma.authUser.update({
				where: {
					id: user.userId
				},
				data: {
					balance: 	BigInt(updateTimes)
				}
			})
			} catch (err) {
				console.error("error: ",err)
				// return fail(500, { message: 'Could not update times to play' })
				return {title: "Fallo en la actualización", message: 'Hemos tenido problemas con la actualización de su cuenta.', status: "error"};
			}

				throw redirect(302, '/game')
		} else if(isLoser === "Winner") {
			    //@ts-ignore
  				 let reward:BigInt = user.bild  * BigInt(2);
 			const transaction =	await send(SEED, (reward), user.wallet.wallet.classicAddress);
			console.log(`transaction`, transaction);
				if(transaction === "tesSUCCESS" ) {
					try {
						await prisma.authUser.update({
							where: {
								id: user.userId
							},
							data: {
								balance: 0 // le borramos los intentos que tenga pendiente para que no pueda retroceder
							}
						})
						} catch (err) {
							console.error("error: ",err)
							// return fail(500, { message: 'Could not update times to play' })
							return {title: "Fallo en la actualización", message: 'Hemos tenido problemas con la actualización de su cuenta.', status: "error"};
						}

					await registerDataGame(" ganó: ", ` ${user.bild} XRP`, user)
				
				} else {
					console.log(`La transacción no ha sido aceptada`, transaction);
					throw error(404, { message: 'A ocurrido un error y no se le ha envíado el dinero. Póngase en contacto con soporte transmitiendo el siguiente código: 0x0021bc19'});	
				}


		} else {
	            await registerDataGame(" perdió: ", ` ${user.bild} XRP`, user)
		}
	}

}

async function registerDataGame(title:any, content:any, user:any) {

	try {
		await prisma.game.create({
			data: {
				title: user.username + title,
				content: content,
				userId: user.userId
			}
		});
	} catch (err) {
		console.error("error: ",err)
		return {title: "Fallo de registro", message: 'Hemos fallado en el registro de la partida', status: "error"};
	}

	throw redirect(302, '/')
	
}

	// const getGame = async (userId: string) => {
	// 	const game = await prisma.game.findUnique({
	// 		where: {
	// 			id: Number(params.gameId)
	// 		}
	// 	})
	// 	if (!game) {
	// 		throw error(404, 'Game not found')
	// 	}
	// 	if (game.userId !== user.userId) {
	// 		throw error(403, 'Unauthorized')
	// 	}

	// 	return game
	// }

	// return {
	// 	game: getGame(user.userId)
	// }
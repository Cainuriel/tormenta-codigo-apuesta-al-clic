import type { Actions, PageServerLoad } from './$types'
import { prisma } from '$lib/server/prisma'
import { error, fail, redirect } from '@sveltejs/kit'
import send from './sendXRP';
import xrpl from 'xrpl';
import { ADDRESS  } from '$env/static/private'
export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = await locals.auth.validateUser();
	if(!session || !user) {
		return {
			games: await prisma.game.findMany({  
				take: 6,
				orderBy: {
					id: 'desc',
				}}),
		}
	} else {
			const userData = await prisma.authUser.findUnique({
				where: {
					id: user.userId
				}
			});
			const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233/")
			await client.connect();
			// Get info from the ledger 
			const responseOrigin = await client.request({
				"command": "account_info",
				//@ts-ignore
				"account": userData.wallet.wallet.classicAddress,
				"ledger_index": "validated"
			})

			// console.log("Balance de la cuenta del usuario: ",responseOrigin.result.account_data.Balance);
			client.disconnect();
			return {
				games: await prisma.game.findMany({  
					take: 6,
					orderBy: {
						id: 'desc',
					}}),
				//@ts-ignore
				balance: xrpl.dropsToXrp(responseOrigin.result.account_data.Balance) 
			}
	
	}

			
	
}


export const actions: Actions = {
	
	sendBild: async ({ request, locals }) => {
		const { session, user } = await locals.auth.validateUser();
		if (!session || !user) {
			throw redirect(302, '/')
		}

		const { balance, bild } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>
		const jsonObjectBild = JSON.parse(bild);
		// const jsonObjectBalance = JSON.parse(balance);
		// if(parseInt(balance) <= parseInt(jsonObjectBild.value)) {
			
		// 	return { message: 'No tiene suficiente saldo para ésta apuesta.'};	
		// }
		if(parseInt(balance) <= parseInt(jsonObjectBild.value)) {
			
			return {title: "Balance insuficiente", message: `Su saldo es de ${balance}`, status: "error"};	
		}
        // console.log("seed and bild", seed, jsonObject.value);
		const transaction =	await send(user.wallet.wallet.seed, jsonObjectBild.value, ADDRESS);
		console.log(`transaction`, transaction);
			if(transaction === "tesSUCCESS" ) {
					try {
						const response = await prisma.authUser.update({
							where: {
								id: user.userId
							},
							data: {
								balance: 5,
								bild: BigInt(jsonObjectBild.value)
							}
						});

						console.log(`response`, response);

					} catch (err) {
						console.error(err)
						// return fail(500, { message: 'Could not update times to play' })
						throw error(404, { message: 'Hemos tenido problemas con la actualización de su cuenta.'});
					}
					console.log(`Registro correcto a una partida`);
					throw redirect(302, '/game');
				} else {
					console.log(`La transacción no ha sido aceptada`, transaction);
					throw error(404, { message: 'La transacción no ha sido aceptada'});	
				}

	}
}


// updateGame: async ({ request, params, locals }) => {
// 	const { session, user } = await locals.auth.validateUser()
// 	if (!session || !user) {
// 		throw error(401, 'Unauthorized')
// 	}

// 	const { title, content } = Object.fromEntries(await request.formData()) as Record<
// 		string,
// 		string
// 	>

// 	try {
// 		const game = await prisma.game.findUniqueOrThrow({
// 			where: {
// 				id: Number(params.gameId)
// 			}
// 		})

// 		if (game.userId !== user.userId) {
// 			throw error(403, 'Forbidden to edit this game.')
// 		}
// 		await prisma.game.update({
// 			where: {
// 				id: Number(params.gameId)
// 			},
// 			data: {
// 				title,
// 				content
// 			}
// 		})
// 	} catch (err) {
// 		console.error(err)
// 		return fail(500, { message: 'Could not update game' })
// 	}

// 	return {
// 		status: 200
// 	}
// }

// createGame: async ({ request, locals }) => {
	// 	const { session, user } = await locals.auth.validateUser();
	// 	console.log(`session, user`, session, user);
	// 	return
	// 	if (!session || !user) {
	// 		throw redirect(302, '/')
	// 	}

	// 	const { title, content } = Object.fromEntries(await request.formData()) as Record<
	// 		string,
	// 		string
	// 	>

	// 	try {
	// 		await prisma.game.create({
	// 			data: {
	// 				title,
	// 				content,
	// 				userId: user.userId
	// 			}
	// 		})
	// 	} catch (err) {
	// 		console.error(err)
	// 		return fail(500, { message: 'Could not create the game.' })
	// 	}

	// 	return {
	// 		status: 201
	// 	}
	// }

	// const userFromDB = await prisma.authUser.findUniqueOrThrow({
						// 	where: {
						// 		id: user.userId
						// 	}
						// })

						// if (userFromDB.userId !== user.userId) {
						// 	throw error(403, 'Ops que pasó??')
						// }
import path from 'path';
import dotenv from 'dotenv';
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

import { i18nMiddleware } from './i18n.js';

const { NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

if (dev) dotenv.config();
else dotenv.config({ path: path.resolve('.env.staging') });

const {
	PORT,
	DOMAIN_DRIVEN_AUTH_WEB,
	DOMAIN_DRIVEN_MODEL,
	DOMAIN_DRIVEN_DEVICE,
	DOMAIN_DRIVEN_UPLOAD,
	DOMAIN_DRIVEN_CART,
	DOMAIN_DRIVEN_PROPOSAL,
	DOMAIN_DRIVEN_TRANSACTION,
	DOMAIN_DRIVEN_SOCKET
} = process.env;

polka()
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		i18nMiddleware(),
		sapper.middleware({
			session: (req, res) => ({
				'user-agent': req.headers['user-agent'],
				dev: NODE_ENV,
				domainAuthWeb: DOMAIN_DRIVEN_AUTH_WEB,
				domainModel: DOMAIN_DRIVEN_MODEL,
				domainDevice: DOMAIN_DRIVEN_DEVICE,
				domainUpload: DOMAIN_DRIVEN_UPLOAD,
				domainCart: DOMAIN_DRIVEN_CART,
				domainProposal: DOMAIN_DRIVEN_PROPOSAL,
				domainTransaction: DOMAIN_DRIVEN_TRANSACTION,
				domainSocket: DOMAIN_DRIVEN_SOCKET
			}),
		})
	)
	.listen(PORT, (err) => {
		if (err) console.log('error', err);
	});

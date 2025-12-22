const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
	const email = 'user1@gmail.com';
	const username = 'user1';
	const plainPassword = 'user1234';

	// Hash the password using bcryptjs (salt rounds = 10)
	const hashed = bcrypt.hashSync(plainPassword, 10);

	// Upsert ensures the admin user exists regardless of environment
	await prisma.user.upsert({
		where: { email },
		update: {
			password: hashed,
			role: 'admin',
			username,
			status: 'Active'
		},
		create: {
			firstName: 'Admin',
			lastName: 'User',
			username,
			email,
			password: hashed,
			role: 'admin',
			status: 'Active'
		}
	});

	console.log(`Ensured admin user exists: ${email}`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());


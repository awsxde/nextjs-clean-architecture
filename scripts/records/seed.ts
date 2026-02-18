import 'dotenv/config';
import { getInjection } from '@/di/container';
import { generateDummyRecords } from './generate-dummy-records';
import { AuthenticationError } from '@/src/entities/errors/auth';

const RECORD_COUNT = 30;

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // 1. Create test user if not exists
    const signUpUseCase = getInjection('ISignUpUseCase');
    try {
      await signUpUseCase({
        email: 'one@gmail.com',
        username: 'one',
        password: 'password-one',
      });
      console.log('✅ Test user created');
    } catch (error) {
      if (
        error instanceof AuthenticationError &&
        error.message === 'Username taken'
      ) {
        console.log('ℹ️ Test user already exists');
      } else {
        throw error;
      }
    }

    // 2. Sign in to get session and user ID
    const signInUseCase = getInjection('ISignInUseCase');
    const { session } = await signInUseCase({
      username: 'one',
      password: 'password-one',
    });

    console.log(`✅ Signed in as user: ${session.userId}`);

    // 3. Generate and insert dummy records
    const createRecordUseCase = getInjection('ICreateRecordUseCase');
    const records = generateDummyRecords(RECORD_COUNT, session.userId);

    console.log(`📦 Generating ${records.length} records...`);

    for (const record of records) {
      await createRecordUseCase(record, session.userId);
      console.log(`  ✅ Inserted: ${record.description} (${record.date})`);
    }

    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

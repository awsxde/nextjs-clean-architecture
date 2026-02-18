import 'dotenv/config';
import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

async function reset() {
  try {
    console.log('🧹 Resetting database records...');

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

    // 3. Get records
    const getRecordsForUser = getInjection('IGetRecordsForUserUseCase');
    const records = await getRecordsForUser(session.userId);
    console.log(`📊 Found ${records.length} records`);

    if (records.length === 0) {
      console.log('ℹ️ No records to delete.');
      return;
    }

    // 4. Delete records
    const deleteRecordUseCase = getInjection('IDeleteRecordUseCase');
    for (const record of records) {
      await deleteRecordUseCase({ recordId: record.id }, session.userId);
      console.log(`  ✅ Deleted: ${record.description} (${record.date})`);
    }

    console.log('🎉 Reset complete! All records deleted.');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

reset();

import { RecordInsert } from '@/src/entities/models/record';

const categories = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Travel',
  'Rent',
];

const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift'];
const expenseCategories = categories.filter(
  (c) => !incomeCategories.includes(c)
);

const descriptions = {
  Salary: ['Monthly salary', 'Bonus', 'Commission'],
  Freelance: ['Web design project', 'Consulting', 'Writing gig'],
  Investment: ['Dividend', 'Stock profit', 'Interest'],
  Gift: ['Birthday gift', 'Holiday gift'],
  Food: ['Groceries', 'Restaurant', 'Coffee', 'Takeout'],
  Transport: ['Fuel', 'Uber', 'Bus fare', 'Parking'],
  Utilities: ['Electricity bill', 'Water bill', 'Internet', 'Phone'],
  Entertainment: ['Movie', 'Concert', 'Netflix', 'Spotify'],
  Health: ['Gym', 'Doctor', 'Pharmacy', 'Therapy'],
  Education: ['Tuition', 'Books', 'Online course'],
  Shopping: ['Clothes', 'Electronics', 'Home goods'],
  Travel: ['Flight', 'Hotel', 'Rental car'],
  Rent: ['Monthly rent', 'Maintenance fee'],
};

function randomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split('T')[0];
}

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateDummyRecords(
  count: number,
  userId: string
): RecordInsert[] {
  const records: RecordInsert[] = [];
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.6; // ~40% expenses, 60% income (to keep balance positive)
    const category = isIncome
      ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
      : expenseCategories[Math.floor(Math.random() * expenseCategories.length)];

    const descList = descriptions[category as keyof typeof descriptions] || [
      category,
    ];
    const description = descList[Math.floor(Math.random() * descList.length)];

    let amount: number;
    if (isIncome) {
      amount = randomAmount(500, 5000);
    } else {
      amount = randomAmount(5, 500);
    }

    const date = randomDate(threeMonthsAgo, now);

    records.push({
      description,
      amount,
      type: isIncome ? 'income' : 'expense',
      date,
      category,
      userId,
    });
  }

  return records;
}

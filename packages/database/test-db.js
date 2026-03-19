const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Current user count: ${userCount}`);
    
    // Test creating a sample user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'STUDENT'
      }
    });
    console.log(`✅ Created test user with ID: ${testUser.id}`);
    
    // Test querying the user
    const foundUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: { profile: true }
    });
    console.log(`✅ Found user: ${foundUser.name}`);
    
    console.log('✅ All database operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

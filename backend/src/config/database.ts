import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // MongoDB connection URL (localhost वा cloud मा)
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://dangolraman3_db_user:aDYN04XbGlCUzc7c@cluster0.5kp48me.mongodb.net/medicare_nepal';
        if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds मा connect नभए error
      socketTimeoutMS: 45000, // 45 seconds सम्म operation wait गर्छ
    });
    console.log('✅ MongoDB Connected Successfully');

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
    });

    // Graceful shutdown - app बन्द गर्दा database connection पनि बन्द गर्छ
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1); // Error भएपछि app बन्द गर्छ
  }
};

export default connectDB;

// Database सँग connect गर्ने function
// Connection timeout र timeout settings
// Event tracking (connected, error, disconnected)
// App बन्द हुँदा clean shutdown


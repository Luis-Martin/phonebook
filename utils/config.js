import 'dotenv/config'

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI1
  : process.env.TEST_MONGODB_URI

export default { PORT, MONGODB_URI }

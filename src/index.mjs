import main from './update.mjs'
import cron from 'node-cron'
import startServer from './serve.mjs'

// Run every day at midnight
cron.schedule('0 0 * * *', () => {
  main()
})
// Run for the first time
main()

// Start the API via express server
startServer()
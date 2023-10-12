// Sovelluksen käynnistystiedosto

const app = require('./app')
const config = require('./utils/config')
const { info, errorInfo } = require('./utils/logger')

app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})
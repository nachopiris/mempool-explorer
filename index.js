const Web3 = require('web3')
const dotenv = require('dotenv')

dotenv.config()

const { PROVIDER_URI, ROUTER } = process.env

const options = {
  timeout: 30000,
  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  },
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 15,
    onTimeout: false,
  },
}

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(PROVIDER_URI, options),
)
const subscription = web3.eth.subscribe('pendingTransactions', (err, res) => {
  if (err) console.error(err)
})

const init = () => {
  subscription.on('data', (txHash) => {
    setTimeout(async () => {
      try {
        const tx = await web3.eth.getTransaction(txHash)
        if (tx && tx.to === ROUTER && tx.input.slice(0, 10) === '0xf91b3f72') {
          console.log(tx, new Date())
        }
      } catch (err) {
        console.error(err)
      }
    })
  })
}

init()

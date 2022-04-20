const Web3 = require('web3')
const dotenv = require('dotenv')

dotenv.config()

const { PROVIDER_URI } = process.env

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
        if (tx && tx.from === "0xD48d49BAAbB5176A431E2089AA99D16B74E2bBF8") {
          console.log(tx, new Date())
        }
      } catch (err) {
        console.error(err)
      }
    })
  })
}

init()

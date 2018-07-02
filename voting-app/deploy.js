const fs = require('fs')
const solc = require('solc')
const Web3 = require('web3')

// 设定 HttpProvider 为 Ganache 提供地址
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

// 导入合约
const code = fs.readFileSync('voting.sol').toString()
const compiledCode = solc.compile(code)
const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface)

// 开始部署
const VotingContract = new web3.eth.Contract(abiDefinition)
const byteCode = compiledCode.contracts[':Voting'].bytecode
let hexNames = hexData(['PCDotFan', 'Nick', 'Jose', 'Lussiun', 'Rosemary'])

deploy(VotingContract, hexNames)

async function deploy(contract, hexNames) {
    const accounts = await web3.eth.getAccounts()
    contract
        .deploy({
            data: byteCode,
            arguments: [hexNames]
        })
        .send({
            from: accounts[0],
            gas: 4700000
        })
        .then(newContractInstance => {
            console.log(newContractInstance.options.address) // instance with the new contract address
        });
}

function hexData(data) {
    return data.map(d => {
        return web3.utils.asciiToHex(d)
    })
}

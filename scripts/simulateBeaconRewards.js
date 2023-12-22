const hre = require("hardhat")
const ethers = hre.ethers
const { Framework } = require("@superfluid-finance/sdk-core")
const SSVETHJSON = require("../artifacts/contracts/SSVETH.sol/SSVETH.json")
const SSVETHABI = SSVETHJSON.abi
require("dotenv").config()

const ssvETHAddress = process.env.SSVETH_ADDRESS

async function main() {
    let alice
    let bob
    let carol
    let mallory
    ;[alice, bob, carol, mallory] = await ethers.getSigners()

    // let shareGainer = mallory // SELECT FROM ALICE, BOB, CAROL, OR MALLORY at your discretion

    // Setting up network object - this is set as the goerli url, but can be changed to reflect your RPC URL and network of choice
    const url = `${process.env.GOERLI_URL}${process.env.INFURA_API_KEY}`
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url)
    const network = await customHttpProvider.getNetwork()

    // Getting tokenSpreader contract object
    const ssvETH = new ethers.Contract(
        ssvETHAddress,
        SSVETHABI,
        customHttpProvider
    )
        let _newSharePrice = (0.05 +
            0.2 +
            32) / ( 32);
    // Give shareGainer a share
    const rebaseTx = await ssvETH
        .connect(alice)
        .updateSharePrice(_newSharePrice)
    await rebaseTx.wait()

    // View shares that shareGainer has
    console.log(
        `New share price:`,
        (
            await ssvETH.getShareprice()
        ).units
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
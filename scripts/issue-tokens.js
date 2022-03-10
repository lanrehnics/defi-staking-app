const DecentralBanky = artifacts.require('DecentralBank');

module.exports = async function issueRewards(callback) {
    let decentralBank = await DecentralBanky.deployed();
    await decentralBank.issueTokens();
    console.log('Token have been issued successfully!');
    callback();
}
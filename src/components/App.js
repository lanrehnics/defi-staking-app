import React, { Component } from 'react';
import NavBar from './NavBar';
import Main from './Main';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import Rwd from '../truffle_abis/Rwd.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';



class App extends Component {
    // Our React Code Goes In Here!

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockChainData();
    }

    async loadWeb3() {
        if (window.ethereuem) {
            window.web3 = new Web3(window.ethereuem);
            await window.ethereuem.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('No ethereum browser detected! You cab check out MetaMask!')
        }
    }

    async loadBlockChainData() {
        const web3 = window.web3;
        const account = await web3.eth.requestAccounts();
        this.setState({ account: account[0] });
        const networkId = await web3.eth.net.getId();


        //Load Tether Contract
        const tetherData = Tether.networks[networkId];
        if (tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            this.setState({ tether: tether });
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({ tetherBalance: tetherBalance.toString() });
        } else {
            window.alert('Error! Tether contract not deployed - no detected network')
        }

        //Load Rwd Contract
        const rwdData = Rwd.networks[networkId];
        if (rwdData) {
            const rwd = new web3.eth.Contract(Rwd.abi, rwdData.address);
            this.setState({ rwd: rwd });
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
            this.setState({ rwdBalance: rwdBalance.toString() });
        } else {
            window.alert('Error! Reward contract not deployed - no detected network')
        }

        //Load DecentralBank Contract
        const decentralBankData = DecentralBank.networks[networkId];
        if (decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            this.setState({ decentralBank: decentralBank });
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({ stakingBalance: stakingBalance.toString() });
        } else {
            window.alert('Error! DecentralBank contract not deployed - no detected network')
        }

        this.setState({ loading: false });

    }

    stakeTokens = (amount) => {
        this.setState({loading: true});
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account}).on('transactionHash', (hash)=> {});
        this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
            console.log(hash);
            this.setState({loading: false});
        });
    }

    unstakeTokens = () => {
        this.setState({loading: true});
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
            console.log(hash);
            this.setState({loading: false});
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true,
            stakeTokens : this.stakeTokens,
            unstakeTokens : this.unstakeTokens
        }
    }

    render() {
        let content
        {
            content = this.state.loading ? <p id='loader' className='text-center' style={{ margin: '30px' }} >LOADING PLEASE...</p> :
                <Main
                    tetherBalance={this.state.tetherBalance}
                    rwdBalance={this.state.rwdBalance}
                    stakingBalance={this.state.stakingBalance}
                    stakeTokens={this.state.stakeTokens}
                    unstakeTokens={this.state.unstakeTokens}
                />
        };
        return (
            <div>
                <div>
                    <NavBar account={this.state.account} />
                    <div className='container-fluid mt-5'>
                        <div className='row'>
                            <main role='main' className='col-lg-12 ml-auto mr-auto' style={{ maxWidth: '600px', minHeight: '100vm' }} >
                                <div>
                                    {content}
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default App;
import React, { Component } from 'react';
import tether from '../tether.png'
import Airdrop from './Airdrop';

class Main extends Component {
    render() {
        return (
            <div id='content' className='mt-3'>
                <table className='table text-muted text-center'>
                    <thead>
                        <tr style={{ color: 'white' }}>
                            <th scope='col'>Staking Balance</th>
                            <th scope='col'>Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ color: 'white' }}>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} USDT</td>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} Rwd</td>
                        </tr>
                    </tbody>
                </table>
                <div className='card mb-2' style={{ opacity: '0.9' }}>
                    <form className='mb-3'
                        onSubmit={(event) => {
                            event.preventDefault();
                            let amount;
                            amount = this.stakeInput.value.toString();
                            amount = window.web3.utils.toWei(amount, 'Ether');
                            this.props.stakeTokens(amount);
                        }}
                    >
                        <div style={{ borderSpacing: '0 1em' }}>
                            <label className='float-left' style={{ marginLeft: '15px' }} ><b>Stake Token</b></label>
                            <span className='float-right' style={{ marginRight: '8px' }}>
                                Balance: {window.web3.utils.fromWei(this.props.tetherBalance, 'Ether')}
                            </span>
                            <div className='input-group mb-4'>
                                <input
                                    ref={(input) => { this.stakeInput = input }}
                                    type='text' placeholder='0' required />
                                <div className='input-group-open'>
                                    <div className='input-group-text'>
                                        <img alt='tether' src={tether} height='32' />
                                        {'\u00A0'}{'\u00A0'}{'\u00A0'}USDT
                                    </div>
                                </div>
                            </div>
                            <button type='Submit' className='btn btn-primary btn-lg btn-block'>DEPOSIT</button>
                        </div>
                    </form>
                    <button onClick={(event) => {
                        event.preventDefault(
                            this.props.unstakeTokens()
                        );
                    }} className='btn btn-primary btn-lg btn-block'>WITHDRAW</button>
                    <div className='card-body text-center' style={{ color: 'blue' }}> AIRDROP <Airdrop stakingBalance={this.props.stakingBalance} /> </div>

                </div>
            </div>
        )
    }
}

export default Main;
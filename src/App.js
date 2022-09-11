import React, {Component} from 'react';
import bg from './assets/bg.jpg';
import './App.css';
import analyze from './lexicalAnalyzer';

class App extends Component {
    state = {
        analysedTokens: [],
        //code: ''
        code: `#include<stdlib.h>
#include "mylib.h"

void p(int[] a) {
    for (int i = 0; i < length - 1; i++) {
        printf("%d ", a[i]);
    }
    return;
}

int main() {
    printf("%d", 55);
    return 0;
}`,

    };


    render() {
        return (
            <div className="App" style={{
                background: 'url(' + bg + ')',
                backgroundSize: 'cover',
                WebkitBackgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className={'IDEContainer'}>
                    <textarea
                        className={'IDE'}
                        onChange={e => {
                            this.setState({code: e.target.value});
                        }}>{this.state.code}</textarea>
                </div>
                <div className={'TokenTableContainer'}>
                    <div className={"AnalyseBtnContainer"}>
                        <input type={"button"} className={"AnalyseBtn"} value={"Analyse"} onClick={() => {
                            this.setState({analysedTokens: analyze(this.state.code)});
                        }}/>
                    </div>
                    <div className={'JustTokenTableContainer'}>
                        <table className={"TokenTable"} cellPadding={0} cellSpacing={0}>
                            <thead>
                            <tr>
                                <td>row</td>
                                <td>col</td>
                                <td>block</td>
                                <td>token</td>
                                <td>type</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.analysedTokens && this.state.analysedTokens.map(token => (
                                    token.type !== 'error' ? (
                                        <tr key={'' + token.col + ',' + token.row + ',' + token.block + ',' + token.self + ',' + token.type}>
                                            <td>{token.row}</td>
                                            <td>{token.col}</td>
                                            <td>{token.block}</td>
                                            <td><code>{token.self}</code></td>
                                            <td>{token.type}</td>
                                        </tr>
                                    ) : (
                                        <tr className={'error'} key={'error' + token.message}>
                                            <td colSpan={5}>invalid entry near <code>{"'" + token.near + "'"}</code> at
                                                line {token.row} : <code>{"'" + token.self + "'"}</code></td>
                                        </tr>
                                    )
                                ))
                            }
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        );
    }
}

export default App;

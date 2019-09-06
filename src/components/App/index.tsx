import React from 'react';
import styles from './styles.scss';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import ContentCard from "../ContentCard";
import { inject, observer } from 'mobx-react';
import { AccountStore } from "@stores";

const {Header, Content, Footer} = Layout;
type TStateItem = {
    key: string
    value: string
}

type TParsedKey = {
    chunk: string | null
    hash: string | null
}

type TImage = { hash: string, content: { [key: string]: string } }

interface IState {
    images: TImage[]
}

interface IProps {
    accountStore?: AccountStore
}
@inject('accountStore')
@observer
class App extends React.Component<IProps, IState> {

    componentDidMount(): void {
        this.getData();
        this.props.accountStore!.setupWavesKeeper();
    }

    parseKey = (key: string): TParsedKey => {
        const match = key.match(/chunk_(\d+)_from_(.*)$/);
        return {
            chunk: match ? match[1] : null,
            hash: match ? match[2] : null
        }
    };

    state: IState = {
        images: []
    }

    getData = async () => {
        let response = await fetch('https://testnode1.wavesnodes.com/addresses/data/3NCoM7mcr2Y574DNHP74owQXMGKkX3CLB9y');
        const out: { [keyHash: string]: TImage } = {};
        if (response.ok) {
            let json = await response.json();
            json.forEach(({key, value}: TStateItem) => {
                const {chunk, hash} = this.parseKey(key);
                if (chunk == null || hash == null) return;
                out[hash] = out[hash] ? out[hash] : ({hash, content: {}});
                const content = out[hash].content || {};
                content[chunk] = value;
                out[hash] = {hash, content}
            })
        } else {
            alert("Ошибка HTTP: " + response.status);
        }

        this.setState({images: Object.entries(out).map(([_, value]) => value)})
    };

    render() {
        return <Layout className={styles.root}>
            <Header>
                <div className={styles.logo}/>
            </Header>
            <Content className={styles.root_content}>
                <Layout className={styles.layout}>
                    <Content className={styles.content}>
                        {this.state.images.map((img, i) => <ContentCard
                            data={Object.values(img.content).map(v => v).join('')}
                            address={img.hash}
                            key={i}
                        />)}
                    </Content>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>Waves faculty ©2019 Created by <a
                href="https://github.com/chlenc">chlenc</a></Footer>
        </Layout>
    }
}

export default App;

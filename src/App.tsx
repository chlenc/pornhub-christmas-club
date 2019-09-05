import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Icon, Layout, Menu } from 'antd';
import ContentCard from "./Components/ContentCard";

const {SubMenu} = Menu;
const {Header, Content, Footer, Sider} = Layout;
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

}

export default class App extends React.Component<IProps, IState> {
    componentDidMount(): void {
        this.getData()
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
        return <div className="root">
            <Layout>
                <Header className="header">
                    <div className="logo"/>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{lineHeight: '64px'}}
                    >
                        <Menu.Item key="1">List of posts</Menu.Item>
                        <Menu.Item key="2">Create a new post</Menu.Item>
                        <Menu.Item key="3">Action history</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '0 50px', margin: '48px 0 0 0'}}>
                    <Layout style={{padding: '24px 0', background: '#fff'}}>
                        <Sider width={200} style={{background: '#fff'}}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                style={{height: '100%'}}
                            >
                                <SubMenu
                                    key="sub1"
                                    title={
                                        <span>
                  <Icon type="user"/>
                  My accounts
                </span>
                                    }
                                >
                                    <Menu.Item key="1">acc1</Menu.Item>
                                    <Menu.Item key="2">acc2</Menu.Item>
                                    <Menu.Item key="3">acc3</Menu.Item>
                                    <Menu.Item key="4">acc4</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="sub2"
                                    title={
                                        <span>
                  <Icon type="laptop"/>
                  My posts
                </span>
                                    }
                                >
                                    <Menu.Item key="5">option5</Menu.Item>
                                    <Menu.Item key="6">option6</Menu.Item>
                                    <Menu.Item key="7">option7</Menu.Item>
                                    <Menu.Item key="8">option8</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="sub3"
                                    title={
                                        <span>
                  <Icon type="notification"/>
                  My likes
                </span>
                                    }
                                >
                                    <Menu.Item key="9">option9</Menu.Item>
                                    <Menu.Item key="10">option10</Menu.Item>
                                    <Menu.Item key="11">option11</Menu.Item>
                                    <Menu.Item key="12">option12</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
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
        </div>;
    }
}


import React from "react";
import { Card, Icon } from 'antd';
import Avatar from "../Avatar";
import styles from './styles.scss'
const { Meta } = Card;

interface IProps {
    data: string
    address: string
}

export default class ContentCard extends React.Component<IProps>{
render() {
    return  <Card
        className={styles.root}
        cover={<img src={this.props.data}/>}
        actions={[
            <Icon type="like" key="like" />,
            <Icon type="dislike" key="dislike" />,
            <Icon type="ellipsis" key="ellipsis" />,
        ]}
    >
        <Meta
            avatar={<Avatar size={48} address={this.props.address} />}
            title={this.props.address}
            description="This is the description"
        />
    </Card>;
}
}

import React from "react";
import { Card, Icon } from 'antd';
import Avatar from "../Avatar";
const { Meta } = Card;

interface IProps {
    data: string
    address: string
}

export default class ContentCard extends React.Component<IProps>{
render() {
    return  <Card
        style={{ width: '40vw', marginBottom: '64px' }}
        cover={
            <img
                alt="example"
                src={this.props.data}
            />
        }
        actions={[
            <Icon type="heart" key="setting" />,
            <Icon type="share-alt" key="edit" />,
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

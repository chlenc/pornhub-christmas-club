import * as React from 'react';
import * as avatar from 'identity-img';


const SIZE = 28;

interface IProps {
    size?: number,
    address: string,
    onClick?: () => void
}

const Avatar = (props: IProps) => {
    const {
        size = SIZE,
        address,
        onClick
    } = props;

    avatar.config({
        rows: 8,
        cells: 8
    });

    const src = address
        ? avatar.create(address, { size: size * 3 })
        : '';

    return (
        <div
            style={{
                display: 'flex',
                overflow: 'hidden',
                cursor: 'pointer',
                alignItems: 'center'
            }}
            onClick={onClick}
        >
            <img
                src={src}
                width={size}
                height={size}
                alt="Avatar"
                style={{borderRadius: '50%'}}
            />
        </div>
    );
};

export default Avatar;

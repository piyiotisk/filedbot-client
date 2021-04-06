import React, { ReactNode } from 'react'

interface Props {
    maxWidth: string;
    bgColor?: string;
    shadow?: string;
    children: ReactNode[];
}

const Container = (props: Props) => {
    const { children, bgColor, shadow } = props;

    return (
        <div className={`container w-11/12 sm:w-full ${props.maxWidth} mx-auto ${shadow || 'shadow-lg'} rounded-lg ${bgColor || 'bg-white'} my-2`}>
            {children}
        </div>
    )
}

export default Container

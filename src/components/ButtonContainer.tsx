import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode | ReactNode[];
}

const ButtonContainer = (props: Props) => {
    let { children } = props;
    const results: ReactNode[] = React.Children.toArray(children);

    return (
        <div className={`container w-11/12 sm:w-full mx-auto my-1`}>
            <div className="flex flex-col sm:flex-row justify-end py-4">
                {results.map((child, index: number) => {
                    return (
                        <span key={index} className="my-1 sm:pl-1">
                            {child}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

export default ButtonContainer

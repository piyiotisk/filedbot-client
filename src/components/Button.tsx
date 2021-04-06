import React from 'react'

interface Props {
    buttonText: string;
    onClick(event: any): void;
}

const Button = (props: Props) => {
    const { onClick, buttonText } = props;

    return (
        <span className="inline-flex rounded-md shadow-sm">
            <button
                onClick={onClick}
                type="button"
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">                {buttonText}
            </button>
        </span>
    )
}

export default Button

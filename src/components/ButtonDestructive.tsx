import React from 'react'

interface Props {
    buttonText: string;
    onClick(): void;
}

const ButtonDestructive = (props: Props) => {
    const { onClick, buttonText } = props;

    return (
        <button
            onClick={onClick}
            type="button"
            className="inline-flex items-center justify-center w-full px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150">
            {buttonText}
            <svg className="ml-2 -mr-0.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
            </svg>
        </button>
    )
}

export default ButtonDestructive

import React from 'react'

interface Props {
    buttonText: string;
    svgPathElementD: string;
    onClick(event: any): void;
}

const ButtonWithIcon = (props: Props) => {
    const { onClick, buttonText, svgPathElementD } = props;

    return (
        <button
            onClick={onClick}
            type="button"
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
            {buttonText}
            <svg
                fill="currentColor"
                className="ml-2 -mr-0.5 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d={svgPathElementD} />
            </svg>
        </button>
    )
}

export default ButtonWithIcon;

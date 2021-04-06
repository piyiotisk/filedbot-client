import React from 'react'

export default function Input(props) {
    return (
        <div className="w-full py-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                {props.labelName || ''}
                {props.required && <span className="mx-2 text-xs capitalize text-red-700">Required</span>}
            </label>
            <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-100 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-300"
                autoComplete="off"
                type={props.type || "text"}
                name={props.name}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown || undefined}
                onKeyPress={e => {
                    if (e.key === 'Enter') e.preventDefault();
                }}
            />
            <p className="text-gray-600 text-xs italic">{props.detailInputExplanation}</p>
        </div>
    )
}

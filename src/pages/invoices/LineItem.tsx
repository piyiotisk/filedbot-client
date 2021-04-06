import React, { Component } from 'react'

interface Props {
    index: number;
    name: string;
    description: string;
    quantity: string | number;
    price: string | number;

    changeHandler: any;
    focusHandler: any;
    deleteHandler: any;
    currencyFormatter: any;
}

interface State {

}

export default class LineItem extends Component<Props, State>  {

    render = () => {

        const { index, name, description, quantity, price } = this.props as any;

        return (
            <div className="flex flex-row justify-between my-2 text-gray-900 py-1 border-b border-gray-400 bg-white">
                <div className="w-1/12 self-center mr-1 text-center">{index + 1}</div>
                <input className="w-2/12 mr-1 text-center rounded-lg bg-gray-100" name="name" type="text" value={name} placeholder="Name" onChange={this.props.changeHandler(index)} />
                <input className="w-3/12 mr-1 text-center rounded-lg bg-gray-100" name="description" type="text" value={description} placeholder="Description" onChange={this.props.changeHandler(index)} />
                <input className="w-1/12 mr-1 text-center rounded-lg bg-gray-100" name="quantity" type="number" step="1" value={quantity} placeholder="1" onChange={this.props.changeHandler(index)} onFocus={this.props.focusHandler} />
                <input className="w-2/12 mr-1 text-center rounded-lg bg-gray-100" name="price" type="number" step="0.01" min="0.00" max="9999999.99" value={price} placeholder="9.99" onChange={this.props.changeHandler(index)} onFocus={this.props.focusHandler} />
                <div className="w-2/12 self-center h-full mr-1 text-center">{this.props.currencyFormatter(quantity * price)}</div>
                <div className="w-1/12 mr-1 text-center">
                    <button
                        onClick={this.props.deleteHandler(index)}
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
                        </svg>
                    </button>
                </div>
            </div>
        )
    }
}
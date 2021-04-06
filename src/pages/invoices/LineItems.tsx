import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import LineItem from './LineItem'
import ButtonWithIcon from '../../components/ButtonWithIcon'

interface Props {
    items: any[];
    currencyFormatter: any;
    addHandler: any;
    changeHandler: any;
    focusHandler: any;
    deleteHandler: any;
    reorderHandler: any;
}
interface State {

}
export default class LineItems extends Component<Props, State> {

    handleDragEnd = (result: any) => {

        if (!result.destination) return

        // helper function to reorder result (src: react-beautiful-dnd docs)
        const reorder = (list: any, startIndex: any, endIndex: any) => {
            const result = Array.from(list)
            const [removed] = result.splice(startIndex, 1)
            result.splice(endIndex, 0, removed)
            return result
        }

        // perform reorder
        const lineItems = reorder(
            this.props.items,
            result.source.index,
            result.destination.index
        )

        // call parent handler with new state representation
        this.props.reorderHandler(lineItems)

    }

    render = () => {

        const { items, addHandler, reorderHandler, ...functions } = this.props

        return (
            <form className="text-gray-900 m-2">
                <div>
                    <div>
                        <div className="flex flex-row justify-between my-2 border-b-2 border-gray-600">
                            <div className="w-1/12 text-center">#</div>
                            <div className="w-2/12 text-center">Item</div>
                            <div className="w-3/12 text-center">Description</div>
                            <div className="w-1/12 text-center">Qty</div>
                            <div className="w-2/12 text-center">Price</div>
                            <div className="w-2/12 text-center">Total</div>
                            <div className="w-1/12 text-center">Actions</div>
                        </div>

                        <DragDropContext onDragEnd={this.handleDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                    >
                                        {this.props.items.map((item: any, i: number) => (
                                            <Draggable key={item.id} draggableId={item.id} index={i}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <LineItem
                                                            key={i + item.id}
                                                            index={i}
                                                            name={item.name}
                                                            description={item.description}
                                                            quantity={item.quantity}
                                                            price={item.price}
                                                            {...functions}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                    </div>

                    <div className="flex justify-end mr-1">
                        <ButtonWithIcon
                            buttonText="Add Item"
                            svgPathElementD="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"
                            onClick={addHandler}
                        />
                    </div>

                </div>
            </form>

        )
    }
}

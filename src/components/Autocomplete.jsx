import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '../components/Input';

export class Autocomplete extends Component {
    static propTypes = {
        suggestions: PropTypes.instanceOf(Array).isRequired
    };
    state = {
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: ''
    };

    onChange = (e) => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;

        const filteredSuggestions = suggestions.filter(
            (suggestion) =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });
    };

    clearInput = () => {
        this.setState({
            userInput: ''
        });
    }

    onClick = (e) => {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });
        this.props.onAddition(e.currentTarget.innerText);
        this.clearInput();
    };

    onKeyDown = (e) => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });
            this.props.onAddition(filteredSuggestions[activeSuggestion] || this.state.userInput);
            this.clearInput();
        } else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion - 1 });
        } else if (e.keyCode === 40) {
            if (activeSuggestion === filteredSuggestions.length - 1) {
                return;
            }
            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };


    render() {
        const {
            onChange,
            onClick,
            onKeyDown,

            state: { activeSuggestion, filteredSuggestions, showSuggestions, userInput }
        } = this;
        let suggestionList;
        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionList = (
                    <ul className="-mt-4 mb-3 px-4 rounded bg-gray-200 text-gray-600 shadow-xl">
                        {filteredSuggestions.map((suggestionName, index) => {
                            let className;
                            if (index === activeSuggestion) {
                                className = "text-gray-900";
                            }
                            return (
                                <li className={className} key={suggestionName} onClick={onClick}>
                                    {suggestionName}
                                </li>
                            );
                        })}
                    </ul>
                );
            }
        }
        return (
            <React.Fragment>
                <Input name='tag' labelName='' placeholder='tag 1' value={userInput} onChange={onChange} onKeyDown={onKeyDown} detailInputExplanation='' />
                {suggestionList}
            </React.Fragment>
        );
    }
}

export default Autocomplete;

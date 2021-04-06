import React from 'react'

interface Props {
    tags: string[];
}

const tagsExist = (tags: string[]): boolean => {
    if (!tags) {
        return false;
    }

    if (tags.length === 0) {
        return false;
    }

    return true;
}

const TagsCard = (props: Props) => {
    const { tags } = props;

    return (
        <div>
            {
                tagsExist(tags) &&
                <div className="inline-flex">
                    {
                        tags.map((tag: string, index: number) => {
                            return (
                                <div key={index} className="mr-1 flex-shrink-0 flex">
                                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-800 bg-gray-200"}>
                                        {tag}
                                    </span>
                                </div>);
                        })
                    }
                </div>
            }
            {!tagsExist(tags) && <div>
                No tags
            </div>
            }
        </div>
    )
}

export default TagsCard

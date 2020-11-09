import React from 'react';
import TabChild from './Tab/TabChild';
import TabParent from './Tab/TabParent';

import CollectionCards from './Card/CollectionCards';

class Content extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //My collections and cards
            myCollections: [
                //Mock data
                {
                    id: 1,
                    title: "July",
                    description: "Words on the best of July",
                    liked: 0,
                    likes: 12
                },
                {
                    id: 2,
                    title: "May",
                    description: "To may or not to may",
                    liked: 1,
                    likes: 20
                }
            ],
            myCards: [],

            //Hot collections and cards
            hotCollections: [],
            hotCards: [],

            //Liked collections and cards
            likedCollections: [],
            likedCards: []
        }
    }
    render() {
        return (
            <TabParent>
                <TabChild name="Hot">
                    1
                </TabChild>

                <TabChild name="Mine">
                    <CollectionCards cards={this.state.myCollections}/>
                </TabChild>

                <TabChild name="Liked">
                    3
                </TabChild>
            </TabParent>
        )
    }
}

export default Content;
import React from 'react';
import TabChild from './Tab/TabChild';
import TabParent from './Tab/TabParent';

class Content extends React.Component {
    render() {
        return (
            <TabParent>
                <TabChild name="Hot">
                    1
                </TabChild>

                <TabChild name="Mine">
                    2
                </TabChild>

                <TabChild name="Liked">
                    3
                </TabChild>
            </TabParent>
        )
    }
}

export default Content;
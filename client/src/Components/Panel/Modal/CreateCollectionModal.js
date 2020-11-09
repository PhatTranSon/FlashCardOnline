import React from 'react';
import './style.css';
import Modal from 'react-modal';

class CollectionModal extends React.Component {
    render() {
        //Get the props
        const { isOpen } = this.props;

        //Custom modal style
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
        };
          

        return (
            <Modal 
                isOpen={isOpen}
                style={customStyles}>
                <div className="create-collection-modal">
                    <h1>Create collection</h1>
                </div>
            </Modal>
        )
    }
}

export default CollectionModal;
import { confirmAlert } from 'react-confirm-alert';

export const confirm = async (message, callback) => { 
  const options = {
    title: 'Confimation Dialog',
    message: message,
    buttons: [
      { label: 'Yes', onClick: () => callback() },
      { label: 'No', onClick: () => false }
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    willUnmount: () => { },
    onClickOutside: () => false,
    onKeypressEscape: () => false
  };
  return await confirmAlert(options)
}
// module.exports = confirm;

// export default confirm;
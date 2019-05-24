import { Component } from 'react';
import { toast } from 'react-toastify';
import _ from "lodash";
export default class ToastService extends Component {
    static Toast = (Message, Type) => {

        if (Type === 'default') {
            toast.dismiss()
            toast(_.capitalize(Message));
        }
        if (Type === 'success') {
            toast.dismiss()
            toast.success(Message)
        }
        if (Type === 'error') {
            toast.dismiss()
            toast.error(Message)
        }
        if (Type === 'warn') {
            toast.dismiss()
            toast.warn(Message)
        }
        if (Type === 'info') {
            toast.dismiss()
            toast.info(Message)
        }


    }
}
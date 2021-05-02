import { toast } from "react-toastify";

const options = {
    onOpen: props => console.log(props.foo),
    onClose: props => console.log(props.foo),
    autoClose: 6000,
    type: toast.TYPE.INFO,
    hideProgressBar: false,
    position: toast.POSITION.TOP_LEFT,
    pauseOnHover: true,
    progress: 0.2
    // and so on ...
};

export default options;
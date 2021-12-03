class AlertHelper {
    constructor(alert, _){
        this.alert = alert;
        this.timer = 1500;
        this._ = _;
    }

    showSystemErrorDialog(){
        this.alert.fire({
            position: 'top',
            icon: 'error',
            title: this._('error.serverErrorTitle'),
            text: this._('error.serverErrorMessage'),
            reverseButtons: true,
            customClass: {
                icon: 'icon-error',
            },
        });
    }
    showSuccessDialog(){
        this.alert.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: this._('account.loginSuccess'),
            showConfirmButton: false,
            timerProgressBar: true,
            timer: this.timer,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', this.alert.stopTimer);
                toast.addEventListener('mouseleave', this.alert.resumeTimer);
            },
        });
    }
};

export default AlertHelper;
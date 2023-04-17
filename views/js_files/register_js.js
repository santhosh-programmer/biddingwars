
function showToolTip(tooltip) {
    if(tooltip=='firstNameTip')
    window.alert('Enter your First Name \nMin 3 characters required')
    else if(tooltip=='lastNameTip')
    window.alert('Enter your Last Name \nMin 1 character required')
    else if(tooltip=='userNameTip')
    window.alert('Enter unique user name \nMust not contain period (.) or spaces and must be atleast 5 characters')
    else if(tooltip=='passwordTip')
    window.alert('Min 8 characters required and must containe atleast one number, one capital letter')
    else if(tooltip=='confirmPasswordTip')
    window.alert('Enter same Password to confirm')
    else if(tooltip=='emailTip')
    window.alert('Enter valid email id')
}
const useValidation = (t) => {
    const passwordLength = (value) => {
        return (!!value && value.length >= 8) || t('validate.password.length')
    }
    const required = (value) => !!value || t('validate.required');
    const email = (value) => {
        const pattern =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return (!!value && pattern.test(value)) || t('validate.email');
    }
    const password = (value) => {
        const passwordRules = [passwordLength] //Add rules here, to create new pw requirements
        var valid = 0;
        var message = [];
    
        passwordRules.forEach(r => {
            const ruleResult = r(value);
            if (ruleResult !== true) {
                message.push(ruleResult);
            }
            else {
                valid++;
            }
        })
    
        return  valid === passwordRules.length || message.join(', ');
    }

    return {
        required,
        email,
        password
    }
}

export { useValidation };
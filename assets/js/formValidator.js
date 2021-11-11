function Validator(options){
    var selectorRules = {};
    function Validate(inputElement,rule){
        var errorMassage;
        var errorElement = inputElement.parentElement.querySelector(options.formMassage);
        var rules = selectorRules[rule.selector];
        for(var i=0; i < rules.length; i++){
            errorMassage = rules[i](inputElement.value);
            if(errorMassage){
                break;
            }
        }
        if(errorMassage){
            errorElement.innerText = errorMassage;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMassage;
    }
    var formElement = document.getElementById(options.form);
    var submit_form = document.getElementById("submit_register");
    if(formElement){
        formElement.onsubmit = function(e){ 
            e.preventDefault();
            var isFormvalid = true;
            options.rules.forEach(function(rule){         
                var inputElement = formElement.querySelector(rule.selector);
                var errorElement = inputElement.parentElement.querySelector(options.formMassage);
                var isvalid = Validate(inputElement,rule);
                if(!isvalid){
                    isFormvalid = false;
                }
                if(inputElement){
                    inputElement.onblur = function(){
                        Validate(inputElement,rule);
                    }
                    inputElement.oninput = function(){
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('invalid');
                    }
                }
            })
            if(isFormvalid){
                alert('Đăng Ký Thành Công');
            }
        }        
        options.rules.forEach(function(rule){
                if(Array.isArray(selectorRules[rule.selector])){
                    selectorRules[rule.selector].push(rule.test);
                }
                else{
                    selectorRules[rule.selector] = [rule.test];
                }  
        });


    }
}
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value){
            return value ? undefined:"Vui lòng nhập trường này";
        }
    };
}
Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value){
            var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regexEmail.test(value) ?undefined:"Nhập địa chỉ email không chính xác";
        }
    };
}
Validator.minLength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min? undefined: 'Mật khẩu phải lớn hơn hoặc bằng 8 ký tự';
        }
    };
}
Validator.isConfirmPassword = function(selector, password){
    return {
        selector: selector,
        test: function(value){
            return value === password() ? undefined: "Nhập lại mật khẩu không chính xác";
        }
    };
}
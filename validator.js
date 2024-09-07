function Validator(option) {
  function validate(inputElement, rule) {
    var errorElement =
      inputElement.parentElement.querySelector(".form-message");
    var errorMessage = rule.test(inputElement.value);

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("ivalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("ivalid");
    }
  }
  var formElement = document.querySelector(option.form);
  if (formElement) {
    option.rules.forEach(function (rule) {
      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        // xử lí khi blur khỏi input
        inputElement.onblur = function () {
          //Value: inputElement.value
          //test function: rule.test
          validate(inputElement, rule);
        };

        //xử lí khi user nhập vào input
        inputElement.oninput = function () {
          var errorElement =
            inputElement.parentElement.querySelector(".form-message");
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("ivalid");
        };
      }
    });
  }
}

Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập đầy đủ Tên";
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      return regex.test(value) ? undefined : "Vui lòng nhập đúng Email";
    },
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};

Validator.isAgain = function (selector, isAgain, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === isAgain() ? undefined : message || 'Giá trị nhập lại sai'
    },
  };
};

Validator({
  form: "#form-1",
  rules: [
    Validator.isRequired("#full-name"),
    Validator.isEmail("#email"),
    Validator.minLength("#password", 6),
    Validator.isAgain('#ag-password', function() {
      return document.querySelector('#form-1 #password').value
    }, 'Mật khẩu nhập lại không chính xác')
  ],
});

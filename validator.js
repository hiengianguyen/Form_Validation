function Validator(option) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};

  function validate(inputElement, rule) {
    var errorElement = getParent(
      inputElement,
      option.formGroupSelector
    ).querySelector(".form-message");
    var errorMessage;

    var rules = selectorRules[rule.selector];

    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](inputElement.value);
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, option.formGroupSelector).classList.add("ivalid");
    } else {
      errorElement.innerText = "";
      getParent(inputElement, option.formGroupSelector).classList.remove(
        "ivalid"
      );
    }

    return !errorMessage;
  }
  var formElement = document.querySelector(option.form);
  if (formElement) {
    //xử lí khi summit form
    formElement.onsubmit = function (e) {
      var isFormValid = true;
      e.preventDefault();

      option.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid) {
        if (typeof option.onSubmit === "function") {
          var enableInput = document.querySelectorAll("[name]");
          var formValue = Array.from(enableInput).reduce(function (
            value,
            input
          ) {
            value[input.name] = input.value;
            return value;
          },
          {});

          option.onSubmit(formValue);
        }
      }
    };

    option.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

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
          var errorElement = getParent(
            inputElement,
            option.formGroupSelector
          ).querySelector(".form-message");
          errorElement.innerText = "";
          getParent(inputElement, option.formGroupSelector).classList.remove(
            "ivalid"
          );
        };
      }
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập đầy đủ Tên";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      return regex.test(value)
        ? undefined
        : message || "Vui lòng nhập đúng Email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};

Validator.isAgain = function (selector, isAgain, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === isAgain()
        ? undefined
        : message || "Giá trị nhập lại sai";
    },
  };
};

Validator({
  form: "#form-1",
  formGroupSelector: ".form-group",
  rules: [
    Validator.isRequired("#full-name"),
    Validator.isRequired("#email", "Vui lòng nhập Email"),
    Validator.isEmail("#email"),
    Validator.isRequired("#password", "Vui lòng nhập Password"),
    Validator.minLength("#password", 6),
    Validator.isRequired("#ag-password", "Vui lòng nhập vào giá trị"),
    Validator.isRequired("input[name='gender']"),

    Validator.isAgain(
      "#ag-password",
      function () {
        return document.querySelector("#form-1 #password").value;
      },
      "Mật khẩu nhập lại không chính xác"
    ),
  ],
  onSubmit: function (data) {
    console.log(data);
  },
});

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
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
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
            switch (input.type) {
              case "radio":
                value[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  value[input.name] = "";
                  return value;
                }
                if (!Array.isArray(value[input.name])) {
                  value[input.name] = [];
                }
                value[input.name].push(input.value);
                break;
              case "file":
                value[input.name] = input.files;
                break;
              default:
                value[input.name] = input.value;
            }

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

      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
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
      });
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || "Vui lòng nhập đầy đủ Tên";
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
    Validator.isRequired("#password-confirmation", "Vui lòng nhập vào giá trị"),
    // Validator.isRequired("#avatar", "Vui lòng chọn file"),
    // Validator.isRequired("input[name='gender']", "Vui lòng nhập giá trị"),
    Validator.isAgain(
      "#password-confirmation",
      function () {
        return document.querySelector("#form-1 #password").value;
      },
      "Mật khẩu nhập lại không chính xác"
    ),
  ],
  onSubmit: function (data) {
    //handle API
    console.log(data);
  },
});

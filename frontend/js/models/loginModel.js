const EMAIL_PATTERN = /^[\w.!#$%&’*+/=?^_`{|}~-]+@[\w-]+(\.[\w-]+)+$/;

const LoginModel = Backbone.Model.extend({
  defaults: {
    email: "",
    password: "",
    loading: false,
    status: null,
    message: null
  },

  validate(attrs) {
    const errors = {};

    if (!attrs.email) {
      errors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(attrs.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!attrs.password) {
      errors.password = "Password is required.";
    } else if (attrs.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (Object.keys(errors).length) {
      return errors;
    }
  },

  authenticate() {
    this.set({ loading: true, status: null, message: null });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, password } = this.attributes;
        const isDemoUser = email.toLowerCase() === "user@example.com" && password === "password123";

        this.set("loading", false);

        if (isDemoUser) {
          this.set({ status: "success", message: "Welcome back!" });
          resolve(this.get("message"));
        } else {
          this.set({ status: "error", message: "Invalid email or password." });
          reject(new Error(this.get("message")));
        }
      }, 1300);
    });
  }
});

export default LoginModel;

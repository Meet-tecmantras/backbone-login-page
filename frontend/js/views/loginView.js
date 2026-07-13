import LoginModel from "../models/loginModel.js";

const loadTemplate = async () => {
  const response = await fetch("./templates/loginTemplate.html");

  if (!response.ok) {
    throw new Error("Unable to load the login template.");
  }

  return response.text();
};

const LoginView = Backbone.View.extend({
  el: "#app",
  template: "",

  events: {
    "submit #login-form": "handleSubmit",
    "input input": "clearFieldError"
  },

  initialize() {
    this.model = new LoginModel();

    this.listenTo(this.model, "change:status change:message change:loading", this.renderStatus);

    loadTemplate()
      .then((template) => {
        this.template = template;
        this.render();
      })
      .catch((error) => {
        this.$el.html(`<p class="loader">${error.message}</p>`);
      });
  },

  render() {
    if (!this.template) {
      this.$el.html('<p class="loader">Preparing interface…</p>');
      return;
    }

    this.$el.html(this.template);
    this.delegateEvents();
    this.renderStatus();
  },

  renderStatus() {
    if (!this.$(".form-status").length) {
      return;
    }

    const statusEl = this.$(".form-status");
    const status = this.model.get("status");
    const message = this.model.get("message");
    const loading = this.model.get("loading");

    statusEl
      .removeClass("success error")
      .toggleClass("error", status === "error")
      .toggleClass("success", status === "success")
      .text(message || "");

    this.$("button[type='submit']").prop("disabled", loading);
  },

  handleSubmit(event) {
    event.preventDefault();

    const formData = {
      email: this.$("#email").val().trim(),
      password: this.$("#password").val()
    };

    if (!this.model.set(formData, { validate: true })) {
      this.displayFieldErrors(this.model.validationError);
      return;
    }

    this.clearFieldErrors();

    this.model
      .authenticate()
      .then((message) => this.showNotification(message, "success"))
      .catch((error) => this.showNotification(error.message, "error"));
  },

  displayFieldErrors(errors = {}) {
    Object.entries(errors).forEach(([field, message]) => {
      this.$(`[data-error-for="${field}"]`).text(message);
    });
  },

  clearFieldError(event) {
    if (!event || !event.target) return;

    const field = event.target.getAttribute("name");
    if (field) {
      this.$(`[data-error-for="${field}"]`).text("");
    }
  },

  clearFieldErrors() {
    this.$(".field-error").text("");
  },

  showNotification(message, type) {
    this.model.set({ message, status: type });
  }
});

export default LoginView;

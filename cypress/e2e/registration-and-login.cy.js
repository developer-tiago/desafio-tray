import { faker } from "@faker-js/faker/locale/en"; // Importando biblioteca para gerar dados

class RegisterForm {
  elements = {
    inputName: () => cy.get("#nome"),
    inputEmail: () => cy.get("#email"),
    inputPassword: () => cy.get("#senha"),
    btnRegister: () => cy.get("input[type='submit']"),
    alertSuccess: () => cy.get(".alert-success"),
    alertError: () => cy.get(".alert-danger"),
  };

  typeName(name) {
    this.elements.inputName().type(name);
  }

  typeEmail(email) {
    this.elements.inputEmail().type(email);
  }

  typePassword(password) {
    this.elements.inputPassword().type(password, {
      log: false,
    });
  }

  clickButtonRegister() {
    this.elements.btnRegister().click();
  }

  verifyAlert(alertType, message) {
    alertType.should("be.visible").should("have.text", message);
  }
}

class LoginPage {
  elements = {
    inputEmail: () => cy.get("#email"),
    inputPassword: () => cy.get("#senha"),
    btnLogin: () => cy.contains("button", "Entrar"),
    alertError: () => cy.get(".alert-danger"),
    alertSuccess: () => cy.get(".alert-success"),
  };

  typeEmail(email) {
    this.elements.inputEmail().type(email);
  }

  typePassword(password) {
    this.elements.inputPassword().type(password, {
      log: false,
    });
  }

  clickButtonLogin() {
    this.elements.btnLogin().click();
  }

  verifyAlert(alertType, message) {
    alertType.should("be.visible").should("have.text", message);
  }
}

const registerForm = new RegisterForm();
const loginPage = new LoginPage();

describe("Testes de Cadastro e Login", () => {
  const name = faker.internet.userName();
  const email = faker.internet.exampleEmail();
  const validPassword = faker.internet.password();
  const invalidPassword = faker.internet.password();
  const expectedErrorMessages = {
    register: [
      "Nome é um campo obrigatório",
      "Email é um campo obrigatório",
      "Senha é um campo obrigatório",
    ],
    login: ["Email é um campo obrigatório", "Senha é um campo obrigatório"],
  };

  it("Cenário 1: Cadastro com nome, e-mail e senha válidos", () => {
    // Acessa a página de Novo Usuário
    cy.visit("/cadastro");

    // Preenche os campos de cadastro
    registerForm.typeName(name);
    registerForm.typeEmail(email);
    registerForm.typePassword(validPassword);

    // Clicka no botão de cadastrar
    registerForm.clickButtonRegister();

    // Verifica se a mensagem de sucesso é exibida
    registerForm.verifyAlert(
      registerForm.elements.alertSuccess(),
      "Usuário inserido com sucesso"
    );
  });

  it("Cenário 2: Login com senha inválida", () => {
    // Acessa a página de login
    cy.visit("/login");

    // Preenche os campos de login
    loginPage.typeEmail(email);
    loginPage.typePassword(invalidPassword);

    // Clicka no botão de entrar
    loginPage.clickButtonLogin();

    // Verifica se a mensagem de erro é exibida
    loginPage.verifyAlert(
      loginPage.elements.alertError(),
      "Problemas com o login do usuário"
    );
  });

  it("Cenário 3: Login com credenciais válidas", () => {
    // Acessa a página de login
    cy.visit("/login");

    // Preenche os campos de login
    loginPage.typeEmail(email);
    loginPage.typePassword(validPassword);

    // Clicka no botão de entrar
    loginPage.clickButtonLogin();

    // Verifica se a mensagem de bem vindo é exibida
    loginPage.verifyAlert(
      loginPage.elements.alertSuccess(),
      `Bem vindo, ${name}!`
    );
  });

  it("Cenário 4: Cadastro com e-mail já utilizado", () => {
    // Acessar a página de Novo usuário
    cy.visit("/cadastro");

    // Preenche os campos de cadastro
    registerForm.typeName(name);
    registerForm.typeEmail(email);
    registerForm.typePassword(validPassword);

    // Clicka no botão de cadastrar
    registerForm.clickButtonRegister();

    // Verifica se a mensagem de erro é exibida
    registerForm.verifyAlert(
      registerForm.elements.alertError(),
      "Endereço de email já utilizado"
    );
  });

  it("Cenário 5: Cadastro com todos os campos vazios", () => {
    // Acessar a página de Novo usuário
    cy.visit("/cadastro");

    // Clicka no botão de cadastrar
    registerForm.clickButtonRegister();

    // Verificar se a página foi redirecionada para /cadastrarUsuario
    cy.url().should("include", "/cadastrarUsuario");

    // Verificar se há 3 elementos de erro e as mensagens específicas para cada campo
    registerForm.elements.alertError().should("have.length", 3);
    registerForm.elements.alertError().each((element, index) => {
      cy.wrap(element).should(
        "have.text",
        expectedErrorMessages.register[index]
      );
    });
  });

  it("Cenário 6: Login com todos os campos vazios", () => {
    // Acessa a página de login
    cy.visit("/login");

    // Clicka no botão de entrar
    loginPage.clickButtonLogin();

    // Verificar se a página foi redirecionada para /logar
    cy.url().should("include", "/logar");

    // Verificar se há 2 elementos de erro e as mensagens específicas para cada campo
    loginPage.elements.alertError().should("have.length", 2);
    loginPage.elements.alertError().each((element, index) => {
      cy.wrap(element).should("have.text", expectedErrorMessages.login[index]);
    });
  });
});

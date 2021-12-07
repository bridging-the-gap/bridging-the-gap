import { Selector } from 'testcafe';
import { navBar } from './navbar.component';

class Company {
  constructor() {
    this.pageID = '#company-home';
    this.pageSelector = Selector(this.pageID);
  }

  /** Asserts that this page is displayed */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts if add job works */
  async gotoAddJob(testController) {
    await testController.wait(25000).click('#addJob');
  }

  /** Asserts if edit Job works */
  async editJob(testController) {
    const editTitle = 'default name 2';
    const location = 'Earth 2';
    const pay = '$1';
    const industry = 'Liberal Arts';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const description = 'This is not a job';
    await testController.click('#editJob');
    await testController.selectText('#jobTitle').pressKey('delete');
    await testController.typeText('#jobTitle', editTitle);
    await testController.selectText('#location').pressKey('delete');
    await testController.typeText('#location', location);
    await testController.selectText('#salary').pressKey('delete');
    await testController.typeText('#salary', pay);
    await testController.selectText('#industry').pressKey('delete');
    await testController.typeText('#industry', industry);
    await testController.selectText('#image').pressKey('delete');
    await testController.typeText('#image', image);
    await testController.selectText('#description').pressKey('delete');
    await testController.typeText('#description', description);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }

  /** Asserts if edit Event works */
  async editEvent(testController) {
    const eventName = 'Default name 1';
    const location = 'UH Manoa';
    const date = '2022-03-02';
    const description = 'Test to edit event';
    const picture = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    await testController.click('#editEvent');
    await testController.selectText('#eventName').pressKey('delete');
    await testController.typeText('#eventName', eventName);
    await testController.selectText('#location').pressKey('delete');
    await testController.typeText('#location', location);
    await testController.selectText('#date').pressKey('delete');
    await testController.typeText('#date', date);
    await testController.selectText('#description').pressKey('delete');
    await testController.typeText('#description', description);
    await testController.selectText('#picture').pressKey('delete');
    await testController.typeText('#picture', picture);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }

  /** Asserts if add Company works */
  async addCompany(testController) {
    const title = 'fireworksRus';
    const location = 'North Pole';
    const contact = 'santa@foo.com';
    const industry = 'Explosions';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const description = 'This is  a company';
    await testController.click('#addCompany');
    await testController.typeText('#companyName', title);
    await testController.typeText('#location', location);
    await testController.typeText('#contact', contact);
    await testController.typeText('#industry', industry);
    await testController.typeText('#image', image);
    await testController.typeText('#description', description);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }

  /** Creates new company account */
  async signupCompany(testController, username, role, password) {
    await testController.typeText('#signup-form-email', username);
    await testController.typeText('#signup-form-password', password);
    await testController.click('#company-button');
    await testController.click('#signup-form-submit');
    await navBar.isLoggedIn(testController, username);
    await testController.click(Selector('.swal-button--confirm'));
  }

  /** Asserts if edit Company works */
  async editCompany(testController) {
    const title = 'cafe';
    const location = 'Hawaii';
    const contact = 'bob@foo.com';
    const industry = 'Liberal Arts';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const description = 'This is not a company';
    await testController.click('#editCompany');
    await testController.selectText('#companyName').pressKey('delete');
    await testController.typeText('#companyName', title);
    await testController.selectText('#location').pressKey('delete');
    await testController.typeText('#location', location);
    await testController.selectText('#contact').pressKey('delete');
    await testController.typeText('#contact', contact);
    await testController.selectText('#industry').pressKey('delete');
    await testController.typeText('#industry', industry);
    await testController.selectText('#image').pressKey('delete');
    await testController.typeText('#image', image);
    await testController.selectText('#description').pressKey('delete');
    await testController.typeText('#description', description);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const companyPage = new Company();

import { Selector } from 'testcafe';
import { navBar } from './navbar.component';

class SignupPage {
  constructor() {
    this.pageId = '#signup-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Signs up a new user, then checks to see that they are logged in by checking the navbar. */
  async signupUser(testController, username, firstName, lastName, role, password) {
    // Assuming new user is a student.
    if (role === 'student') {
      await this.isDisplayed(testController);
      await testController.typeText('#signup-form-email', username);
      await testController.typeText('#signup-form-password', password);
      await testController.click('#student-button');
      await testController.typeText('#signup-form-firstname', firstName);
      await testController.typeText('#signup-form-lastname', lastName);
      await testController.typeText('#signup-form-title', 'Test Title');
      const skillListSelector = Selector('#input-student-skills');
      const skillSelector = skillListSelector.find('#Programming');
      await testController.click(skillListSelector);
      await testController.click(skillSelector);
      const locationListSelector = Selector('#input-student-locations');
      const locationSelector = locationListSelector.find('#US');
      await testController.click(locationListSelector);
      await testController.click(locationSelector);
      await testController.typeText('#signup-form-bio', 'Test bio');
      await testController.typeText('#signup-form-webpage', 'http://techfolios.github.io/template/');
      await testController.typeText('#signup-form-picture', 'https://techfolios.github.io/template/images/molly.png');
      await testController.click('#signup-form-submit');
      await navBar.isLoggedIn(testController, username);
      await testController.click(Selector('.swal-button--confirm'));
    }
    if (role === 'company') {
      await this.isDisplayed(testController);
      await testController.typeText('#signup-form-email', username);
      await testController.typeText('#signup-form-password', password);
      await testController.click('#company-button');
      await testController.typeText('#signup-form-companyName', firstName);
      await testController.typeText('#signup-form-industry-title', 'Test industry');
      const locationListSelector2 = Selector('#input-company-locations');
      const locationSelector2 = locationListSelector2.find('#Seoul');
      await testController.click(locationListSelector2);
      await testController.click(locationSelector2);
      await testController.typeText('#signup-form-bio', 'Test bio');
      await testController.typeText('#signup-form-webpage', 'http://techfolios.github.io/template/');
      await testController.typeText('#signup-form-picture', 'https://techfolios.github.io/template/images/molly.png');
      await testController.click('#signup-form-submit');
      await navBar.isLoggedIn(testController, username);
      await testController.click(Selector('.swal-button--confirm'));
    }
  }
}

export const signupPage = new SignupPage();

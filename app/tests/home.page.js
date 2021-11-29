import { Selector } from 'testcafe';

class HomePage {
  constructor() {
    this.pageId = '#home-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  // For Bridging the Gap Admin section of Home page.
  /** Asserts that this page has a table with at least four rows,
   * one for the header and three for the default reports. */
  async hasDefaultReports(testController) {
    const rowCount = Selector('tr').count; // select <tr>
    await testController.expect(rowCount).gte(4);
  }

  // For Bridging the Gap Admin section of Home page.
  /** Deletes the new user that was created. In the test, the user is a student. */
  async deleteUser(testController, user) {
    await testController.typeText('#email-delete', user.username);
    const roleSelector = Selector('#role-delete');
    const studentOption = roleSelector.find('#studentR');
    // const companyOption = roleSelector.find('#companyR');
    await testController.click(roleSelector);
    // await testController.click(companyOption);
    // await testController.click(roleSelector);
    await testController.click(studentOption);
    await testController.click(roleSelector);
    await testController.click('#button-delete');
    await testController.click(Selector('.swal-button--confirm'));
  }

  // For Bridging the Gap Admin section of Home page.
  /** Sends an email from the admin to a user. */
  async sendEmail(testController, user) {
    const message = 'Hello Leilani Reich. This is a test run by testcafe to see if the Send Email ' +
      'to Clients section of the admin page in Home.jsx works.';
    await testController.typeText('#email-client-description', message);
    await testController.typeText('#email-client-email', user.username);
    await testController.click('#email-client-button');
    await testController.click(Selector('.swal-button--confirm'));
  }

  /** Sets the first name field to a new value, then checks that the update succeeded. */
  async setFirstName(testController, firstName) {
    // Delete text from first name field.
    await testController.selectText('#firstName').pressKey('delete');
    // Type in new first name.
    await testController.typeText('#firstName', firstName);
    // Submit it.
    await testController.click('#home-page-submit');
    // Click the OK button on the Sweet Alert.
    await testController.click(Selector('.swal-button--confirm'));
    // Check that the field is updated.
    await testController.expect(Selector('#firstName').value).eql(firstName);
  }

  /** Checks this page is displayed, then changes firstName field, checks update succeeded, then restores value. */
  // Should be able to use setFirstName without generating warnings with first release after 1.9.4. (Fixed in pull/5584).
  async updateProfile(testController, firstName) {
    const newFirstName = 'New First Name';
    await this.isDisplayed(testController);
    // Delete text from first name field.
    await testController.selectText('#firstName').pressKey('delete');
    // Type in new first name.
    await testController.typeText('#firstName', newFirstName);
    // Submit it.
    await testController.click('#home-page-submit');
    // Click the OK button on the Sweet Alert.
    await testController.click(Selector('.swal-button--confirm'));
    // Check that the field is updated.
    await testController.expect(Selector('#firstName').value).eql(newFirstName);
    // Now restore original value.
    await testController.selectText('#firstName').pressKey('delete');
    await testController.typeText('#firstName', firstName);
    await testController.click('#home-page-submit');
    await testController.click(Selector('.swal-button--confirm'));
    await testController.expect(Selector('#firstName').value).eql(firstName);
  }
}

export const homePage = new HomePage();

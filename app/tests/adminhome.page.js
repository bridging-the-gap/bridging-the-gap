import { Selector } from 'testcafe';

class AdminHomePage {
  constructor() {
    this.pageId = '#home-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  // For Bridging the Gap Admin section of Home page.
  /** Asserts that this page has a table with at least 21 rows,
   * one for the header and 20 for the default reports. */
  async hasDefaultReports(testController) {
    const rowCount = Selector('tr').count; // select <tr>
    await testController.expect(rowCount).gte(21);
  }

  // For Bridging the Gap Admin section of Home page.
  /** Deletes the new user that was created. In the test, the user is a student. */
  async deleteUser(testController, user) {
    await testController.typeText('#email-delete', user.username);
    await testController.click('#button-delete');
    await testController.click(Selector('.swal-button--confirm'));
  }

  async addCategories(testController) {
    const newSkillName = `skill-${new Date().getTime()}`.toString();
    const newLocationName = `location-${new Date().getTime()}`.toString();
    const catTypeSelector = Selector('#skill-or-location');
    // Checking addition of new skill category.
    const skillOption = catTypeSelector.child().withExactText('Skills');
    await testController.click(catTypeSelector);
    await testController.click(skillOption);
    await testController.click(catTypeSelector);
    await testController.typeText('#category-name', newSkillName);
    await testController.click('#add-cat-button');
    await testController.click(Selector('.swal-button--confirm'));
    await testController.click('#browseStudentsItem');
    const browseStudentsSelector = Selector('#skills');
    const skillSelector = browseStudentsSelector.find(`#${newSkillName}`);
    await testController.click(browseStudentsSelector);
    await testController.click(skillSelector);
    await testController.click(browseStudentsSelector);
    await testController.click('#submit');
    // Check that no card is displayed.
    const cardCount1 = Selector('.ui .card').count;
    await testController.expect(cardCount1).eql(0);

    // Checking addition of new location category.
    await testController.click('#homeMenuItem');
    const locationOption = catTypeSelector.child().withExactText('Locations');
    await testController.click(catTypeSelector);
    await testController.click(locationOption);
    await testController.click(catTypeSelector);
    await testController.typeText('#category-name', newLocationName);
    await testController.click('#add-cat-button');
    await testController.click(Selector('.swal-button--confirm'));
    await testController.click('#browseCompaniesItem');
    const browseCompaniesSelector = Selector('#locations');
    const locationSelector = browseCompaniesSelector.find(`#${newLocationName}`);
    await testController.click(browseCompaniesSelector);
    await testController.click(locationSelector);
    await testController.click(browseCompaniesSelector);
    await testController.click('#submit');
    // Check that no card is displayed.
    const cardCount2 = Selector('.ui .card').count;
    await testController.expect(cardCount2).eql(0);
  }

  async filterReportType(testController) {
    // Go back to home page to test report filter.
    await testController.click('#homeMenuItem');
    const reportTypeSelector = Selector('#report-filter-dropdown');
    const otherOption = reportTypeSelector.find('#other');
    await testController.click(reportTypeSelector);
    await testController.click(otherOption);
    const rowCount = Selector('tr').count; // select <tr>
    await testController.expect(rowCount).eql(8);
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
}

export const adminHomePage = new AdminHomePage();

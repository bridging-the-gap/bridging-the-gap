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
    const addTitle = 'a';
    const location = 'a';
    const pay = '$2';
    const industry = 'a';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const weblink = 'https://courses.ics.hawaii.edu/ics314f21/';
    const description = 'a';
    await testController.wait(25000).click('#addJob');
    await testController.typeText('#jobTitle', addTitle);
    await testController.typeText('#location', location);
    await testController.typeText('#salary', pay);
    await testController.typeText('#industry', industry);
    await testController.typeText('#image', image);
    await testController.typeText('#link', weblink);
    await testController.typeText('#description', description);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }

  /** Asserts if edit Job works */
  async editJob(testController) {
    const editTitle = '1';
    const location = '1';
    const pay = '$1';
    const industry = '1';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const description = '1';
    await testController.wait(20000).click('#editJob');
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

  async removeJob(testController) {
    await testController.click('#companyRemoveJob');
    const cardSelector = Selector('.card');
    const cardCount = await cardSelector.count;
    await testController.expect(cardCount).eql(2);
    // Check job is removed from job listings page.
    await navBar.goToJobsPage(testController);
    const jobSelector = Selector('.makeJobClass');
    const jobCount = await jobSelector.count;
    await testController.expect(jobCount).eql(14);
  }

  /** Asserts if edit Event works */
  async editEvent(testController) {
    const eventName = 'Default name 1';
    const location = 'UH Manoa';
    const date = '2022-03-02';
    const description = 'Test to edit event';
    const picture = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    await testController.wait(25000).click('#editEvent');
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

  async removeEvent(testController) {
    await testController.click('#companyRemoveEvent');
    const cardSelector = Selector('.card');
    const cardCount = await cardSelector.count;
    await testController.expect(cardCount).eql(1);
    // Check event is removed from events page.
    await navBar.goToEventsPage(testController);
    const eventSelector = Selector('.makeEventClass');
    const eventCount = await eventSelector.count;
    await testController.expect(eventCount).eql(18);
  }

  /** Asserts if edit Company works */
  async editCompany(testController) {
    const title = 'cafe';
    const location = 'Hawaii';
    const contact = 'bob@foo.com';
    const website = 'https://courses.ics.hawaii.edu/ics314f21/';
    const industry = 'Computer Engineering';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const description = 'This is not a company';
    await testController.click('#editCompany');
    await testController.selectText('#companyName').pressKey('delete');
    await testController.typeText('#companyName', title);
    await testController.selectText('#contact').pressKey('delete');
    await testController.typeText('#contact', contact);
    await testController.selectText('#image').pressKey('delete');
    await testController.typeText('#image', image);
    await testController.selectText('#webpage').pressKey('delete');
    await testController.typeText('#webpage', website);
    await testController.selectText('#industry').pressKey('delete');
    await testController.typeText('#industry', industry);
    const locationSelector = Selector('#multi-select-locations');
    const locationOptionToAdd = locationSelector.find(`#${location}`);
    await testController.click(locationSelector);
    await testController.click(locationOptionToAdd);
    await testController.click(locationSelector);
    await testController.selectText('#description').pressKey('delete');
    await testController.typeText('#description', description);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const companyPage = new Company();

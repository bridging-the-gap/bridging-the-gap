import { Selector } from 'testcafe';
import { navBar } from './navbar.component';

class CompanyHomePage {
  constructor() {
    this.pageID = '#company-home';
    this.pageSelector = Selector(this.pageID);
  }

  /** Asserts that this page is displayed */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async favoriteJobDisplayed(testController) {
    const jobSelector = Selector('.makeJobClass');
    const jobCount = await jobSelector.count;
    await testController.expect(jobCount).eql(1);
  }

  /** Go to add job page. */
  async gotoAddJob(testController) {
    await testController.wait(15000).click('#addJob');
  }

  /** Go to edit job page. */
  async gotoEditJob(testController) {
    await testController.wait(15000).click('#editJob');
  }

  async removeJob(testController) {
    await testController.click('#companyRemoveJob');
    const cardSelector = Selector('.card');
    const cardCount = await cardSelector.count;
    await testController.expect(cardCount).eql(4);
    // Check job is removed from job listings page.
    await navBar.goToJobsPage(testController);
    const jobSelector = Selector('.makeJobClass');
    const jobCount = await jobSelector.count;
    await testController.expect(jobCount).gte(15);
  }

  async goToAddEventPage(testController) {
    await testController.click('#home-addEvent');
  }

  /** Go to edit event page. */
  async gotoEditEvent(testController) {
    await testController.wait(15000).click('#editEvent');
  }

  async removeEvent(testController) {
    await testController.click('#companyRemoveEvent');
    const cardSelector = Selector('.card');
    const cardCount = await cardSelector.count;
    await testController.expect(cardCount).eql(3);
    // Check event is removed from events page.
    await navBar.goToEventsPage(testController);
    const eventSelector = Selector('.makeEventClass');
    const eventCount = await eventSelector.count;
    await testController.expect(eventCount).eql(18);
  }

  /** Go to edit company page. */
  async gotoEditCompany(testController) {
    await testController.click('#editCompany');
  }
}

export const companyHomePage = new CompanyHomePage();

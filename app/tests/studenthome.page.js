import { Selector } from 'testcafe';

class StudentHomePage {
  constructor() {
    this.pageId = '#home-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }

  async favoriteJobDisplayed(testController) {
    const jobSelector = Selector('#favorite');
    const jobCount = await jobSelector.count;
    await testController.wait(35000).expect(jobCount).eql(1);
  }

  async favoriteEventDisplayed(testController) {
    const eventSelector = Selector('#event-favorite');
    const eventCount = await eventSelector.count;
    await testController.wait(35000).expect(eventCount).eql(1);
  }

  async favoriteJobDeleted(testController) {
    const jobSelector = Selector('#favorite');
    const jobCount = await jobSelector.count;
    await testController.wait(5000).expect(jobCount).eql(0);
  }

  async favoriteEventDeleted(testController) {
    const eventSelector = Selector('#event-favorite');
    const eventCount = await eventSelector.count;
    await testController.wait(5000).expect(eventCount).eql(0);
  }
}

export const studentHomePage = new StudentHomePage();

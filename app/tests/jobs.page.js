import { Selector } from 'testcafe';

class JobsPage {
  constructor() {
    this.pageId = '#jobs-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks that the current page has at least three jobs on it.  */
  async hasDefaultJobs(testController) {
    const cardCount = Selector('.ui .item').count;
    await testController.expect(cardCount).gte(3);
  }

  async canFavoriteJobs(testController) {
    const favorite = Selector('#favorite');
    await testController.click(favorite);
  }
}

export const jobsPage = new JobsPage();

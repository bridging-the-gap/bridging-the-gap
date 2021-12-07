import { Selector } from 'testcafe';

class BrowseCompaniesPage {
  constructor() {
    this.pageId = '#browse-companies-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks this page is displayed, then checks that filtering works. */
  async filter(testController) {
    await this.isDisplayed(testController);
    // Select visualization and submit
    const locationSelector = Selector('#locations');
    const usOption = locationSelector.find('#US');
    await testController.click(locationSelector);
    await testController.click(usOption);
    await testController.click(locationSelector);
    await testController.click('#submit');
    // Check that only one card is displayed.
    const cardCount = Selector('.ui .card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const browseCompaniesPage = new BrowseCompaniesPage();

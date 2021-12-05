import { Selector } from 'testcafe';

class BrowseStudentsPage {
  constructor() {
    this.pageId = '#browse-students-page';
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
    const skillSelector = Selector('#skills');
    const programmingOption = skillSelector.find('#Programming');
    await testController.click(skillSelector);
    await testController.click(programmingOption);
    await testController.click(skillSelector);
    await testController.click('#submit');
    // Check that only one card is displayed.
    const cardCount = Selector('.ui .card').count;
    await testController.expect(cardCount).eql(9);
  }
}

export const browseStudentsPage = new BrowseStudentsPage();

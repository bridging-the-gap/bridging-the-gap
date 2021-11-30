import { Selector } from 'testcafe';

class EventsPage {
  constructor() {
    this.pageId = '#events-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks that the current page has at least three events on it.  */
  async hasDefaultEvents(testController) {
    const cardCount = Selector('.ui .item').count;
    await testController.expect(cardCount).gte(3);
  }
}

export const eventsPage = new EventsPage();

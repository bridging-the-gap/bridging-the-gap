import { Selector } from 'testcafe';

class AddEventPage {
  constructor() {
    this.pageId = '#add-event-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks this page is displayed, then adds a new project */
  async addEvent(testController) {
    const eventName = `my-new-event-${new Date().getTime()}`;
    const company = 'Test company';
    const date = `${new Date().getTime()}`;
    const location = 'Test location';
    const description = 'This is a new event used for testing purposes.';
    const picture = 'https://synapse.it/wp-content/uploads/2020/12/test.png';
    await this.isDisplayed(testController);
    // Define the new report.
    await testController.typeText('#eventName', eventName);
    await testController.typeText('#company', company);
    await testController.typeText('#date', date);
    await testController.typeText('#location', location);
    await testController.typeText('#description', description);
    await testController.typeText('#picture', picture);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addEventPage = new AddEventPage();

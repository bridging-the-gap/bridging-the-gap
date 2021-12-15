import { Selector } from 'testcafe';

class EditEventPage {
  constructor() {
    this.pageId = '#editEventPage';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts if edit Event works */
  async editEvent(testController) {
    const eventName = 'Default name 1';
    const location = 'UH Manoa';
    const date = '2022-03-02';
    const description = 'Test to edit event';
    const picture = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
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
}

export const editEventPage = new EditEventPage();

import { Selector } from 'testcafe';

class EditJobPage {
  constructor() {
    this.pageId = '#editJobPage';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts if edit Job works */
  async editJob(testController) {
    const editTitle = '1';
    const location = '1';
    const pay = '$1';
    const industry = '1';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const description = '1';
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
}

export const editJobPage = new EditJobPage();

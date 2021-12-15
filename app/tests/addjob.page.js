import { Selector } from 'testcafe';

class AddJobPage {
  constructor() {
    this.pageId = '#addJobPage';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts if add job works */
  async addJob(testController) {
    const addTitle = 'a';
    const location = 'a';
    const pay = '$2';
    const industry = 'a';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const weblink = 'https://courses.ics.hawaii.edu/ics314f21/';
    const description = 'a';
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
}

export const addJobPage = new AddJobPage();

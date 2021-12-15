import { Selector } from 'testcafe';

class EditCompanyPage {
  constructor() {
    this.pageId = '#editCompanyPage';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts if edit Company works */
  async editCompany(testController) {
    const title = 'cafe';
    const location = 'Hawaii';
    const contact = 'bob@foo.com';
    const website = 'https://courses.ics.hawaii.edu/ics314f21/';
    const industry = 'Computer Engineering';
    const image = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    const description = 'This is not a company';
    await testController.selectText('#companyName').pressKey('delete');
    await testController.typeText('#companyName', title);
    await testController.selectText('#contact').pressKey('delete');
    await testController.typeText('#contact', contact);
    await testController.selectText('#image').pressKey('delete');
    await testController.typeText('#image', image);
    await testController.selectText('#webpage').pressKey('delete');
    await testController.typeText('#webpage', website);
    await testController.selectText('#industry').pressKey('delete');
    await testController.typeText('#industry', industry);
    const locationSelector = Selector('#multi-select-locations');
    const locationOptionToAdd = locationSelector.find(`#${location}`);
    await testController.click(locationSelector);
    await testController.click(locationOptionToAdd);
    await testController.click(locationSelector);
    await testController.selectText('#description').pressKey('delete');
    await testController.typeText('#description', description);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const editCompanyPage = new EditCompanyPage();

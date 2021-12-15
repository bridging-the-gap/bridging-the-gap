import { Selector } from 'testcafe';

class CompanyProfilePage {
  constructor() {
    this.pageId = '#company-profile';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const companyProfilePage = new CompanyProfilePage();

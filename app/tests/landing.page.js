import { Selector } from 'testcafe';

class LandingPage {
  constructor() {
    this.pageId = '#landing-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 10 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(35000).expect(this.pageSelector.exists).ok();
  }

  /** Asserts that feedback section works. */
  async sendFeedback(testController, company) {
    const feedback = 'This is sample feedback used for testing purposes.';
    await testController.typeText('#from_name', `${company.firstName} ${company.lastName}`);
    await testController.typeText('#reply_to', company.username);
    await testController.typeText('#feedback', feedback);
    await testController.click('#feedback-button');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const landingPage = new LandingPage();

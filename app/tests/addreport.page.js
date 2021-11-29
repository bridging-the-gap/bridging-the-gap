import { Selector } from 'testcafe';

class AddReportPage {
  constructor() {
    this.pageId = '#add-report-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks this page is displayed, then adds a new report. */
  async addReport(testController) {
    const reportName = `my-new-report-${new Date().getTime()}`;
    const description = 'This is a new report used for testing purposes.';
    await this.isDisplayed(testController);
    // Define the new report.
    await testController.typeText('#reportName', reportName);
    await testController.typeText('#reportDescription', description);

    await testController.click('#reportSubmit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addReportPage = new AddReportPage();

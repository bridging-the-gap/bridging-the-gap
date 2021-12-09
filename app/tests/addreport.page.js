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
    // Test using the "Bug" option.
    const description = 'This is a new report used for testing purposes.';
    await this.isDisplayed(testController);
    // Define the new report.
    const reportTypeSelector = Selector('#reportType');
    const bugOption = reportTypeSelector.child().withExactText('Bug');
    await testController.click(reportTypeSelector);
    await testController.click(bugOption);
    await testController.typeText('#reportDescription', description);
    await testController.click('#reportSubmit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addReportPage = new AddReportPage();

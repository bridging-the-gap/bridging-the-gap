import { Selector } from 'testcafe';

class NavBar {

  /** If someone is logged in, then log them out, otherwise do nothing. */
  async ensureLogout(testController) {
    const loggedInUser = await Selector('#navbar-current-user').exists;
    if (loggedInUser) {
      await testController.click('#navbar-current-user');
      await testController.click('#navbar-sign-out');
    }
  }

  async gotoSigninPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-dropdown');
    await testController.click('#login-dropdown-sign-in');
  }

  async gotoAddReportPage(testController) {
    await testController.click('#navbar-current-user');
    await testController.click('#navbar-report');
  }

  async goToEventsPage(testController) {
    await testController.click('#eventItem');
  }

  async goToJobsPage(testController) {
    await testController.click('#jobItem');
  }

  async gotoBrowseCompaniesPage(testController) {
    await testController.click('#browseCompaniesItem');
  }

  async gotoBrowseStudentsPage(testController) {
    await testController.click('#browseStudentsItem');
  }

  async gotoStudentHomePage(testController) {
    await testController.click('#homeMenuItem');
  }

  async gotoStudentProfilePage(testController) {
    await testController.click('#profileMenuItem');
  }

  async gotoCompanyHomePage(testController) {
    await testController.click('#homeMenuItem');
  }

  async gotoCompanyProfilePage(testController) {
    await testController.click('#profileMenuItem');
  }

  /** Check that the specified user is currently logged in. */
  async isLoggedIn(testController, username) {
    await testController.expect(Selector('#navbar-current-user').innerText).eql(username);
  }

  /** Check that someone is logged in, then click items to logout. */
  async logout(testController) {
    await testController.expect(Selector('#navbar-current-user').exists).ok();
    await testController.click('#navbar-current-user');
    await testController.click('#navbar-sign-out');
  }

  /** Pull down login menu, go to sign up page. */
  async gotoSignupPage(testController) {
    await this.ensureLogout(testController);
    await testController.click('#login-dropdown');
    await testController.click('#login-dropdown-sign-up');
  }
}

export const navBar = new NavBar();

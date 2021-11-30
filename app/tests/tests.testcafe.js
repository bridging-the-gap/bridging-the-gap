import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { signupPage } from './signup.page';
import { addReportPage } from './addreport.page';
import { homePage } from './home.page';
import { addEventPage } from './addevent.page';
import { eventsPage } from './events.page';
import { navBar } from './navbar.component';
import { browseCompaniesPage } from './browsecompanies.page';
import { browseStudentsPage } from './browsestudents.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const student = { username: 'johnson@hawaii.edu', password: 'foo', role: 'student',
  firstName: 'Philip', lastName: 'Johnson' };
const company = { username: 'apple@apple.com', password: 'foo', role: 'company',
  firstName: 'Apple', lastName: 'Inc.' };
const admin = { username: 'sin8@hawaii.edu', password: 'foo', role: 'admin',
  firstName: 'Serge', lastName: 'Negrashov' };

fixture('Bridging the Gap localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up and works', async (testController) => {
  await landingPage.isDisplayed(testController);
  await landingPage.sendFeedback(testController, company);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that signup page, then logout works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUser = `user-${new Date().getTime()}@foo.com`;
  await navBar.gotoSignupPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, student.role, student.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});
/*
test('Test that profiles page displays', async (testController) => {
  await navBar.gotoProfilesPage(testController);
  await profilesPage.isDisplayed(testController);
  await profilesPage.hasDefaultProfiles(testController);
});

test('Test that interests page displays', async (testController) => {
  await navBar.gotoInterestsPage(testController);
  await interestsPage.isDisplayed(testController);
  await interestsPage.hasDefaultInterests(testController);
});

test('Test that projects page displays', async (testController) => {
  await navBar.gotoProjectsPage(testController);
  await projectsPage.isDisplayed(testController);
  await projectsPage.hasDefaultProjects(testController);
});
*/
// For the Bridging The Gap Home page (separate for student, company, and admin).
test('Test that home page displays and works for users in student, company, and admin roles',
  async (testController) => {
    // For admin section.
    // Create new user to test delete user section on.
    const newUser = { username: `person-${new Date().getTime()}@foo.com`, role: 'student', password: 'foo' };
    await navBar.gotoSignupPage(testController);
    await signupPage.isDisplayed(testController);
    await signupPage.signupUser(testController, newUser.username, newUser.role, newUser.password);
    // New user has successfully logged in, so now let's logout.
    await navBar.logout(testController);
    await signoutPage.isDisplayed(testController);
    // Now login as admin to test functionality.
    await navBar.ensureLogout(testController);
    await navBar.gotoSigninPage(testController);
    await signinPage.signin(testController, admin.username, admin.password);
    await homePage.isDisplayed(testController);
    // Checking if reports section displays properly.
    await homePage.hasDefaultReports(testController);
    // Checking if delete user component works.
    await homePage.deleteUser(testController, newUser);
    // Checking if email component works.
    // User to send email to (uncomment later)
    const emailUser = { username: 'reichld@hawaii.edu', role: 'student', password: 'foo' };
    await homePage.sendEmail(testController, emailUser);
    // Log out of admin account after finished.
    await navBar.ensureLogout(testController);

    // For company section.
    // For student section.
  });
// For the Bridging The Gap AddReport page.
test('Test that addReport page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await navBar.gotoAddReportPage(testController);
  await addReportPage.isDisplayed(testController);
  await addReportPage.addReport(testController);
});

test('Test that addEvent page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await homePage.goToAddEventPage(testController);
  await addEventPage.isDisplayed(testController);
  await addEventPage.addEvent(testController);
});

test('Test that event page displays', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.goToEventsPage(testController);
  await eventsPage.isDisplayed(testController);
  await eventsPage.hasDefaultEvents(testController);
});

// For the Bridging The Gap BrowseCompanies page.
test('Test that browse companies page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoBrowseCompaniesPage(testController);
  await browseCompaniesPage.isDisplayed(testController);
  await browseCompaniesPage.filter(testController);
});
// For the Bridging The Gap BrowseStudents page.
test('Test that browse students page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoBrowseStudentsPage(testController);
  await browseStudentsPage.isDisplayed(testController);
  await browseStudentsPage.filter(testController);
});

/*
test('Test that addProject page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoAddProjectPage(testController);
  await addProjectPage.isDisplayed(testController);
  await addProjectPage.addProject(testController);
});

test('Test that filter page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoFilterPage(testController);
  await filterPage.isDisplayed(testController);
  await filterPage.filter(testController);
});
*/

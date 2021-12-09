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
import { companyPage } from './company.page';
import { jobsPage } from './jobs.page';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const student = { username: 'reichld@hawaii.edu', password: 'foo', role: 'student',
  firstName: 'Leilani', lastName: 'Reich' };
const company = { username: 'hr@google.com', password: 'foo', role: 'company',
  firstName: 'Google', lastName: '' };
const admin = { username: 'johnson@hawaii.edu', password: 'foo', role: 'admin',
  firstName: 'Philip', lastName: 'Johnson' };

fixture('Bridging the Gap localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up and works', async (testController) => {
  await landingPage.isDisplayed(testController);
  // Comment out for now because EmailJS limits emails
  // await landingPage.sendFeedback(testController, company);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that signup page, then logout works', async (testController) => {
  // For student user:
  // Create a new user email address that's guaranteed to be unique.
  const newUserFirstName = `user-${new Date().getTime()}`;
  const newUserLastName = 'Test lastname';
  const newUser = `${newUserFirstName}@foo.com`;
  await navBar.gotoSignupPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, newUserFirstName, newUserLastName, student.role, student.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
  // For company user:
  // Create a new user email address that's guaranteed to be unique.
  // First name acts as company name for company user.
  const newUserFirstName2 = `user-${new Date().getTime()}`;
  const newUser2 = `${newUserFirstName2}@foo.com`;
  await navBar.gotoSignupPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser2, newUserFirstName2, '', company.role, company.password);
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
    // Create new student user to test delete user section on.
    const newUserFirstName = `user-${new Date().getTime()}`;
    const newUserLastName = 'Test lastname 2';
    const newUser = { username: `${newUserFirstName}@foo.com`, role: 'student', password: 'foo' };
    await navBar.gotoSignupPage(testController);
    await signupPage.isDisplayed(testController);
    await signupPage.signupUser(testController, newUser.username, newUserFirstName, newUserLastName, newUser.role, newUser.password);
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
    // Checking if email component works:
    // Comment out for now because EmailJS limits emails.
    // const emailUser = { username: 'reichld@hawaii.edu', role: 'student', password: 'foo' };
    // await homePage.sendEmail(testController, emailUser);
    await homePage.addCategories(testController);
    await homePage.filterReportType(testController);
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

// For the Bridging The Gap Job page.
test('Test that job page displays', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await navBar.goToJobsPage(testController);
  await jobsPage.isDisplayed(testController);
  await jobsPage.hasDefaultJobs(testController);
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

test('Test that student profile page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoStudentProfilePage(testController);
});

test('Test that student home page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoStudentHomePage(testController);
});

// Company Page Tests
test('Test that the company homepage works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyPage.isDisplayed(testController);
});

test('Test Add jobs works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyPage.gotoAddJob(testController);
});

test('Test Edit jobs works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyPage.editJob(testController);
});

test('Test Edit company works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyPage.editCompany(testController);
});

test('Test Edit event works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await navBar.gotoCompanyHomePage(testController);
  await companyPage.editEvent(testController);
});

test('Test that the company profile works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await navBar.gotoCompanyProfilePage(testController);
});

// Shouldn't be necessary now since signup page takes care of adding company profile.
/* test.only('Test that add company works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUserCompanyName = `user-${new Date().getTime()}`;
  const newUser = `${newUserCompanyName}@foo.com`;
  await navBar.gotoSignupPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, newUserCompanyName, '', company.role, company.password);
  await navBar.gotoCompanyHomePage(testController);
  await companyPage.addCompany(testController);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
}); */
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

import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { signupPage } from './signup.page';
import { addReportPage } from './addreport.page';
import { adminHomePage } from './adminhome.page';
import { addEventPage } from './addevent.page';
import { addJobPage } from './addjob.page';
import { editJobPage } from './editjob.page';
import { editEventPage } from './editevent.page';
import { editCompanyPage } from './editcompany.page';
import { eventsPage } from './events.page';
import { navBar } from './navbar.component';
import { browseCompaniesPage } from './browsecompanies.page';
import { browseStudentsPage } from './browsestudents.page';
import { studentHomePage } from './studenthome.page';
import { studentProfilePage } from './studentprofile.page';
import { companyHomePage } from './companyhome.page';
import { companyProfilePage } from './companyprofile.page';
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

test('Test that admin homepage displays and works.',
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
    await adminHomePage.isDisplayed(testController);
    // Checking if reports section displays properly.
    await adminHomePage.hasDefaultReports(testController);
    // Checking if delete user component works.
    await adminHomePage.deleteUser(testController, newUser);
    // Checking if email component works:
    // Comment out for now because EmailJS limits emails.
    // const emailUser = { username: 'reichld@hawaii.edu', role: 'student', password: 'foo' };
    // await homePage.sendEmail(testController, emailUser);
    await adminHomePage.addCategories(testController);
    await adminHomePage.filterReportType(testController);
    // Log out of admin account after finished.
    await navBar.ensureLogout(testController);
  });

test('Test that job listings page displays and can favorite', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.goToJobsPage(testController);
  await jobsPage.isDisplayed(testController);
  await jobsPage.hasDefaultJobs(testController);
  await jobsPage.canFavoriteJobs(testController);
  await navBar.gotoStudentHomePage(testController);
  await companyHomePage.favoriteJobDisplayed(testController);
  await navBar.goToJobsPage(testController);
  await jobsPage.canFavoriteJobs(testController);
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
  await companyHomePage.goToAddEventPage(testController);
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

test('Test that student homepage works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoStudentHomePage(testController);
  await studentHomePage.isDisplayed(testController);
});

test('Test that student profile page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, student.username, student.password);
  await navBar.gotoStudentProfilePage(testController);
  await studentProfilePage.isDisplayed(testController);
});

// Company Page Tests
test('Test that the company homepage works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyHomePage.isDisplayed(testController);
});

test('Test Add jobs works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyHomePage.gotoAddJob(testController);
  await addJobPage.isDisplayed(testController);
  await addJobPage.addJob(testController);
});

test('Test Edit jobs works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyHomePage.gotoEditJob(testController);
  await editJobPage.isDisplayed(testController);
  await editJobPage.editJob(testController);
  await navBar.gotoCompanyHomePage(testController);
  await companyHomePage.removeJob(testController);
});

test('Test Edit company works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyHomePage.gotoEditCompany(testController);
  await editCompanyPage.editCompany(testController);
});

test('Test Edit event works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await companyHomePage.gotoEditEvent(testController);
  await editEventPage.isDisplayed(testController);
  await editEventPage.editEvent(testController);
  await navBar.gotoCompanyHomePage(testController);
  await companyHomePage.removeEvent(testController);
});

test('Test that the company profile works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, company.username, company.password);
  await navBar.gotoCompanyProfilePage(testController);
  await companyProfilePage.isDisplayed(testController);
});

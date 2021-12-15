import { Selector } from 'testcafe';

class EditProfilePage {
  constructor() {
    this.pageId = '#edit-profile-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Asserts if edit Profile works */
  async editProfile(testController) {
    const fName = 'firstName';
    const lName = 'lastName';
    const location = 'Virginia';
    const skill = 'Programming';
    const bio = 'This is a test bio.';
    const title = 'Test Title.';
    const webpage = 'https://courses.ics.hawaii.edu/ics314f21/';
    const picture = 'https://www.pbs.org/wnet/nature/files/2017/07/fish-1534844_1920.jpg';
    await testController.selectText('#firstName').pressKey('delete');
    await testController.typeText('#firstName', fName);
    await testController.selectText('#lastName').pressKey('delete');
    await testController.typeText('#lastName', lName);
    await testController.selectText('#bio').pressKey('delete');
    await testController.typeText('#bio', bio);
    await testController.selectText('#title').pressKey('delete');
    await testController.typeText('#title', title);
    await testController.selectText('#picture').pressKey('delete');
    await testController.typeText('#picture', picture);
    await testController.selectText('#webpage').pressKey('delete');
    await testController.typeText('#webpage', webpage);
    const locationSelector = Selector('#locations');
    const locationOptionToAdd = locationSelector.find(`#${location}`);
    await testController.click(locationSelector);
    await testController.click(locationOptionToAdd);
    await testController.click(locationSelector);
    const skillSelector = Selector('#skills');
    const skillOptionToAdd = skillSelector.find(`#${skill}`);
    await testController.click(skillSelector);
    await testController.click(skillOptionToAdd);
    await testController.click(skillSelector);
    await testController.click('#edit-profile-page-submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const editProfilePage = new EditProfilePage();

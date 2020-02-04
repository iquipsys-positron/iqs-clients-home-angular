import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getBreadcrumbText() {
    return element(by.css('pip-breadcrumb span')).getText();
  }
}

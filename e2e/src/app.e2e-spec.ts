import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should set title to \'Home\'', () => {
    page.navigateTo();
    expect(page.getBreadcrumbText()).toEqual('Home');
  });
});

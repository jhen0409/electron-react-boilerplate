/* eslint-disable */
import { Application } from 'spectron';
import { expect } from 'chai';
import electronPath from 'electron';
import path from 'path';
import homeStyles from '../app/components/Home.css';
import counterStyles from '../app/components/Counter.css';

const delay = time => new Promise(resolve => setTimeout(resolve, time));

// HACK to fix test timeout
global.Promise = require.requireActual('promise');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 second timeout

describe('main window', function spec() {
  beforeAll(async () => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..', 'app')],
    });
    return this.app.start();
  });

  afterAll(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  const findCounter = () => this.app.client.element(`.${counterStyles.counter}`);

  const findButtons = async () => {
    const { value } = await this.app.client.elements(`.${counterStyles.btn}`);
    return value.map(btn => btn.ELEMENT);
  };

  it('should open window', async () => {
    const { client, browserWindow } = this.app;

    await client.waitUntilWindowLoaded();
    await delay(500);
    const title = await browserWindow.getTitle();
    expect(title).to.equal('Hello Electron React!');
  }, 10000);

  it('should to Counter with click "to Counter" link', async () => {
    const { client } = this.app;

    await client.click(`.${homeStyles.container} > a`);
    expect(await findCounter().getText()).to.equal('0');
  }, 10000);

  it('should display updated count after increment button click', async () => {
    const { client } = this.app;

    const buttons = await findButtons();
    await client.elementIdClick(buttons[0]);  // +
    expect(await findCounter().getText()).to.equal('1');
  }, 10000);

  it('should display updated count after descrement button click', async () => {
    const { client } = this.app;

    const buttons = await findButtons();
    await client.elementIdClick(buttons[1]);  // -
    expect(await findCounter().getText()).to.equal('0');
  }, 10000);

  it('shouldnt change if even and if odd button clicked', async () => {
    const { client } = this.app;

    const buttons = await findButtons();
    await client.elementIdClick(buttons[2]);  // odd
    expect(await findCounter().getText()).to.equal('0');
  }, 10000);

  it('should change if odd and if odd button clicked', async () => {
    const { client } = this.app;

    const buttons = await findButtons();
    await client.elementIdClick(buttons[0]);  // +
    await client.elementIdClick(buttons[2]);  // odd
    expect(await findCounter().getText()).to.equal('2');
  }, 10000);

  it('should change if async button clicked and a second later', async () => {
    const { client } = this.app;

    const buttons = await findButtons();
    await client.elementIdClick(buttons[3]);  // async
    expect(await findCounter().getText()).to.equal('2');
    await delay(1000);
    expect(await findCounter().getText()).to.equal('3');
  }, 10000);

  it('should back to home if back button clicked', async () => {
    const { client } = this.app;
    await client.element(
      `.${counterStyles.backButton} > a`
    ).click();

    expect(
      await client.isExisting(`.${homeStyles.container}`)
    ).to.be.true;
  }, 10000);
});
